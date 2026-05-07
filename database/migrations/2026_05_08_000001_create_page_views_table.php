<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('visitor_id');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 64)->nullable();
            $table->string('url', 500);
            $table->string('path', 255);
            $table->string('route_name')->nullable();
            $table->string('referer', 500)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('device_type', 16)->nullable();
            $table->string('country', 2)->nullable();
            $table->foreignId('post_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->timestamp('viewed_at')->index();

            $table->index('visitor_id');
            $table->index(['path', 'viewed_at']);
            $table->index(['user_id', 'viewed_at']);
            $table->index(['session_id', 'viewed_at']);
            $table->index(['post_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
