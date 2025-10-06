exports.handler = async function(event, context) {
    // Разрешаем CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
  
    // Обрабатываем preflight OPTIONS запрос
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }
  
    // Проверяем что метод POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }
  
    try {
      // Парсим данные из формы
      const { name, phone, email, objectType, comment } = JSON.parse(event.body);
  
      // 🔒 Используем переменные окружения
      const botToken = process.env.BOT_TOKEN;
      const chatId = process.env.CHAT_ID;
  
      // Проверяем что переменные установлены
      if (!botToken || !chatId) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Telegram credentials not configured' 
          })
        };
      }
  
      // Формируем сообщение для Telegram
      const message = `
  📋 <b>Нова заявка з сайту</b>
  
  👤 <b>Ім'я:</b> ${name}
  📞 <b>Телефон:</b> ${phone}
  📧 <b>Email:</b> ${email}
  🏢 <b>Тип об'єкта:</b> ${objectType}
  💬 <b>Коментар:</b> ${comment || 'Не вказано'}
      `.trim();
  
      // Отправляем в Telegram
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
  
      const data = await response.json();
  
      if (data.ok) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Заявку успішно відправлено!' 
          })
        };
      } else {
        console.error('Telegram API error:', data);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Помилка відправки в Telegram: ' + (data.description || 'Unknown error')
          })
        };
      }
    } catch (error) {
      console.error('Function error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Внутрішня помилка сервера: ' + error.message 
        })
      };
    }
  };