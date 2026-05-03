<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostImageController extends Controller
{
    private const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    private const ALLOWED_MIMES  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private const ALLOWED_EXTS   = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    public function store(Request $request): JsonResponse
    {
        if ($request->hasFile('image')) {
            return $this->storeFile($request);
        }

        if ($request->filled('base64')) {
            return $this->storeBase64($request);
        }

        if ($request->filled('url')) {
            return $this->storeRemoteUrl($request);
        }

        return response()->json(['error' => 'Görsel kaynağı belirtilmedi.'], 422);
    }

    private function storeFile(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'max:5120', 'mimes:jpeg,png,gif,webp'],
        ]);

        $path = $request->file('image')->store('posts/images', 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }

    private function storeBase64(Request $request): JsonResponse
    {
        $base64 = $request->string('base64')->toString();

        if (!preg_match('/^data:(image\/[a-z]+);base64,(.+)$/i', $base64, $matches)) {
            return response()->json(['error' => 'Geçersiz base64 formatı.'], 422);
        }

        $mimeType = strtolower($matches[1]);
        if (!in_array($mimeType, self::ALLOWED_MIMES, true)) {
            return response()->json(['error' => 'Desteklenmeyen görsel türü.'], 422);
        }

        $data = base64_decode($matches[2], true);
        if ($data === false || strlen($data) > self::MAX_SIZE_BYTES) {
            return response()->json(['error' => 'Görsel çok büyük veya geçersiz (max 5 MB).'], 422);
        }

        $ext      = explode('/', $mimeType)[1];
        $filename = 'posts/images/' . Str::uuid() . '.' . $ext;
        Storage::disk('public')->put($filename, $data);

        return response()->json(['url' => Storage::disk('public')->url($filename)]);
    }

    private function storeRemoteUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => ['required', 'url', 'max:2048'],
        ]);

        $remoteUrl = $request->string('url')->toString();

        if (!preg_match('/^https?:\/\//i', $remoteUrl)) {
            return response()->json(['error' => 'Sadece HTTP/HTTPS URL desteklenir.'], 422);
        }

        $host = parse_url($remoteUrl, PHP_URL_HOST);
        if ($host && filter_var($host, FILTER_VALIDATE_IP)) {
            if (!filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return response()->json(['error' => 'Bu IP adresine erişim yasak.'], 403);
            }
        }

        $context = stream_context_create([
            'http' => [
                'timeout'       => 10,
                'max_redirects' => 3,
                'user_agent'    => 'Benizledim/1.0',
            ],
        ]);

        $data = @file_get_contents($remoteUrl, false, $context);
        if ($data === false || strlen($data) > self::MAX_SIZE_BYTES) {
            return response()->json(['error' => 'Görsel indirilemedi veya çok büyük (max 5 MB).'], 422);
        }

        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($data);
        if (!in_array($mimeType, self::ALLOWED_MIMES, true)) {
            return response()->json(['error' => 'Desteklenmeyen görsel türü.'], 422);
        }

        $ext      = explode('/', $mimeType)[1];
        $filename = 'posts/images/' . Str::uuid() . '.' . $ext;
        Storage::disk('public')->put($filename, $data);

        return response()->json(['url' => Storage::disk('public')->url($filename)]);
    }
}
