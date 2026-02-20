<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class FixContentIntegrity extends Command
{
    protected $signature = 'content:fix';

    protected $description = 'Veri bütünlüğü sorunlarını otomatik düzeltir';

    public function handle(): int
    {
        $this->newLine();
        $this->info('🔧 Veri Bütünlüğü Düzeltme İşlemi Başlatıldı...');
        $this->newLine();

        $fixedCount = 0;

        // 1. Boş slug'lara güvenli slug üretimi
        $this->section('Slug Düzeltmeleri');
        
        $fixedCount += $this->fixEmptySlugs();

        $this->newLine();

        // 2. Geçersiz role sahip kullanıcıları reader yap
        $this->section('Kullanıcı Rolü Düzeltmeleri');
        
        $fixedCount += $this->fixInvalidRoles();

        $this->newLine();

        // 3. published + published_at boş ise published_at=created_at
        $this->section('Yayın Tarihi Düzeltmeleri');
        
        $fixedCount += $this->fixPublishedAt();

        $this->newLine();

        // 4. Yetim relation kayıtlarını raporlama
        $this->section('Yetim İlişki Raporu');
        
        $this->reportOrphanedRelations();

        $this->newLine();

        $this->info("✅ Düzeltme tamamlandı. Toplam {$fixedCount} kayıt düzeltildi.");
        $this->info('Denetim için: php artisan content:audit');
        $this->newLine();

        return self::SUCCESS;
    }

    private function fixEmptySlugs(): int
    {
        $fixed = 0;

        // Post slug düzeltmeleri
        $postsWithoutSlug = Post::whereNull('slug')
            ->orWhere('slug', '')
            ->get();
        
        foreach ($postsWithoutSlug as $post) {
            $baseSlug = Str::slug($post->title ?? 'basliksiz-yazi');
            $slug = $baseSlug;
            $counter = 1;

            while (Post::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $post->update(['slug' => $slug]);
            $this->line("  ✓ Post #{$post->id} slug düzeltildi: {$slug}");
            $fixed++;
        }

        // Page slug düzeltmeleri
        $pagesWithoutSlug = Page::whereNull('slug')
            ->orWhere('slug', '')
            ->get();
        
        foreach ($pagesWithoutSlug as $page) {
            $baseSlug = Str::slug($page->title ?? 'basliksiz-sayfa');
            $slug = $baseSlug;
            $counter = 1;

            while (Page::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $page->update(['slug' => $slug]);
            $this->line("  ✓ Page #{$page->id} slug düzeltildi: {$slug}");
            $fixed++;
        }

        // Category slug düzeltmeleri
        $categoriesWithoutSlug = Category::whereNull('slug')
            ->orWhere('slug', '')
            ->get();
        
        foreach ($categoriesWithoutSlug as $category) {
            $baseSlug = Str::slug($category->name ?? 'kategorisiz');
            $slug = $baseSlug;
            $counter = 1;

            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $category->update(['slug' => $slug]);
            $this->line("  ✓ Category #{$category->id} slug düzeltildi: {$slug}");
            $fixed++;
        }

        // Tag slug düzeltmeleri
        $tagsWithoutSlug = Tag::whereNull('slug')
            ->orWhere('slug', '')
            ->get();
        
        foreach ($tagsWithoutSlug as $tag) {
            $baseSlug = Str::slug($tag->name ?? 'etiksiz');
            $slug = $baseSlug;
            $counter = 1;

            while (Tag::where('slug', $slug)->where('id', '!=', $tag->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $tag->update(['slug' => $slug]);
            $this->line("  ✓ Tag #{$tag->id} slug düzeltildi: {$slug}");
            $fixed++;
        }

        if ($fixed === 0) {
            $this->info('  ✓ Boş slug bulunamadı.');
        }

        return $fixed;
    }

    private function fixInvalidRoles(): int
    {
        $validRoles = ['admin', 'editor', 'author', 'reader'];
        
        $invalidRoleUsers = User::whereNotIn('role', $validRoles)
            ->orWhereNull('role')
            ->get();
        
        $fixed = 0;
        
        foreach ($invalidRoleUsers as $user) {
            $oldRole = $user->role ?? 'null';
            $user->update(['role' => 'reader']);
            $this->line("  ✓ Kullanıcı #{$user->id} ({$user->email}) rolü '{$oldRole}' -> 'reader' olarak değiştirildi.");
            $fixed++;
        }

        if ($fixed === 0) {
            $this->info('  ✓ Geçersiz role sahip kullanıcı bulunamadı.');
        }

        return $fixed;
    }

    private function fixPublishedAt(): int
    {
        $posts = Post::where('status', 'published')
            ->whereNull('published_at')
            ->get();
        
        $fixed = 0;
        
        foreach ($posts as $post) {
            $post->update(['published_at' => $post->created_at ?? now()]);
            $this->line("  ✓ Post #{$post->id} published_at değeri created_at ile dolduruldu.");
            $fixed++;
        }

        if ($fixed === 0) {
            $this->info('  ✓ published_at boş olan yayındaki yazı bulunamadı.');
        }

        return $fixed;
    }

    private function reportOrphanedRelations(): void
    {
        $orphans = [];

        // Yorumları olmayan post'lar (yetim değil, sadece rapor)
        $postsWithoutComments = Post::doesntHave('comments')->count();
        $this->line("  ℹ️  Yorumu olmayan yazı: {$postsWithoutComments}");

        // Beğenisi olmayan post'lar
        $postsWithoutLikes = Post::doesntHave('likes')->count();
        $this->line("  ℹ️  Beğenisi olmayan yazı: {$postsWithoutLikes}");

        // Kategorisi olmayan post'lar
        $postsWithoutCategories = Post::doesntHave('categories')->count();
        if ($postsWithoutCategories > 0) {
            $this->warn("  ⚠️  Kategorisi olmayan yazı: {$postsWithoutCategories}");
            $orphans['posts_without_categories'] = $postsWithoutCategories;
        }

        // Etiketleri olmayan post'lar
        $postsWithoutTags = Post::doesntHave('tags')->count();
        $this->line("  ℹ️  Etiketi olmayan yazı: {$postsWithoutTags}");

        // Yazısı olmayan kategoriler
        $categoriesWithoutPosts = Category::doesntHave('posts')->count();
        if ($categoriesWithoutPosts > 0) {
            $this->warn("  ⚠️  Yazısı olmayan kategori: {$categoriesWithoutPosts}");
            $orphans['categories_without_posts'] = $categoriesWithoutPosts;
        }

        // Yazısı olmayan etiketler
        $tagsWithoutPosts = Tag::doesntHave('posts')->count();
        if ($tagsWithoutPosts > 0) {
            $this->warn("  ⚠️  Yazısı olmayan etiket: {$tagsWithoutPosts}");
            $orphans['tags_without_posts'] = $tagsWithoutPosts;
        }

        // Kullanıcısı olmayan post'lar (kritik)
        $postsWithoutUser = Post::whereNull('user_id')->count();
        if ($postsWithoutUser > 0) {
            $this->error("  ❌ Kullanıcısı olmayan yazı: {$postsWithoutUser} (manuel düzeltme gerekir)");
            $orphans['posts_without_user'] = $postsWithoutUser;
        }

        if (empty($orphans)) {
            $this->info('  ✓ Kritik yetim ilişki bulunamadı.');
        } else {
            $this->newLine();
            $this->warn('  Not: Yetim kayıtlar silinmedi, sadece raporlandı.');
        }
    }

    private function section(string $title): void
    {
        $this->info("┌─ {$title}");
        $this->info('│');
    }
}
