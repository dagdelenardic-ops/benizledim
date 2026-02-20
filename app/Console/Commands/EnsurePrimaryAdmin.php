<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class EnsurePrimaryAdmin extends Command
{
    protected $signature = 'benizledim:ensure-admin {--email=} {--name=} {--password=}';

    protected $description = 'Create or update the primary admin account with a secure hashed password';

    public function handle(): int
    {
        $email = strtolower((string) ($this->option('email') ?: config('benizledim.primary_admin.email')));
        $name = (string) ($this->option('name') ?: config('benizledim.primary_admin.name') ?: 'Admin');
        $password = (string) ($this->option('password') ?: env('PRIMARY_ADMIN_PASSWORD', ''));

        if ($email === '' || $password === '') {
            $this->error('Admin hesabı için email ve password zorunlu. --email/--password verin veya PRIMARY_ADMIN_* env tanımlayın.');
            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $password,
                'role' => 'admin',
                'provider' => 'email',
            ]
        );

        $this->info("Admin hesabı hazır: {$user->email}");

        return self::SUCCESS;
    }
}
