<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DialogueExchange extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'content',
        'sort_order',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
