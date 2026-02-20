<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Post;
use App\Models\Category;
use Illuminate\Support\Str;

$data = json_decode(file_get_contents('database/data/wix-posts.json'), true);

if (!isset($data['posts'])) {
    die("No posts found in JSON.\n");
}

$updatedCount = 0;

foreach ($data['posts'] as $wixPost) {
    if (!isset($wixPost['title']))
        continue;

    $post = Post::where('title', $wixPost['title'])->first();
    if ($post) {
        $categoryIds = [];

        if (!empty($wixPost['categories'])) {
            foreach ($wixPost['categories'] as $catName) {
                // Ensure the category name is trimmed
                $catName = trim($catName);
                if (empty($catName))
                    continue;

                $category = Category::firstOrCreate(
                    ['slug' => Str::slug($catName)],
                    ['name' => $catName]
                );
                $categoryIds[] = $category->id;
            }
        }

        // Always sync the fresh correct categories
        // If empty, it clears the old messy categories.
        $post->categories()->sync($categoryIds);
        $updatedCount++;
    }
}

echo "Successfully updated categories for {$updatedCount} posts.\n";

// Optional cleanup for categories that now have 0 posts 
// This deletes old scraped noise categories if any
$deletedCount = 0;
foreach (Category::all() as $cat) {
    if ($cat->posts()->count() == 0) {
        // Only delete if it's considered empty/orphaned.
        // Or we can just leave them alone. Let's just mention it.
        echo "Orphaned category: " . $cat->name . "\n";
    }
}
