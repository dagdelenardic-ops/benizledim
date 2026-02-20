<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class AuditContentIntegrity extends Command
{
    protected $signature = 'content:audit';

    protected $description = 'Veri bütünlüğü denetimi yapar ve raporlar';

    public function handle(): int
    {
        $this->newLine();
        $this->info('🔍 Veri Bütünlüğü Denetimi Başlatıldı...');
        $this->newLine();

        $issuesFound = false;

        // 1. Yazısı olmayan kategori/tag listesi
        $this->section('Kategoriler ve Etiketler');
        
        $emptyCategories = Category::doesntHave('posts')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
        
        if ($emptyCategories->isNotEmpty()) {
            $issuesFound = true;
            $this->warn("⚠️  Yazısı olmayan {$emptyCategories->count()} kategori bulundu:");
            $this->table(['ID', 'Ad', 'Slug'], $emptyCategories->toArray());
        } else {
            $this->info('✓ Tüm kategorilerin yazıları mevcut.');
        }

        $emptyTags = Tag::doesntHave('posts')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
        
        if ($emptyTags->isNotEmpty()) {
            $issuesFound = true;
            $this->warn("⚠️  Yazısı olmayan {$emptyTags->count()} etiket bulundu:");
            $this->table(['ID', 'Ad', 'Slug'], $emptyTags->toArray());
        } else {
            $this->info('✓ Tüm etiketlerin yazıları mevcut.');
        }

        $this->newLine();

        // 2. Kullanıcısı eksik post var mı?
        $this->section('Kullanıcı İlişkileri');
        
        $postsWithoutUser = Post::whereDoesntHave('user')
            ->orWhereNull('user_id')
            ->get(['id', 'title', 'slug', 'user_id']);
        
        if ($postsWithoutUser->isNotEmpty()) {
            $issuesFound = true;
            $this->error("❌ Kullanıcısı eksik {$postsWithoutUser->count()} yazı bulundu:");
            $this->table(['ID', 'Başlık', 'Slug', 'User ID'], $postsWithoutUser->toArray());
        } else {
            $this->info('✓ Tüm yazıların kullanıcısı mevcut.');
        }

        $this->newLine();

        // 3. published olup published_at boş post var mı?
        $this->section('Yayın Durumu');
        
        $publishedWithoutPublishedAt = Post::where('status', 'published')
            ->whereNull('published_at')
            ->get(['id', 'title', 'slug', 'status', 'created_at']);
        
        if ($publishedWithoutPublishedAt->isNotEmpty()) {
            $issuesFound = true;
            $this->error("❌ Yayında olan ama published_at boş {$publishedWithoutPublishedAt->count()} yazı bulundu:");
            $this->table(['ID', 'Başlık', 'Slug', 'Durum', 'Oluşturulma'], $publishedWithoutPublishedAt->toArray());
        } else {
            $this->info('✓ Yayındaki tüm yazıların published_at değeri mevcut.');
        }

        $this->newLine();

        // 4. deletion_requested_at dolu ama status published olanlar
        $deletionPendingPublished = Post::whereNotNull('deletion_requested_at')
            ->where('status', 'published')
            ->get(['id', 'title', 'slug', 'status', 'deletion_requested_at', 'deletion_requested_by']);
        
        if ($deletionPendingPublished->isNotEmpty()) {
            $issuesFound = true;
            $this->warn("⚠️  Silme talebi olan ama yayında görünen {$deletionPendingPublished->count()} yazı (yayından düşmüş kabul):");
            $this->table(
                ['ID', 'Başlık', 'Slug', 'Durum', 'Silme Talebi', 'Talep Eden ID'],
                $deletionPendingPublished->toArray()
            );
        } else {
            $this->info('✓ Silme talebi olan yayındaki yazı yok.');
        }

        $this->newLine();

        // 5. Yetkisiz rol değerleri
        $this->section('Kullanıcı Rolleri');
        
        $validRoles = ['admin', 'editor', 'author', 'reader'];
        $invalidRoleUsers = User::whereNotIn('role', $validRoles)
            ->orWhereNull('role')
            ->get(['id', 'name', 'email', 'role']);
        
        if ($invalidRoleUsers->isNotEmpty()) {
            $issuesFound = true;
            $this->error("❌ Geçersiz role sahip {$invalidRoleUsers->count()} kullanıcı bulundu:");
            $this->table(['ID', 'Ad', 'E-posta', 'Rol'], $invalidRoleUsers->toArray());
        } else {
            $this->info('✓ Tüm kullanıcıların rolleri geçerli.');
        }

        $this->newLine();

        // 6. Slug çakışmaları
        $this->section('Slug Çakışmaları');
        
        $slugCollisions = $this->findSlugCollisions();
        
        if ($slugCollisions->isNotEmpty()) {
            $issuesFound = true;
            $this->error("❌ Slug çakışmaları bulundu:");
            foreach ($slugCollisions as $type => $collisions) {
                if ($collisions->isNotEmpty()) {
                    $this->warn("  {$type}:");
                    $this->table(['Slug', 'Adet'], $collisions->toArray());
                }
            }
        } else {
            $this->info('✓ Slug çakışması yok.');
        }

        $this->newLine();
        $this->section('Sayfalar (Pages)');
        
        $pagesWithoutSlug = Page::whereNull('slug')
            ->orWhere('slug', '')
            ->get(['id', 'title', 'slug']);
        
        if ($pagesWithoutSlug->isNotEmpty()) {
            $issuesFound = true;
            $this->warn("⚠️  Slug'ı eksik/geçersiz {$pagesWithoutSlug->count()} sayfa bulundu:");
            $this->table(['ID', 'Başlık', 'Slug'], $pagesWithoutSlug->toArray());
        } else {
            $this->info('✓ Tüm sayfaların slug\'ı mevcut.');
        }

        $this->newLine();

        if ($issuesFound) {
            $this->warn('⚠️  Denetim tamamlandı. Yukarıdaki sorunlar giderilmelidir.');
            $this->info('Düzeltme için: php artisan content:fix');
        } else {
            $this->info('✅ Denetim tamamlandı. Veri bütünlüğü sorunu yok!');
        }

        $this->newLine();

        return self::SUCCESS;
    }

    private function findSlugCollisions(): \Illuminate\Support\Collection
    {
        $collisions = collect();

        // Post slug çakışmaları
        $postCollisions = Post::select('slug', \DB::raw('COUNT(*) as count'))
            ->groupBy('slug')
            ->having('count', '>', 1)
            ->get();
        
        if ($postCollisions->isNotEmpty()) {
            $collisions['Posts'] = $postCollisions;
        }

        // Page slug çakışmaları
        $pageCollisions = Page::select('slug', \DB::raw('COUNT(*) as count'))
            ->groupBy('slug')
            ->having('count', '>', 1)
            ->get();
        
        if ($pageCollisions->isNotEmpty()) {
            $collisions['Pages'] = $pageCollisions;
        }

        // Category slug çakışmaları
        $categoryCollisions = Category::select('slug', \DB::raw('COUNT(*) as count'))
            ->groupBy('slug')
            ->having('count', '>', 1)
            ->get();
        
        if ($categoryCollisions->isNotEmpty()) {
            $collisions['Categories'] = $categoryCollisions;
        }

        // Tag slug çakışmaları
        $tagCollisions = Tag::select('slug', \DB::raw('COUNT(*) as count'))
            ->groupBy('slug')
            ->having('count', '>', 1)
            ->get();
        
        if ($tagCollisions->isNotEmpty()) {
            $collisions['Tags'] = $tagCollisions;
        }

        return $collisions;
    }

    private function section(string $title): void
    {
        $this->info("┌─ {$title}");
        $this->info('│');
    }
}
