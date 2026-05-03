<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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
