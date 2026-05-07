<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_stats', function (Blueprint $table) {
            $table->date('date')->primary();
            $table->unsignedInteger('unique_visitors')->default(0);
            $table->unsignedInteger('total_pageviews')->default(0);
            $table->unsignedInteger('authenticated_visitors')->default(0);
            $table->unsignedInteger('avg_session_duration_seconds')->default(0);
            $table->unsignedInteger('bounces')->default(0);
            $table->unsignedInteger('sessions')->default(0);
            $table->json('top_paths')->nullable();
            $table->json('top_referers')->nullable();
            $table->json('device_breakdown')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_stats');
    }
};
