<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedTinyInteger('cover_image_focus_x')->default(50)->after('cover_image');
            $table->unsignedTinyInteger('cover_image_focus_y')->default(50)->after('cover_image_focus_x');
            $table->unsignedTinyInteger('cover_image_mobile_focus_x')->default(50)->after('cover_image_focus_y');
            $table->unsignedTinyInteger('cover_image_mobile_focus_y')->default(50)->after('cover_image_mobile_focus_x');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'cover_image_focus_x',
                'cover_image_focus_y',
                'cover_image_mobile_focus_x',
                'cover_image_mobile_focus_y',
            ]);
        });
    }
};