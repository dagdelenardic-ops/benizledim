<?php
// Tek seferlik: Laravel cache klasörünü temizler ve OPcache'i sıfırlar.
// Cache temizlendikten sonra silinmeli.
// URL: https://benizledim.com/recache.php?token=bizledim2026
// v3 — force redeploy

if (($_GET['token'] ?? '') !== 'bizledim2026') {
    http_response_code(403);
    exit('forbidden');
}

header('Content-Type: text/plain; charset=utf-8');

$root = dirname(__DIR__);
$out = [];

// Bootstrap cache files (route, config, services, packages)
$cacheDir = $root . '/bootstrap/cache';
if (is_dir($cacheDir)) {
    foreach (glob($cacheDir . '/*.php') as $f) {
        if (basename($f) === '.gitignore') continue;
        $ok = @unlink($f);
        $out[] = ($ok ? '[OK] ' : '[ERR] ') . 'unlink ' . basename($f);
    }
} else {
    $out[] = '[--] bootstrap/cache not found at ' . $cacheDir;
}

// storage/framework/cache (data cache, views)
foreach (['cache/data', 'views', 'sessions'] as $sub) {
    $dir = $root . '/storage/framework/' . $sub;
    if (is_dir($dir)) {
        $count = 0;
        $iter = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($iter as $item) {
            if ($item->isDir()) continue;
            if ($item->getFilename() === '.gitignore') continue;
            if (@unlink($item->getPathname())) $count++;
        }
        $out[] = "[OK] cleared {$count} files from storage/framework/{$sub}";
    }
}

// OPcache reset
if (function_exists('opcache_reset')) {
    opcache_reset();
    $out[] = '[OK] opcache_reset()';
} else {
    $out[] = '[--] opcache not loaded';
}

// Sanity check
$ctrl = $root . '/app/Http/Controllers/HomeController.php';
if (file_exists($ctrl)) {
    $hasNew = strpos(file_get_contents($ctrl), 'kayıtları') !== false;
    $out[] = '[INFO] HomeController.php contains "kayıtları": ' . ($hasNew ? 'YES' : 'NO');
    $out[] = '[INFO] HomeController.php mtime: ' . date('Y-m-d H:i:s', filemtime($ctrl));
}

echo implode("\n", $out) . "\n";
