<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$basePath = dirname(__DIR__);

$result = [
    'ok' => true,
    'php_version' => PHP_VERSION,
    'base_path' => $basePath,
    'checks' => [
        'bootstrap_app' => file_exists($basePath . '/bootstrap/app.php'),
        'vendor_autoload' => file_exists($basePath . '/vendor/autoload.php'),
        'env_file' => file_exists($basePath . '/.env'),
        'storage_dir' => is_dir($basePath . '/storage'),
        'storage_writable' => is_writable($basePath . '/storage'),
    ],
];

try {
    require_once $basePath . '/vendor/autoload.php';
    $app = require_once $basePath . '/bootstrap/app.php';
    $result['laravel_bootstrap'] = is_object($app);
} catch (\Throwable $e) {
    $result['ok'] = false;
    $result['laravel_bootstrap'] = false;
    $result['error'] = [
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'type' => get_class($e),
    ];
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
