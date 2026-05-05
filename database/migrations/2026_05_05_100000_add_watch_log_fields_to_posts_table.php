<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('tmdb_id')->nullable()->index()->after('intensity_level');
            $table->string('tmdb_type', 10)->nullable()->after('tmdb_id');
            $table->string('external_title')->nullable()->after('tmdb_type');
            $table->smallInteger('external_year')->nullable()->after('external_title');
            $table->date('watched_on')->nullable()->after('external_year');
            $table->unsignedTinyInteger('rating')->nullable()->after('watched_on');
            $table->string('letterboxd_uri')->nullable()->unique()->after('rating');
            $table->json('meta')->nullable()->after('letterboxd_uri');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'tmdb_id',
                'tmdb_type',
                'external_title',
                'external_year',
                'watched_on',
                'rating',
                'letterboxd_uri',
                'meta',
            ]);
        });
    }
};