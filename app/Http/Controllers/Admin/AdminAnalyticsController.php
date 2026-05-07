<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAnalyticsController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics) {}

    public function index(Request $request): Response
    {
        $range = $this->resolveRange($request->query('range', '7d'));

        return Inertia::render('Admin/Analytics/Index', [
            'range' => $range,
            'summary' => $this->analytics->summary($range),
            'timeseries' => $this->analytics->timeseries($range),
            'topPages' => $this->analytics->topPages($range),
            'topReferers' => $this->analytics->topReferers($range),
            'devices' => $this->analytics->deviceBreakdown($range),
            'authors' => $this->analytics->authors(),
            'realtime' => $this->analytics->realtime(),
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        $range = $this->resolveRange($request->query('range', '7d'));
        return response()->json([
            'summary' => $this->analytics->summary($range),
            'timeseries' => $this->analytics->timeseries($range),
            'topPages' => $this->analytics->topPages($range),
            'topReferers' => $this->analytics->topReferers($range),
            'devices' => $this->analytics->deviceBreakdown($range),
        ]);
    }

    public function realtime(): JsonResponse
    {
        return response()->json($this->analytics->realtime());
    }

    public function authors(): JsonResponse
    {
        return response()->json(['authors' => $this->analytics->authors()]);
    }

    private function resolveRange(?string $range): string
    {
        $allowed = ['today', 'yesterday', '7d', '30d', '90d'];
        return in_array($range, $allowed, true) ? $range : '7d';
    }
}
