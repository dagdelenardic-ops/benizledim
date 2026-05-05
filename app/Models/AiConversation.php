<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiConversation extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['user_id', 'session_id', 'visitor_id', 'title'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(AiMessage::class, 'conversation_id')->orderBy('created_at');
    }

    public function scopeForOwner($query, ?int $userId, ?string $visitorId)
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        }

        return $query->where('visitor_id', $visitorId);
    }
}
