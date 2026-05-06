<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Observers\Concerns\FlushesAuthorStatsCache;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    use FlushesAuthorStatsCache;

    public function store(Request $request, User $user, ActivityService $activities): JsonResponse
    {
        $actor = $request->user();

        abort_if($actor->id === $user->id, 422, 'Kendinizi takip edemezsiniz.');

        $created = ! $actor->isFollowing($user);
        $actor->following()->syncWithoutDetaching([$user->id]);

        if ($created) {
            $activities->record('followed_user', $actor, ['subject_user_id' => $user->id]);
            $this->flushAuthorStatsCache($user->id);
        }

        return response()->json([
            'following' => true,
            'followers_count' => $user->followers()->count(),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $request->user()->following()->detach($user->id);
        $this->flushAuthorStatsCache($user->id);

        return response()->json([
            'following' => false,
            'followers_count' => $user->followers()->count(),
        ]);
    }
}
