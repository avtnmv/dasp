document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('requestForm');
    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('.request-form__submit');

    function showError(input, message) {
        const errorElement = document.getElementById(input.name + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        input.classList.add('error');
    }

    function hideError(input) {
        const errorElement = document.getElementById(input.name + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        input.classList.remove('error');
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && (cleanPhone.startsWith('380') || cleanPhone.startsWith('0'));
    }

    // УЛУЧШЕННАЯ функция для отправки данных
    async function submitToServer(formData) {
        try {
            console.log('Отправка данных:', formData);
            
            const response = await fetch('/.netlify/functions/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Статус ответа:', response.status);
            console.log('OK:', response.ok);

            // Сначала получаем текст ответа
            const responseText = await response.text();
            console.log('Текст ответа:', responseText);

            let result;
            try {
                // Пробуем распарсить JSON
                result = responseText ? JSON.parse(responseText) : { success: false, error: 'Пустой ответ от сервера' };
            } catch (parseError) {
                console.error('Ошибка парсинга JSON:', parseError);
                console.error('Полученный текст:', responseText);
                
                // Если не JSON, возвращаем ошибку
                return { 
                    success: false, 
                    errors: ['Сервер вернул некорректный ответ: ' + responseText] 
                };
            }
            
            if (result.success) {
                return { success: true, message: result.message };
            } else {
                return { 
                    success: false, 
                    errors: result.errors || [result.error || 'Неизвестная ошибка сервера'] 
                };
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            return { 
                success: false, 
                errors: ['Ошибка соединения с сервером: ' + error.message] 
            };
        }
    }

    function validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;

        hideError(input);
            
        if (input.hasAttribute('required')) {
            if (!value) {
                let message = '';
                switch (fieldName) {
                    case 'name':
                        message = 'Будь ласка, введіть своє ім\'я';
                        break;
                    case 'phone':
                        message = 'Будь ласка, введіть свій телефон';
                        break;
                    case 'email':
                        message = 'Будь ласка, введіть свій Email';
                        break;
                    case 'consent':
                        message = 'Будь ласка, дайте згоду на обробку персональних даних';
                        break;
                    default:
                        message = 'Це поле обов\'язкове для заповнення';
                }
                showError(input, message);
                return false;
            }
        }

        if (fieldName === 'email' && value && !validateEmail(value)) {
            showError(input, 'Будь ласка, введіть коректний Email адрес');
            return false;
        }

        if (fieldName === 'phone' && value && !validatePhone(value)) {
            showError(input, 'Будь ласка, введіть коректний номер телефону');
            return false;
        }

        return true;
    }

    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitButton.textContent = 'Відправляється...';
            submitButton.disabled = true;
            
            // Собираем данные формы
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const result = await submitToServer(data);
                
                if (result.success) {
                    alert('✅ Дякуємо! Ваша заявка успішно відправлена.');
                    form.reset();
                    inputs.forEach(input => hideError(input));
                } else {
                    // Показываем ошибки
                    if (result.errors && result.errors.length > 0) {
                        alert('❌ Помилка: ' + result.errors.join(', '));
                    } else {
                        alert('❌ Помилка відправки заявки. Спробуйте пізніше.');
                    }
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('❌ Помилка відправки заявки. Спробуйте пізніше.');
            } finally {
                submitButton.textContent = 'Відправити';
                submitButton.disabled = false;
            }
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                hideError(this);
            }
        });
    });

    const consentCheckbox = document.getElementById('consent');
    consentCheckbox.addEventListener('change', function() {
        validateField(this);
    });
});