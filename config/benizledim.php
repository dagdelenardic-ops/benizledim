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
];
