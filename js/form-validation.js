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

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitButton.textContent = 'Відправляється...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Дякуємо! Ваша заявка успішно відправлена.');
                form.reset();
                submitButton.textContent = 'Відправити';
                submitButton.disabled = false;
                
                inputs.forEach(input => hideError(input));
            }, 2000);
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
