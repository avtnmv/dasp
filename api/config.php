<?php

return [
    'telegram' => [
        'bot_token' => getenv('TELEGRAM_BOT_TOKEN') ?: '8283980015:AAFFcQEPZXdOFg-DacqqHGiVhaHBirkGtuQ',
        'chat_id' => getenv('TELEGRAM_CHAT_ID') ?: '-1003175062060',
        'api_url' => 'https://api.telegram.org/bot'
    ],
    
    'site' => [
        'name' => 'DASP',
        'url' => 'https://your-domain.com'
    ],
    
    'form' => [
        'required_fields' => ['name', 'phone', 'consent'],
        'optional_fields' => ['email', 'objectType', 'comment']
    ]
];
?>
