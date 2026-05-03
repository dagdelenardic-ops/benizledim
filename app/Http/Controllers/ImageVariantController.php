<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImageVariantController extends Controller
{
    private const ALLOWED_WIDTHS = [480, 768, 960, 1280, 1600];

    public function show(Request $request): BinaryFileResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'w' => ['required', 'integer', 'in:' . implode(',', self::ALLOWED_WIDTHS)],
        ]);

        $relativePath = $this->normalizePath($validated['path']);
        abort_unless($relativePath, 404);

        $disk = Storage::disk('public');
        abort_unless($disk->exists($relativePath), 404);

        $sourcePath = $disk->path($relativePath);
        $imageInfo = @getimagesize($sourcePath);
        abort_unless($imageInfo !== false, 404);

        [$sourceWidth, $sourceHeight, $imageType] = $imageInfo;

        abort_unless($sourceWidth > 0 && $sourceHeight > 0, 404);

        $targetWidth = min((int) $validated['w'], $sourceWidth);
        $targetHeight = (int) round(($sourceHeight / $sourceWidth) * $targetWidth);

        $variantRelativePath = sprintf(
            'variants/%s/%sw.webp',
            trim(dirname($relativePath), '.'),
            pathinfo($relativePath, PATHINFO_FILENAME) . '-' . $targetWidth
        );

        if (!$disk->exists($variantRelativePath) || $disk->lastModified($variantRelativePath) < $disk->lastModified($relativePath)) {
            $this->createVariant($sourcePath, $disk->path($variantRelativePath), $targetWidth, $targetHeight, $imageType);
        }

        return response()->file($disk->path($variantRelativePath), [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    private function normalizePath(string $path): ?string
    {
        $trimmedPath = Str::before($path, '?');

        if (!Str::startsWith($trimmedPath, '/storage/')) {
            return null;
        }

        $relativePath = ltrim(Str::after($trimmedPath, '/storage/'), '/');

        if ($relativePath === '' || str_contains($relativePath, '..')) {
            return null;
        }

        return $relativePath;
    }

    private function createVariant(string $sourcePath, string $variantPath, int $targetWidth, int $targetHeight, int $imageType): void
    {
        $variantDirectory = dirname($variantPath);

        if (!is_dir($variantDirectory)) {
            mkdir($variantDirectory, 0755, true);
        }

        $sourceImage = match ($imageType) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($sourcePath),
            IMAGETYPE_PNG => imagecreatefrompng($sourcePath),
            IMAGETYPE_WEBP => imagecreatefromwebp($sourcePath),
            IMAGETYPE_GIF => imagecreatefromgif($sourcePath),
            default => null,
        };

        abort_unless($sourceImage !== null, 404);

        $variantImage = imagecreatetruecolor($targetWidth, $targetHeight);

        imagealphablending($variantImage, false);
        imagesavealpha($variantImage, true);
        $transparent = imagecolorallocatealpha($variantImage, 0, 0, 0, 127);
        imagefilledrectangle($variantImage, 0, 0, $targetWidth, $targetHeight, $transparent);

        imagecopyresampled(
            $variantImage,
            $sourceImage,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            imagesx($sourceImage),
            imagesy($sourceImage)
        );

        imagewebp($variantImage, $variantPath, 82);

        imagedestroy($sourceImage);
        imagedestroy($variantImage);
    }
}