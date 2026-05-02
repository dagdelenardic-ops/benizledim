<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->timestamp('pending_review_at')->nullable()->after('published_at');
            $table->foreignId('pending_review_by')->nullable()->after('pending_review_at')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('pending_review_by');
            $table->foreignId('reviewed_by')->nullable()->after('reviewed_at')->constrained('users')->nullOnDelete();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE posts MODIFY status ENUM('draft', 'pending_review', 'published') NOT NULL DEFAULT 'draft'");
        }
    }

    public function down(): void
    {
        DB::table('posts')
            ->where('status', 'pending_review')
            ->update(['status' => 'draft']);

        Schema::table('posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn('reviewed_at');
            $table->dropConstrainedForeignId('pending_review_by');
            $table->dropColumn('pending_review_at');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE posts MODIFY status ENUM('draft', 'published') NOT NULL DEFAULT 'draft'");
        }
    }
};
