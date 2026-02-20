<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'cover_image' => null,
            'reading_time_minutes' => fake()->numberBetween(1, 10),
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => null,
            'deletion_requested_at' => null,
            'deletion_requested_by' => null,
            'deletion_approved_at' => null,
            'deletion_approved_by' => null,
            'view_count' => 0,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function deletionPending(): static
    {
        return $this->state(fn (array $attributes) => [
            'deletion_requested_at' => now(),
            'deletion_requested_by' => User::factory(),
        ]);
    }
}
