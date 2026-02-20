<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$data = json_decode(file_get_contents('database/data/wix-posts.json'), true);

if (!isset($data['posts'])) {
    die("No posts found in JSON.\n");
}

$updatedCount = 0;

foreach ($data['posts'] as $wixPost) {
    if (isset($wixPost['author_email']) && $wixPost['author_email'] !== "gurur@benizledim.com") {
        $user = \App\Models\User::where('email', $wixPost['author_email'])->first();

        if ($user) {
            $post = \App\Models\Post::where('title', $wixPost['title'])->first();
            if ($post) {
                if ($post->user_id !== $user->id) {
                    $post->user_id = $user->id;
                    $post->save();
                    echo "Updated author for: " . $post->title . " -> " . $user->name . "\n";
                    $updatedCount++;
                }
            } else {
                echo "Post not found in DB: " . $wixPost['title'] . "\n";
            }
        }
    }
}

echo "Total updated posts: " . $updatedCount . "\n";
