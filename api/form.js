export default async function handler(req, res) {
  // --- Разрешаем CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Метод не дозволений' });
    return;
  }

  try {
    const data = req.body;

    // --- Валидация данных ---
    const errors = validateFormData(data);
    if (errors.length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    // --- Формируем сообщение ---
    const message = formatMessage(data);

    // --- Отправляем в Telegram ---
    const result = await sendToTelegram(message);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Повідомлення успішно відправлено!',
      });
    } else {
      console.error('Telegram API Error:', result.response);
      res.status(500).json({
        success: false,
        error: 'Помилка відправки повідомлення. Спробуйте пізніше.',
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера',
    });
  }
}

// ======================= //
// ====== HELPERS ======= //
// ======================= //

function validateFormData(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2)
    errors.push("Ім'я повинно містити мінімум 2 символи");

  if (!data.phone || !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(data.phone))
    errors.push('Некорректний номер телефону');

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push('Некорректна email адреса');

  if (!data.consent)
    errors.push('Потрібна згода на обробку персональних даних');

  return errors;
}

function formatMessage(data) {
  let message = "🎨 <b>Нова заявка з сайту DASP</b>\n\n";
  message += `👤 <b>Ім'я:</b> ${escapeHtml(data.name)}\n`;
  message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;

  if (data.email) message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n`;
  if (data.objectType)
    message += `🏠 <b>Тип об'єкта:</b> ${escapeHtml(data.objectType)}\n`;
  if (data.comment)
    message += `💬 <b>Коментар:</b>\n${escapeHtml(data.comment)}\n`;

  message += `\n🌐 <b>Джерело:</b> ${data.referrer || 'Прямий доступ'}`;
  message += `\n🕐 <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;
  return message;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendToTelegram(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8283980015:AAFFcQEPZXdOFg-DacqqHGiVhaHBirkGtuQ';
  const chatId = process.env.TELEGRAM_CHAT_ID || '-1003175062060';
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  const result = await res.json();
  return { success: res.ok, response: result };
}
