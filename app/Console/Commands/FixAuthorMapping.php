<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FixAuthorMapping extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-authors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixes the author mappings for imported Wix posts to prevent plagiarism';

    protected $authorMap = [
        "gurur@benizledim.com" => "Gurur Sönmez",
        "iris@benizledim.com" => "İris Eryılmaz",
        "muhammed@benizledim.com" => "Muhammed Muğlu",
        "su@benizledim.com" => "Su Evci",
        "alphan@benizledim.com" => "Alphan Karabat",
        "humeyra@benizledim.com" => "Hümeyra Fidan",
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $jsonPath = database_path('data/wix-posts.json');

        if (!file_exists($jsonPath)) {
            $this->error("wix-posts.json not found! Path: " . $jsonPath);
            return Command::FAILURE;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (!isset($data['posts'])) {
            $this->error("No posts found in JSON!");
            return Command::FAILURE;
        }

        $this->info("Ensuring all original authors exist in the system...");

        $usersByEmail = [];

        foreach ($this->authorMap as $email => $name) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make(Str::random(16)),
                    'role' => 'author', // Ensure they are authors
                    'email_verified_at' => now(),
                ]
            );

            // Also enforce role if they already existed but had wrong role
            if ($user->role === 'reader' || empty($user->role)) {
                $user->role = 'author';
                $user->save();
            }

            $usersByEmail[$email] = $user;
            $this->info("Checked user: {$name} ({$email})");
        }

        $updatedCount = 0;
        $this->info("\nMapping posts to their true original authors to prevent plagiarism...");

        foreach ($data['posts'] as $wixPost) {
            if (isset($wixPost['author_email'])) {
                $email = $wixPost['author_email'];
                if (isset($usersByEmail[$email])) {
                    $user = $usersByEmail[$email];

                    // Find post by title or source_url
                    $postQuery = Post::where('title', $wixPost['title']);
                    if (isset($wixPost['source_url'])) {
                        $postQuery->orWhere('source_url', $wixPost['source_url']);
                    }

                    $post = $postQuery->first();

                    if ($post && $post->user_id !== $user->id) {
                        $post->user_id = $user->id;
                        $post->save();
                        $this->line("✅ Updated true author for: " . $post->title . " -> " . $user->name);
                        $updatedCount++;
                    }
                }
            }
        }

        $this->info("\nTotal successfully mapped posts: " . $updatedCount);
        return Command::SUCCESS;
    }
}
