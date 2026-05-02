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
        Schema::table('posts', function (Blueprint $table) {
            // Post format system (Feature 3 & 4)
            $table->string('format', 20)->default('standard')->after('view_count');

            // Dialogue format: second author (Feature 3)
            $table->foreignId('secondary_user_id')->nullable()->after('format')
                ->constrained('users')->nullOnDelete();

            // Time capsule: parent-child relationship (Feature 2)
            $table->foreignId('parent_post_id')->nullable()->after('secondary_user_id')
                ->constrained('posts')->nullOnDelete();
            $table->boolean('is_revisit')->default(false)->after('parent_post_id');

            // AI recommendation metadata (Feature 6)
            $table->json('mood_tags')->nullable()->after('is_revisit');
            $table->string('duration_category', 10)->nullable()->after('mood_tags');
            $table->string('intensity_level', 10)->nullable()->after('duration_category');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['secondary_user_id']);
            $table->dropForeign(['parent_post_id']);
            $table->dropColumn([
                'format', 'secondary_user_id', 'parent_post_id', 'is_revisit',
                'mood_tags', 'duration_category', 'intensity_level',
            ]);
        });
    }
};
