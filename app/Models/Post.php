<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Post extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'cover_image_focus_x',
        'cover_image_focus_y',
        'cover_image_mobile_focus_x',
        'cover_image_mobile_focus_y',
        'reading_time_minutes',
        'status',
        'published_at',
        'scheduled_at',
        'pending_review_at',
        'pending_review_by',
        'deletion_requested_at',
        'deletion_requested_by',
        'deletion_approved_at',
        'deletion_approved_by',
        'reviewed_at',
        'reviewed_by',
        'view_count',
        'format',
        'secondary_user_id',
        'parent_post_id',
        'is_revisit',
        'mood_tags',
        'duration_category',
        'intensity_level',
        'tmdb_id',
        'tmdb_type',
        'external_title',
        'external_year',
        'watched_on',
        'rating',
        'letterboxd_uri',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
            'cover_image_focus_x' => 'integer',
            'cover_image_focus_y' => 'integer',
            'cover_image_mobile_focus_x' => 'integer',
            'cover_image_mobile_focus_y' => 'integer',
            'pending_review_at' => 'datetime',
            'deletion_requested_at' => 'datetime',
            'deletion_approved_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'is_revisit' => 'boolean',
            'mood_tags' => 'array',
            'watched_on' => 'date',
            'meta' => 'array',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function deletionRequestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deletion_requested_by');
    }

    public function deletionApprovedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deletion_approved_by');
    }

    public function pendingReviewBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pending_review_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class);
    }

    // Time Capsule (Feature 2)
    public function originalPost(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'parent_post_id');
    }

    public function revisits(): HasMany
    {
        return $this->hasMany(Post::class, 'parent_post_id');
    }

    // Dialogue Format (Feature 3)
    public function secondaryAuthor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'secondary_user_id');
    }

    public function dialogueExchanges(): HasMany
    {
        return $this->hasMany(DialogueExchange::class)->orderBy('sort_order');
    }

    // Visual Essay (Feature 4)
    public function visualEssayBlocks(): HasMany
    {
        return $this->hasMany(VisualEssayBlock::class)->orderBy('sort_order');
    }

    public function scopePublished($query)
    {
        return $query
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->whereNull('deletion_requested_at');
    }

    /**
     * Public yazı feed'leri (Home, kategori, arama, RSS, sitemap) için:
     * yayınlanmış + watch_log olmayan. Yazar profili Watch-Log sekmesi bu scope'u KULLANMAZ.
     */
    public function scopeArticles($query)
    {
        return $query->published()->where('format', '!=', 'watch_log');
    }

    public function isDeletionPending(): bool
    {
        return $this->deletion_requested_at !== null;
    }

    public function isPendingReview(): bool
    {
        return $this->status === 'pending_review';
    }

    public function resolveStatus(): string
    {
        return $this->isDeletionPending() ? 'pending_deletion' : $this->status;
    }

    public function canBeEditedBy(User $user): bool
    {
        return $user->canManageAllPosts() || $this->user_id === $user->id;
    }
}
