<?php

$adminEmails = array_filter(array_map(
    static fn (string $email): string => strtolower(trim($email)),
    explode(',', (string) env('ADMIN_EMAILS', 'gurursonmez@gmail.com,gurur@benizledim.com'))
));

return [
    'admin_emails' => array_values($adminEmails),
    'primary_admin' => [
        'email' => env('PRIMARY_ADMIN_EMAIL', 'gurursonmez@gmail.com'),
        'name' => env('PRIMARY_ADMIN_NAME', 'Gurur Sonmez'),
    ],
    'canonical_url' => env('APP_URL', 'http://localhost'),
    'canonical_redirect_hosts' => array_values(array_filter(array_map(
        static fn (string $host): string => strtolower(trim($host)),
        explode(',', (string) env('CANONICAL_REDIRECT_HOSTS', 'www.benizledim.com,benizledim.store,www.benizledim.store'))
    ))),
];
