<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FestivalEvent extends Model
{
    protected $fillable = [
        'title',
        'description',
        'cover_image',
        'event_date',
        'slider_order',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }
}
