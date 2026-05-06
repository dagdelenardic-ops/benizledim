<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use NotificationChannels\WebPush\HasPushSubscriptions;

class User extends Authenticatable
{
    use HasFactory, HasPushSubscriptions, Notifiable;

    // Note: 'role' is fillable for internal User::create() calls (auth, import).
    // Never pass unvalidated user input to User::create/update with role.
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'provider',
        'provider_id',
        'role',
        'bio',
        'letterboxd_username',
        'last_letterboxd_sync_at',
        'letterboxd_sync_enabled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_letterboxd_sync_at' => 'datetime',
            'letterboxd_sync_enabled' => 'boolean',
        ];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'followed_id')->withTimestamps();
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_id', 'follower_id')->withTimestamps();
    }

    public function watchlistItems(): HasMany
    {
        return $this->hasMany(WatchlistItem::class);
    }

    public function activityItems(): HasMany
    {
        return $this->hasMany(ActivityItem::class, 'actor_id');
    }

    public function isFollowing(User $user): bool
    {
        return $this->following()->whereKey($user->getKey())->exists();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isEditor(): bool
    {
        return $this->role === 'editor';
    }

    public function isAuthor(): bool
    {
        return in_array($this->role, ['admin', 'editor', 'author'], true);
    }

    public function canAccessCms(): bool
    {
        return in_array($this->role, ['admin', 'editor', 'author'], true);
    }

    public function canManageAllPosts(): bool
    {
        return in_array($this->role, ['admin', 'editor'], true);
    }

    public function canPublishWithoutReview(): bool
    {
        return in_array($this->role, ['admin', 'editor'], true);
    }

    public function isWixPlaceholder(): bool
    {
        return str_ends_with(strtolower((string) $this->email), '@benizledim.local');
    }

    public function hasGoogleConnection(): bool
    {
        return $this->provider === 'google' && filled($this->provider_id);
    }
}
