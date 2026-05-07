<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyStat extends Model
{
    protected $primaryKey = 'date';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'date',
        'unique_visitors',
        'total_pageviews',
        'authenticated_visitors',
        'avg_session_duration_seconds',
        'bounces',
        'sessions',
        'top_paths',
        'top_referers',
        'device_breakdown',
    ];

    protected $casts = [
        'date' => 'date',
        'top_paths' => 'array',
        'top_referers' => 'array',
        'device_breakdown' => 'array',
    ];
}
