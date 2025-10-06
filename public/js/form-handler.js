document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form'); // id формы
  
    if (!form) return; // защита, если на странице нет формы
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const response = await fetch('/api/form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          alert('Форма успішно відправлена!');
          form.reset();
        } else {
          alert('Помилка при відправленні форми.');
        }
      } catch (error) {
        alert('Сталася помилка при з’єднанні з сервером.');
      }
    });
  });
  