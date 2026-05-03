<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ImageVariantControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_serves_a_cached_variant_for_local_storage_images(): void
    {
        Storage::fake('public');

        $resource = imagecreatetruecolor(2, 2);
        imagefilledrectangle($resource, 0, 0, 2, 2, imagecolorallocate($resource, 220, 38, 38));

        ob_start();
        imagepng($resource);
        $image = ob_get_clean();
        imagedestroy($resource);

        Storage::disk('public')->put('posts/test.png', $image);

        $response = $this->get('/img/variant?path=' . urlencode('/storage/posts/test.png') . '&w=480');

        $response->assertOk();
        $cacheControl = (string) $response->headers->get('cache-control');
        $this->assertStringContainsString('public', $cacheControl);
        $this->assertStringContainsString('max-age=31536000', $cacheControl);
        $this->assertStringContainsString('immutable', $cacheControl);
        $this->assertTrue(Storage::disk('public')->exists('variants/posts/test-2w.webp'));
    }

    #[Test]
    public function it_rejects_non_local_paths(): void
    {
        $this->get('/img/variant?path=' . urlencode('https://example.com/image.jpg') . '&w=480')
            ->assertNotFound();
    }
}