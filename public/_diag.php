<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$basePath = dirname(__DIR__);
$result = [
    'php_version' => PHP_VERSION,
    'base_path' => $basePath,
    'checks' => [
        'bootstrap_app' => file_exists($basePath.'/bootstrap/app.php'),
        'vendor_autoload' => file_exists($basePath.'/vendor/autoload.php'),
        'env_file' => file_exists($basePath.'/.env'),
        'storage_dir' => is_dir($basePath.'/storage'),
        'storage_writable' => is_writable($basePath.'/storage'),
    ],
];

try {
    require_once $basePath.'/vendor/autoload.php';
    $app = require_once $basePath.'/bootstrap/app.php';
    $result['laravel_bootstrap'] = is_object($app);
} catch (\Throwable $e) {
    $result['laravel_bootstrap'] = false;
    $result['bootstrap_error'] = [
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'type' => get_class($e),
    ];
}

$logFile = $basePath.'/storage/logs/laravel.log';
if (is_file($logFile) && is_readable($logFile)) {
    $lines = @file($logFile, FILE_IGNORE_NEW_LINES);
    if (is_array($lines)) {
        $result['log_tail'] = array_slice($lines, -80);
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
