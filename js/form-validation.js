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

    // Функция для показа статуса отправки
    function showSubmitStatus(type, message) {
        // Сохраняем оригинальный HTML кнопки
        if (!submitButton.dataset.originalHtml) {
            submitButton.dataset.originalHtml = submitButton.innerHTML;
        }

        if (type === 'success') {
            submitButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-right: 8px;">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${message}
            `;
            submitButton.classList.add('success');
            submitButton.disabled = true;
            
            // НЕ возвращаем кнопку в исходное состояние после успеха
            // Кнопка остается в состоянии "Відправлено!"
            
        } else if (type === 'error') {
            submitButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-right: 8px;">
                    <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12.5 7.5L7.5 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7.5 7.5L12.5 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                ${message}
            `;
            submitButton.classList.add('error');
            
            // Через 3 секунды возвращаем обычное состояние только при ошибке
            setTimeout(() => {
                resetSubmitButtonOnError();
            }, 3000);
        }
    }

    // Функция для сброса кнопки в исходное состояние
    function resetSubmitButton() {
        if (submitButton.dataset.originalHtml) {
            submitButton.innerHTML = submitButton.dataset.originalHtml;
        } else {
            submitButton.textContent = 'Відправити';
        }
        submitButton.classList.remove('loading', 'error');
        submitButton.disabled = false;
    }

    // Функция для сброса кнопки только при ошибке
    function resetSubmitButtonOnError() {
        if (submitButton.dataset.originalHtml) {
            submitButton.innerHTML = submitButton.dataset.originalHtml;
        } else {
            submitButton.textContent = 'Відправити';
        }
        submitButton.classList.remove('loading', 'success', 'error');
        submitButton.disabled = false;
    }

    // Функция для показа состояния загрузки
    function showLoadingState() {
        submitButton.innerHTML = `
            <div class="spinner" style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>
            Відправляється...
        `;
        submitButton.classList.add('loading');
        submitButton.disabled = true;
    }

    // Добавляем стили для анимации спиннера
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .request-form__submit.loading {
            opacity: 0.8;
        }
        .request-form__submit.success {
            background-color: #10b981;
            border-color: #10b981;
        }
        .request-form__submit.error {
            background-color: #ef4444;
            border-color: #ef4444;
        }
    `;
    document.head.appendChild(style);

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

            const responseText = await response.text();
            console.log('Текст ответа:', responseText);

            let result;
            try {
                result = responseText ? JSON.parse(responseText) : { success: false, error: 'Пустой ответ от сервера' };
            } catch (parseError) {
                console.error('Ошибка парсинга JSON:', parseError);
                console.error('Полученный текст:', responseText);
                
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
        
        // Проверяем, не была ли форма уже успешно отправлена
        if (submitButton.classList.contains('success')) {
            return; // Предотвращаем повторную отправку
        }
        
        if (validateForm()) {
            showLoadingState();
            
            // Собираем данные формы
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const result = await submitToServer(data);
                
                if (result.success) {
                    showSubmitStatus('success', 'Відправлено!');
                    form.reset();
                    inputs.forEach(input => hideError(input));
                } else {
                    showSubmitStatus('error', 'Помилка');
                    // Дополнительно показываем ошибки в консоли
                    if (result.errors && result.errors.length > 0) {
                        console.error('Ошибки отправки:', result.errors);
                    }
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showSubmitStatus('error', 'Помилка');
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
            
            // Если форма была успешно отправлена, но пользователь начал редактировать поля,
            // сбрасываем состояние кнопки
            if (submitButton.classList.contains('success')) {
                resetSubmitButton();
            }
        });
    });

    const consentCheckbox = document.getElementById('consent');
    consentCheckbox.addEventListener('change', function() {
        validateField(this);
        
        // Если форма была успешно отправлена, но пользователь изменил чекбокс,
        // сбрасываем состояние кнопки
        if (submitButton.classList.contains('success')) {
            resetSubmitButton();
        }
    });
});