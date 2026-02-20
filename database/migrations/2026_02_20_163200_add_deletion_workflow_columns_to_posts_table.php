<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->timestamp('deletion_requested_at')->nullable()->after('published_at');
            $table->foreignId('deletion_requested_by')->nullable()->after('deletion_requested_at')->constrained('users')->nullOnDelete();
            $table->timestamp('deletion_approved_at')->nullable()->after('deletion_requested_by');
            $table->foreignId('deletion_approved_by')->nullable()->after('deletion_approved_at')->constrained('users')->nullOnDelete();

            $table->index('deletion_requested_at');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['deletion_requested_at']);
            $table->dropConstrainedForeignId('deletion_approved_by');
            $table->dropColumn('deletion_approved_at');
            $table->dropConstrainedForeignId('deletion_requested_by');
            $table->dropColumn('deletion_requested_at');
        });
    }
};
