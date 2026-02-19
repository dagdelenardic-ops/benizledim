<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Authors
        $authors = collect([
            ['name' => 'Gurur Sönmez', 'email' => 'gurur@benizledim.com', 'role' => 'admin'],
            ['name' => 'İris Eryılmaz', 'email' => 'iris@benizledim.com', 'role' => 'author'],
            ['name' => 'Muhammed Muğlu', 'email' => 'muhammed@benizledim.com', 'role' => 'author'],
            ['name' => 'Su Evci', 'email' => 'su@benizledim.com', 'role' => 'author'],
            ['name' => 'Alphan Karabat', 'email' => 'alphan@benizledim.com', 'role' => 'author'],
            ['name' => 'Hümeyra Fidan', 'email' => 'humeyra@benizledim.com', 'role' => 'author'],
        ])->map(fn ($data) => User::create([
            ...$data,
            'password' => bcrypt('password'),
            'provider' => 'email',
        ]));

        // Reader
        User::create([
            'name' => 'Test Okuyucu',
            'email' => 'reader@benizledim.com',
            'password' => bcrypt('password'),
            'role' => 'reader',
            'provider' => 'email',
        ]);

        // Categories
        $categories = collect([
            'Sinema', 'Dizi', 'Belgesel', 'Kısa Film',
            'Film', 'Netflix', 'Suç ve Gizem', 'Disney Plus',
        ])->map(fn ($name) => Category::create(['name' => $name]));

        // Tags
        $tags = collect([
            'Dram', 'Komedi', 'Aksiyon', 'Bilim Kurgu',
            'Gerilim', 'Korku', 'Romantik', 'Animasyon',
        ])->map(fn ($name) => Tag::create(['name' => $name]));

        // Posts
        $samplePosts = [
            [
                'title' => 'Red Room: Mekânın Hafızası, Zihnin Mimarisi',
                'excerpt' => 'Lynch\'in kurduğu dünya, sadece bir kasabada yaşanan garip olayları anlatmıyor.',
                'content' => '<p>Lynch\'in kurduğu dünya, sadece bir kasabada yaşanan garip olayları anlatmıyor; aynı zamanda rüyalar, hafıza ve mekân arasındaki görünmez sınırları da sorguluyor.</p><p>Red Room, Twin Peaks evreninin en ikonik mekânlarından biri olarak, Lynch\'in sinematik dilinin merkezinde yer alıyor.</p>',
                'user_index' => 1,
                'category_indices' => [0, 4],
                'tag_indices' => [0, 4],
            ],
            [
                'title' => 'Hikâyenin Peşinde: Tuna Yüksel ile Yazarlık, Dil ve Sinema Üzerine',
                'excerpt' => 'Tuna Yüksel, dijital platformlar ve televizyon için yazdığı projelerle tanınan bir senarist.',
                'content' => '<p>Tuna Yüksel, dijital platformlar ve televizyon için yazdığı projelerle tanınan, çağdaş anlatı dilini kara mizah ve şehir gerçekçiliğiyle birleştiren genç bir senaristtir.</p>',
                'user_index' => 1,
                'category_indices' => [0, 1],
                'tag_indices' => [0],
            ],
            [
                'title' => 'İçgüdülerimizle Neden Barışık Değiliz?',
                'excerpt' => 'Babygirl ve benzeri filmler üzerinden arzular, suçluluk ve toplumun çizdiği sınırlar üzerine bir bakış.',
                'content' => '<p>Babygirl ve benzeri filmler üzerinden arzular, suçluluk ve toplumun çizdiği sınırlar üzerine bir bakış.</p><p>İçgüdülerimiz ile toplumsal normlar arasındaki gerilim, sinema için her zaman verimli bir alan olmuştur.</p>',
                'user_index' => 1,
                'category_indices' => [0, 4],
                'tag_indices' => [0, 4],
            ],
            [
                'title' => 'Superman (2025) İncelemesi - Karanlıktan Aydınlığa, Özüne Dönüş',
                'excerpt' => 'DC\'nin karanlıktan aydınlığa döndüğü yeni Superman filmi.',
                'content' => '<p>Eksiklerine rağmen Superman (2025), DC\'nin karanlıktan aydınlığa döndüğü bir film. James Gunn\'ın vizyonu ile Superman tekrar umut sembolü olarak karşımıza çıkıyor.</p>',
                'user_index' => 3,
                'category_indices' => [0, 4],
                'tag_indices' => [2, 5],
            ],
            [
                'title' => 'Fantastik Dörtlü: İlk Adımlar İncelemesi - Marvel Geri Mi Döndü?',
                'excerpt' => 'Marvel\'ın yeni dönem filmlerinin ilk büyük sınavı.',
                'content' => '<p>Önceki yıllardan iki başarısız deneme ve Marvel\'ın çöküş dönemine gelmesiyle üstünde büyük bir yük taşıyan Fantastik Dörtlü: İlk Adımlar, MCU\'nun geleceği için kritik bir film.</p>',
                'user_index' => 3,
                'category_indices' => [0, 4],
                'tag_indices' => [2, 5],
            ],
            [
                'title' => 'Fantastic 4 After Credits Var Mı?',
                'excerpt' => 'Sonunda Fantastic 4 MCU ile birleşti ve şimdi beyaz perdede karşımızda!',
                'content' => '<p>Sonunda Fantastic 4 MCU ile birleşti ve şimdi beyaz perdede karşımızda! Avengers: Doomsday için kollar sıvandı.</p>',
                'user_index' => 4,
                'category_indices' => [0, 4],
                'tag_indices' => [2],
            ],
            [
                'title' => 'Köln 75: Uçurumun Kenarındaki Bir Adam ve Kırık Bir Piyano',
                'excerpt' => 'Bir gencin organize ettiği ve caz tarihinin en çok satan solo albümünü nasıl yarattığı.',
                'content' => '<p>Keith Jarrett\'ın Köln Konseri, müzik tarihinin en unutulmaz performanslarından biridir. Bu belgesel, o gecenin hikâyesini anlatıyor.</p>',
                'user_index' => 5,
                'category_indices' => [2],
                'tag_indices' => [0],
            ],
            [
                'title' => 'Gürültüsüz bir Çığlık: Glasgow\'un Çocuklarını Dinlemek',
                'excerpt' => 'Ratcatcher\'ın hikâyesi büyük değil; hatta ilk bakışta sıradan.',
                'content' => '<p>Ratcatcher\'ın hikâyesi büyük değil; hatta ilk bakışta sıradan. Glasgow\'un kenarında yaşayan James\'in bir çocukluk hatası, bütün hayatını gölgeleyen bir vicdan yüküne dönüşüyor.</p>',
                'user_index' => 2,
                'category_indices' => [0, 4, 6],
                'tag_indices' => [0, 4],
            ],
        ];

        foreach ($samplePosts as $postData) {
            $post = Post::create([
                'user_id' => $authors[$postData['user_index']]->id,
                'title' => $postData['title'],
                'excerpt' => $postData['excerpt'],
                'content' => $postData['content'],
                'reading_time_minutes' => rand(2, 11),
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 90)),
                'view_count' => rand(20, 300),
            ]);

            $post->categories()->attach(
                collect($postData['category_indices'])->map(fn ($i) => $categories[$i]->id)
            );

            $post->tags()->attach(
                collect($postData['tag_indices'])->map(fn ($i) => $tags[$i]->id)
            );
        }

        // Likes & Comments
        $posts = Post::all();
        $allUsers = User::all();

        foreach ($posts as $post) {
            $likeCount = rand(0, 4);
            $allUsers->random(min($likeCount, $allUsers->count()))->each(function ($user) use ($post) {
                Like::create(['user_id' => $user->id, 'post_id' => $post->id]);
            });
        }

        Comment::create([
            'user_id' => $allUsers->last()->id,
            'post_id' => $posts->first()->id,
            'content' => 'Harika bir yazı olmuş, tebrikler!',
        ]);
    }
}
