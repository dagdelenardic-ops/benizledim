<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ai_conversations', function (Blueprint $table) {
            $table->string('visitor_id', 64)->nullable()->after('session_id');
            $table->string('title', 255)->nullable()->after('visitor_id');

            $table->string('session_id', 64)->nullable()->change();

            $table->index(['visitor_id', 'updated_at']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::table('ai_conversations', function (Blueprint $table) {
            $table->dropIndex(['visitor_id', 'updated_at']);
            $table->dropIndex(['user_id', 'updated_at']);
            $table->dropColumn(['visitor_id', 'title']);
        });
    }
};
