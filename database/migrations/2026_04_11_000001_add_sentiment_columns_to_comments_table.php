<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->float('sentiment_score')->nullable()->after('content');
            $table->string('sentiment_label')->nullable()->after('sentiment_score');
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn(['sentiment_score', 'sentiment_label']);
        });
    }
};
