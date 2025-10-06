<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$config = require_once __DIR__ . '/config.php';

function sendToTelegram($message, $config) {
    $telegramConfig = $config['telegram'];
    $url = $telegramConfig['api_url'] . $telegramConfig['bot_token'] . '/sendMessage';
    
    $data = [
        'chat_id' => $telegramConfig['chat_id'],
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'success' => $httpCode === 200,
        'response' => json_decode($response, true),
        'http_code' => $httpCode
    ];
}

function validateFormData($data) {
    $errors = [];
    
    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors[] = 'Ім\'я повинно містити мінімум 2 символи';
    }
    
    if (empty($data['phone']) || !preg_match('/^[\+]?[0-9\s\-\(\)]{10,}$/', $data['phone'])) {
        $errors[] = 'Некорректний номер телефону';
    }
    
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Некорректна email адреса';
    }
    
    if (empty($data['consent'])) {
        $errors[] = 'Потрібна згода на обробку персональних даних';
    }
    
    return $errors;
}

function formatMessage($data) {
    $message = "🎨 <b>Нова заявка з сайту DASP</b>\n\n";
    
    $message .= "👤 <b>Ім'я:</b> " . htmlspecialchars($data['name']) . "\n";
    $message .= "📞 <b>Телефон:</b> " . htmlspecialchars($data['phone']) . "\n";
    
    if (!empty($data['email'])) {
        $message .= "📧 <b>Email:</b> " . htmlspecialchars($data['email']) . "\n";
    }
    
    if (!empty($data['objectType'])) {
        $message .= "🏠 <b>Тип об'єкта:</b> " . htmlspecialchars($data['objectType']) . "\n";
    }
    
    if (!empty($data['comment'])) {
        $message .= "💬 <b>Коментар:</b>\n" . htmlspecialchars($data['comment']) . "\n";
    }
    
    $message .= "\n🌐 <b>Джерело:</b> " . ($_SERVER['HTTP_REFERER'] ?? 'Прямий доступ');
    $message .= "\n🕐 <b>Час:</b> " . date('d.m.Y H:i:s');
    
    return $message;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не дозволений']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input)) {
    $input = $_POST;
}

$errors = validateFormData($input);

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
    exit;
}

$message = formatMessage($input);

$result = sendToTelegram($message, $config);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Повідомлення успішно відправлено!'
    ]);
} else {
    error_log('Telegram API Error: ' . json_encode($result['response']));
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Помилка відправки повідомлення. Спробуйте пізніше.'
    ]);
}
?>
