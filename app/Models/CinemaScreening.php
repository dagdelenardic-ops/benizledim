<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CinemaScreening extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = [
        'cinema_id', 'title', 'original_title',
        'starts_at', 'ends_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function cinema(): BelongsTo
    {
        return $this->belongsTo(Cinema::class);
    }
}
