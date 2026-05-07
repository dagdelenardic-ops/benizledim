<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use NotificationChannels\WebPush\HasPushSubscriptions;

class GuestPushSubscriber extends Model
{
    use HasPushSubscriptions, Notifiable;

    protected $fillable = ['fingerprint', 'last_seen_at'];

    protected $casts = [
        'last_seen_at' => 'datetime',
    ];
}
