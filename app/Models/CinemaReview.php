<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CinemaReview extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = [
        'cinema_id', 'user_id', 'rating', 'content',
    ];

    public function cinema(): BelongsTo
    {
        return $this->belongsTo(Cinema::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
