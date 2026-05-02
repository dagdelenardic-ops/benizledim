<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entry extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'display_name',
        'content',
        'is_spoiler',
        'score',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'is_spoiler' => 'boolean',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(EntryVote::class);
    }

    public function scopeSpoiler($query)
    {
        return $query->where('is_spoiler', true);
    }

    public function scopeNonSpoiler($query)
    {
        return $query->where('is_spoiler', false);
    }

    public function scopeTopRated($query)
    {
        return $query->orderByDesc('score')->orderByDesc('created_at');
    }

    public function authorName(): string
    {
        return $this->user?->name ?? $this->display_name ?? 'Anonim';
    }

    public function recalculateScore(): void
    {
        $this->update([
            'score' => $this->votes()->sum('vote'),
        ]);
    }
}
