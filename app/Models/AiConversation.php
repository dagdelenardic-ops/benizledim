<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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

    public function scopeForOwner(Builder $query, ?int $userId, ?string $visitorId): Builder
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        }

        if ($visitorId) {
            return $query->where('visitor_id', $visitorId);
        }

        return $query->whereRaw('1=0');
    }
}
