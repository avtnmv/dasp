const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { name, phone, email, objectType, comment } = JSON.parse(event.body);

    // Ваши токены
    const botToken = '8283980015:AAFFcQEPZXdOFg-DacqqHGiVhaHBirkGtuQ';
    const chatId = '-1003175062060';

    const message = `
📋 <b>Нова заявка з сайту</b>

👤 <b>Ім'я:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email}
🏢 <b>Тип об'єкта:</b> ${objectType}
💬 <b>Коментар:</b> ${comment || 'Не вказано'}
    `.trim();

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
          error: 'Помилка відправки в Telegram' 
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
        error: 'Внутрішня помилка сервера' 
      })
    };
  }
};