<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiMessage extends \Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;

    protected $fillable = [
        'conversation_id', 'role', 'content',
        'recommended_post_ids', 'meta', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'recommended_post_ids' => 'array',
            'meta' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AiConversation::class, 'conversation_id');
    }
}
