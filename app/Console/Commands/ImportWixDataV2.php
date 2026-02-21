<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Facades\File;

class ImportWixDataV2 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-wix-data-v2 {file? : The path to the JSON file to import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports Wix posts from wix-posts-v2.json, mapping authors and sanitizing data.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file') ?? base_path('wix-posts-v2.json');

        if (!File::exists($filePath)) {
            $this->error("File not found at: {$filePath}");
            return;
        }

        $this->info("Loading data from {$filePath}...");
        $jsonContent = File::get($filePath);
        $posts = json_decode($jsonContent, true);

        if (!$posts) {
            $this->error("Failed to parse JSON or file is empty.");
            return;
        }

        $this->info("Found " . count($posts) . " posts. Starting import...");

        $missingImageCount = 0;
        $authorDistribution = [];

        DB::beginTransaction();

        try {
            $bar = $this->output->createProgressBar(count($posts));
            $bar->start();

            foreach ($posts as $postData) {
                // 1. Author Mapping
                $authorName = trim($postData['author_name'] ?? 'Bilinmeyen Yazar');
                $user = User::firstOrCreate(
                    ['name' => $authorName],
                    [
                        'email' => Str::slug($authorName) . '_' . uniqid() . '@benizledim.com',
                        'password' => Hash::make(Str::random(16)),
                        'role' => 'author',
                    ]
                );

                if (!isset($authorDistribution[$authorName])) {
                    $authorDistribution[$authorName] = 0;
                }
                $authorDistribution[$authorName]++;

                // 2. Cover Image
                $coverImage = $postData['cover_image'] ?? null;
                if (empty($coverImage)) {
                    $missingImageCount++;
                }

                // 3. Sanitization: clean basic empty tags, outside links can be handled here if needed.
                $content = $postData['content'] ?? '';
                // Simple cleanup: removing empty p tags
                $content = preg_replace('/<p[^>]*>[\s|&nbsp;]*<\/p>/', '', $content);

                // Determine published_at
                $publishedAt = null;
                if (!empty($postData['published_at'])) {
                    $publishedAt = date('Y-m-d H:i:s', strtotime($postData['published_at']));
                }

                // Create Post
                $post = Post::create([
                    'user_id' => $user->id,
                    'title' => $postData['title'] ?? 'Başlıksız',
                    'slug' => $postData['slug'] ?? Str::slug($postData['title'] ?? 'basliksiz-' . uniqid()),
                    'excerpt' => $postData['excerpt'] ?? null,
                    'content' => $content,
                    'cover_image' => $coverImage,
                    'reading_time_minutes' => $postData['reading_time_minutes'] ?? 1,
                    'status' => 'published',
                    'published_at' => $publishedAt,
                    'view_count' => $postData['view_count'] ?? 0,
                    'created_at' => $publishedAt ?? now(),
                    'updated_at' => $publishedAt ?? now(),
                ]);

                // 4. Categories Mapping
                if (!empty($postData['categories']) && is_array($postData['categories'])) {
                    $categoryIds = [];
                    foreach ($postData['categories'] as $catName) {
                        $catName = trim($catName);
                        if (empty($catName))
                            continue;

                        $category = Category::firstOrCreate(
                            ['slug' => Str::slug($catName)],
                            ['name' => $catName]
                        );
                        $categoryIds[] = $category->id;
                    }
                    $post->categories()->sync($categoryIds);
                }

                // 5. Tags Mapping
                if (!empty($postData['tags']) && is_array($postData['tags'])) {
                    $tagIds = [];
                    foreach ($postData['tags'] as $tagName) {
                        $tagName = trim($tagName);
                        if (empty($tagName))
                            continue;

                        $tag = Tag::firstOrCreate(
                            ['slug' => Str::slug($tagName)],
                            ['name' => $tagName]
                        );
                        $tagIds[] = $tag->id;
                    }
                    $post->tags()->sync($tagIds);
                }

                $bar->advance();
            }

            $bar->finish();
            DB::commit();
            $this->newLine(2);
            $this->info("Import completed successfully!");

            // 6. Validation Reporting
            $this->warn("--- Import Raporu ---");
            $this->line("Eksik Görseli Olan Post Sayısı: " . $missingImageCount);

            $this->line("Atanan Yazar Dağılımı:");
            foreach ($authorDistribution as $name => $count) {
                $this->line("- {$name} ({$count})");
            }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->newLine(2);
            $this->error("Import failed: " . $e->getMessage());
        }
    }
}
