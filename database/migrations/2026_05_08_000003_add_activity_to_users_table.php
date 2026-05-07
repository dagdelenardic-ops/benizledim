<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable()->after('remember_token');
            $table->timestamp('last_seen_at')->nullable()->after('last_login_at');
            $table->unsignedInteger('login_count')->default(0)->after('last_seen_at');

            $table->index('last_seen_at');
            $table->index('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['last_seen_at']);
            $table->dropIndex(['last_login_at']);
            $table->dropColumn(['last_login_at', 'last_seen_at', 'login_count']);
        });
    }
};
