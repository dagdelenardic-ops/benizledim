<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('letterboxd_username')->nullable()->after('bio');
            $table->timestamp('last_letterboxd_sync_at')->nullable()->after('letterboxd_username');
            $table->boolean('letterboxd_sync_enabled')->default(false)->after('last_letterboxd_sync_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'letterboxd_username',
                'last_letterboxd_sync_at',
                'letterboxd_sync_enabled',
            ]);
        });
    }
};