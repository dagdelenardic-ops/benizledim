<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisualEssayBlock extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = [
        'post_id',
        'type',
        'content',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
