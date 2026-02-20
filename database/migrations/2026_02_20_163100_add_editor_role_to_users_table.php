<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('admin', 'editor', 'author', 'reader') NOT NULL DEFAULT 'reader'");
        }

        // SQLite stores enum as string; no schema change is required.
    }

    public function down(): void
    {
        DB::table('users')
            ->where('role', 'editor')
            ->update(['role' => 'author']);

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('admin', 'author', 'reader') NOT NULL DEFAULT 'reader'");
        }
    }
};
