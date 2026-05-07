<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flash_news', function (Blueprint $table) {
            $table->id();
            $table->string('title_tr');
            $table->string('title_original')->nullable();
            $table->string('slug')->unique();
            $table->text('summary_tr');
            $table->longText('content_tr')->nullable();
            $table->string('source_url')->unique();
            $table->string('source_name');
            $table->string('image_url')->nullable();
            $table->string('original_language', 8)->default('en');
            $table->timestamp('source_published_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->index(['is_published', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flash_news');
    }
};
