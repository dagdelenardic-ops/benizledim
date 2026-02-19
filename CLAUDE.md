# Ben İzledim - Proje Kuralları ve Mimari

## Proje Özeti
Film, dizi ve belgesel eleştiri/tavsiye platformu. Wix'ten Laravel + Vue.js'e taşınıyor.
Site: benizledim.com | Dil: Türkçe (birincil), İngilizce (gelecekte)

## Teknoloji Stack
- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Vue 3 + Vite + Tailwind CSS 4
- **Veritabanı**: MySQL 8
- **Auth**: Laravel Socialite (Google, Facebook) + E-posta/şifre
- **Hosting**: Shared hosting (LiteSpeed, cPanel, Linux)
- **API Yapısı**: Laravel API routes + Inertia.js (SPA hissi, SSR desteği)

## Proje Yapısı
```
benizledim/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/           # Google/Facebook/Email auth
│   │   ├── PostController.php
│   │   ├── CategoryController.php
│   │   ├── CommentController.php
│   │   ├── PodcastController.php
│   │   ├── ProfileController.php
│   │   ├── SearchController.php
│   │   └── NewsletterController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Post.php
│   │   ├── Category.php
│   │   ├── Tag.php
│   │   ├── Comment.php
│   │   ├── Like.php
│   │   ├── Podcast.php
│   │   └── Newsletter.php
│   └── Services/
│       ├── PostService.php
│       └── ImageService.php
├── resources/
│   ├── js/
│   │   ├── app.js
│   │   ├── Pages/
│   │   │   ├── Home.vue
│   │   │   ├── Post/
│   │   │   │   ├── Index.vue      # Yazı listesi (kategori filtreli)
│   │   │   │   └── Show.vue       # Yazı detay
│   │   │   ├── Podcast/
│   │   │   │   └── Index.vue
│   │   │   ├── Festival/
│   │   │   │   └── Index.vue      # İstanbul Film Festivali
│   │   │   ├── Auth/
│   │   │   │   ├── Login.vue
│   │   │   │   └── Register.vue
│   │   │   ├── Profile/
│   │   │   │   └── Show.vue       # Kullanıcı profili + yazıları
│   │   │   └── Search/
│   │   │       └── Index.vue
│   │   ├── Components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.vue
│   │   │   │   ├── Footer.vue
│   │   │   │   └── AppLayout.vue
│   │   │   ├── Post/
│   │   │   │   ├── PostCard.vue
│   │   │   │   ├── PostGrid.vue
│   │   │   │   ├── RelatedPosts.vue
│   │   │   │   └── ShareButtons.vue
│   │   │   ├── Comment/
│   │   │   │   ├── CommentList.vue
│   │   │   │   └── CommentForm.vue
│   │   │   ├── Auth/
│   │   │   │   └── LoginModal.vue
│   │   │   └── UI/
│   │   │       ├── SearchBar.vue
│   │   │       ├── LikeButton.vue
│   │   │       └── Newsletter.vue
│   │   └── Composables/
│   │       ├── useAuth.js
│   │       └── usePosts.js
│   ├── css/
│   │   └── app.css            # Tailwind imports
│   └── views/
│       └── app.blade.php      # SPA entry point
├── routes/
│   ├── web.php
│   └── auth.php
├── database/
│   └── migrations/
└── public/
    └── storage/ -> ../storage/app/public
```

## Veritabanı Şeması

### users
- id, name, email, password (nullable - sosyal giriş), avatar
- provider (google/facebook/email), provider_id
- role (admin/author/reader)
- bio, timestamps

### posts
- id, user_id (FK), title, slug, excerpt, content (rich text)
- cover_image, reading_time_minutes
- status (draft/published), published_at
- view_count, timestamps

### categories
- id, name, slug (sinema, dizi, belgesel, kisa-film, film, netflix, suc-ve-gizem, disney-plus)

### category_post (pivot)
- post_id, category_id

### tags
- id, name, slug (dram, suc-ve-gizem, film vb.)

### post_tag (pivot)
- post_id, tag_id

### comments
- id, user_id (FK), post_id (FK), content, timestamps

### likes
- id, user_id (FK), post_id (FK), timestamps
- UNIQUE(user_id, post_id)

### podcasts
- id, title, description, spotify_embed_url, cover_image
- duration, published_at, timestamps

### newsletters
- id, email, subscribed_at, unsubscribed_at

### festival_events (İstanbul Film Festivali için)
- id, title, description, cover_image, event_date
- slider_order, timestamps

## Kodlama Kuralları

### Genel
- Türkçe yorum YAZMA, kod ve değişkenler İngilizce
- Her controller tek sorumluluk (Single Responsibility)
- Fat model, skinny controller prensibi
- Form Request kullan (validation için)
- Resource/Collection kullan (API response formatı için)

### Laravel
- Route model binding kullan
- Policy kullan (yetkilendirme)
- Observer kullan (view count artırma vb.)
- Eager loading kullan (N+1 sorgu yok)
- Cache kullan (popüler yazılar, kategoriler)

### Vue.js
- Composition API kullan (Options API değil)
- `<script setup>` syntax kullan
- Props ve emits açıkça tanımla
- Component isimleri PascalCase
- Composable'lar `use` prefix'i ile

### Tailwind CSS
- Ana renk paleti: Kırmızı (#DC2626 / red-600), Beyaz, Siyah
- Responsive: mobile-first yaklaşım
- Dark mode: şimdilik yok, gelecekte eklenebilir

### Git
- Branch: feature/xxx, fix/xxx, hotfix/xxx
- Commit mesajları İngilizce, Conventional Commits formatı
- main branch'e direkt push yok

## Görev Sıralaması (Kimi K2.5 İçin)

### Faz 1: Proje Kurulumu
1. Laravel 11 projesi oluştur
2. Vue 3 + Inertia.js + Tailwind CSS 4 kur
3. Veritabanı migration'larını yaz
4. Model ilişkilerini tanımla
5. Seeder'lar yaz (test verisi)

### Faz 2: Auth Sistemi
1. Laravel Socialite kur (Google + Facebook)
2. Login/Register sayfaları (Vue)
3. LoginModal component
4. Auth middleware

### Faz 3: Blog Çekirdeği
1. PostController (CRUD)
2. Home.vue (yazı grid'i - PostCard, PostGrid)
3. Post/Show.vue (yazı detay sayfası)
4. Kategori filtreleme
5. Arama özelliği

### Faz 4: Etkileşim
1. Yorum sistemi
2. Beğeni sistemi
3. Görüntülenme sayacı
4. Sosyal paylaşım butonları

### Faz 5: Ek Özellikler
1. Podcast sayfası (Spotify embed)
2. Festival sayfası (slider)
3. Newsletter abonelik
4. Yazar profil sayfası

### Faz 6: Admin Panel
1. Yazı ekleme/düzenleme (rich text editor - TipTap)
2. Kategori yönetimi
3. Kullanıcı yönetimi
4. Dashboard (istatistikler)

### Faz 7: Wix Veri Taşıma
1. Wix'ten veri export
2. Import script yaz
3. Görsel dosyalarını taşı
4. URL redirect'leri ayarla

### Faz 8: Deploy
1. Shared hosting'e deploy
2. Domain taşıma
3. SSL kurulumu
4. Performance optimizasyonu
