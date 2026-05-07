<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashNews extends Model
{
    use HasFactory;

    protected $table = 'flash_news';

    protected $fillable = [
        'title_tr',
        'title_original',
        'slug',
        'summary_tr',
        'content_tr',
        'source_url',
        'source_name',
        'image_url',
        'original_language',
        'source_published_at',
        'published_at',
        'is_published',
    ];

    protected $casts = [
        'source_published_at' => 'datetime',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
