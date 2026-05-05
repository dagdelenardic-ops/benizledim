<?php

namespace App\Listeners;

use App\Models\AiConversation;
use Illuminate\Auth\Events\Login;

class ClaimGuestConversations
{
    public function handle(Login $event): void
    {
        $visitorId = request()->attributes->get('visitor_id')
            ?? request()->cookie('bi_visitor_id');

        if (!$visitorId) {
            return;
        }

        AiConversation::where('visitor_id', $visitorId)
            ->whereNull('user_id')
            ->update(['user_id' => $event->user->id]);
    }
}
