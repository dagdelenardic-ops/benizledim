<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Cinema extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name', 'slug', 'address', 'district',
        'latitude', 'longitude', 'description', 'photo',
        'website', 'phone', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'is_active' => 'boolean',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(CinemaScreening::class);
    }

    public function currentScreenings(): HasMany
    {
        return $this->hasMany(CinemaScreening::class)
            ->where('starts_at', '<=', now())
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CinemaReview::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function averageRating(): ?float
    {
        $avg = $this->reviews()->avg('rating');
        return $avg ? round($avg, 1) : null;
    }
}
