# Benizledim — Profesyonel Yazı Editörü: Uygulama Görevi

> **Bu belge Deepseek için hazırlanmış bir uygulama görevidir.**
> Mevcut Laravel 11 + Vue 3 + Inertia.js + Tailwind CSS 4 stack'ine uygun olarak
> yazılmıştır. Değiştir/sil yazmak yerine mevcut dosyaları geliştir.

---

## 1. Proje Bağlamı

| Parametre | Değer |
|-----------|-------|
| Backend | Laravel 11 (PHP 8.2+) |
| Frontend | Vue 3 + Inertia.js + Vite |
| CSS | Tailwind CSS 4 (brutalist "gazete" teması) |
| Editör (mevcut) | Tiptap v2 (`resources/js/Components/Admin/RichTextEditor.vue`) |
| Dosya depolama | Laravel `public` diski → `storage/app/public/posts/` |
| Deploy | Shared hosting (LiteSpeed cPanel) |
| Tarayıcı desteği | Modern Chrome/Firefox/Safari (ES2020+) |

**Hedef deneyim:** Ghost + Medium + Notion = yazarın her şeyi editörde halledebilmesi.
Tarayıcıyı kapayıp geri gelince tam kaldığı yerden devam etmesi.

---

## 2. Yapılacaklar (özet)

```
A. Otomatik Kayıt (Autosave)
B. Görsel Yükleme — 4 yöntem
C. Editör UX Geliştirmeleri
D. Backend API Endpoint'leri
E. Güvenlik & Validation
```

---

## 3. A — Otomatik Kayıt (Autosave / Draft Persistence)

### 3.1 Nasıl Çalışacak

1. **localStorage (anlık):** Kullanıcı her tuşa basışta içerik `localStorage`'a yazılır (debounce: 500ms). Tarayıcı çökmesi/kapanması durumunda kayıp sıfır.
2. **Sunucu (periyodik):** Her 30 saniyede bir, içerik değiştiyse `PUT /admin/posts/{id}/autosave` endpoint'ine sessizce POST atılır.
3. **Geri yükleme:** Sayfa ilk yüklendiğinde, `localStorage`'daki draft, DB'deki versiyondan daha yeniyse kullanıcıya `"Kaydedilmemiş taslak var, devam et mi?"` bildirimi gösterilir.
4. **Yeni yazı (Create):** Henüz `id` olmadığı için önce localStorage'a kaydedilir. İlk kayıt (submit) sonrası elde edilen `id` ile localStorage anahtarı güncellenir.

### 3.2 Frontend — `RichTextEditor.vue` değişiklikleri

Mevcut dosya: `resources/js/Components/Admin/RichTextEditor.vue`

**Eklenecek prop'lar:**
```js
const props = defineProps({
    modelValue: { type: String, default: '' },
    autosaveKey: { type: String, default: null },   // localStorage anahtar prefix'i
    autosaveEndpoint: { type: String, default: null }, // PUT URL, null ise sadece localStorage
});
```

**Eklenecek composable:** `resources/js/Composables/useAutosave.js` (YENİ DOSYA)

```js
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';

export function useAutosave(content, { localKey, endpoint, debounceMs = 500, intervalMs = 30000 }) {
    const lastSavedAt = ref(null);
    const isDirty = ref(false);
    const saveStatus = ref('idle'); // 'idle' | 'saving' | 'saved' | 'error'

    // --- localStorage (anlık, tarayıcı kapatmaya karşı) ---
    let debounceTimer = null;
    watch(content, (val) => {
        isDirty.value = true;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (localKey) {
                localStorage.setItem(localKey, JSON.stringify({ content: val, savedAt: Date.now() }));
            }
        }, debounceMs);
    });

    // --- Sunucu (periyodik) ---
    let serverTimer = null;
    const saveToServer = async () => {
        if (!endpoint || !isDirty.value) return;
        saveStatus.value = 'saving';
        try {
            await window.axios.put(endpoint, { content: content.value });
            lastSavedAt.value = new Date();
            isDirty.value = false;
            saveStatus.value = 'saved';
        } catch {
            saveStatus.value = 'error';
        }
    };

    const startInterval = () => {
        serverTimer = setInterval(saveToServer, intervalMs);
    };
    const stopInterval = () => clearInterval(serverTimer);

    // --- localStorage'dan geri yükleme ---
    const restoreFromLocal = () => {
        if (!localKey) return null;
        const raw = localStorage.getItem(localKey);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    };

    const clearLocal = () => {
        if (localKey) localStorage.removeItem(localKey);
    };

    return { lastSavedAt, saveStatus, isDirty, saveToServer, startInterval, stopInterval, restoreFromLocal, clearLocal };
}
```

**`RichTextEditor.vue` içinde kullanım:**
- `onMounted` içinde `restoreFromLocal()` çağır, DB verisinden yeniyse banner göster.
- Editor `onUpdate` event'ında composable'ı tetikle.
- `startInterval()` ile periyodik kayıt başlat, `onUnmounted` içinde `stopInterval()` çağır.

**Kullanıcı arayüzü — "Son kayıt" banner'ı:**
```html
<!-- RichTextEditor.vue template içine ekle -->
<div class="flex items-center gap-2 px-3 py-1 text-xs border-b border-[var(--bi-ink)] bg-[var(--bi-paper)]">
    <span v-if="saveStatus === 'saving'" class="text-gray-500">⏳ Kaydediliyor...</span>
    <span v-else-if="saveStatus === 'saved'" class="text-green-700">✓ {{ formatTime(lastSavedAt) }} kaydedildi</span>
    <span v-else-if="saveStatus === 'error'" class="text-red-600">⚠ Kayıt hatası — internet bağlantısını kontrol et</span>
</div>
```

**Draft geri yükleme banner'ı (Edit.vue ve Create.vue içine ekle):**
```html
<div v-if="draftRestoreAvailable"
     class="mb-4 flex items-center justify-between border-2 border-amber-500 bg-amber-50 p-3">
    <span class="text-sm font-bold">Kaydedilmemiş taslak bulundu ({{ draftSavedAt }})</span>
    <div class="flex gap-2">
        <button @click="restoreDraft" class="btn-sm bg-amber-500 text-white">Devam Et</button>
        <button @click="discardDraft" class="btn-sm border border-gray-400">Yoksay</button>
    </div>
</div>
```

### 3.3 Backend — Autosave Endpoint

**Route ekle** (`routes/web.php`, admin middleware grubu içine):
```php
Route::put('/posts/{post}/autosave', [AdminPostController::class, 'autosave'])
    ->name('posts.autosave');
```

**Controller metodu** (`app/Http/Controllers/Admin/AdminPostController.php`):
```php
public function autosave(Request $request, Post $post): JsonResponse
{
    // Sadece kendi yazısını veya admin/editör tüm yazıları kaydedebilir
    $this->authorize('update', $post);

    $request->validate([
        'content' => ['required', 'string', 'max:500000'],
    ]);

    $post->update([
        'content'    => $request->string('content'),
        'updated_at' => now(),
    ]);

    return response()->json([
        'saved_at' => $post->updated_at->toISOString(),
    ]);
}
```

**localStorage anahtar formatı:**
```
benizledim_draft_post_{id}          // mevcut yazı
benizledim_draft_new_{timestamp}    // yeni yazı (henüz kaydedilmemiş)
```

---

## 4. B — Görsel Yükleme (4 Yöntem)

### 4.1 Backend — `PostImageController` (YENİ DOSYA)

`app/Http/Controllers/Admin/PostImageController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostImageController extends Controller
{
    private const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private const ALLOWED_MIMES  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private const ALLOWED_EXTS   = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    /**
     * POST /admin/posts/images
     * Üç kaynak: dosya yükle, base64 (clipboard paste), uzak URL
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->hasFile('image')) {
            return $this->storeFile($request);
        }

        if ($request->filled('base64')) {
            return $this->storeBase64($request);
        }

        if ($request->filled('url')) {
            return $this->storeRemoteUrl($request);
        }

        return response()->json(['error' => 'Görsel kaynağı belirtilmedi.'], 422);
    }

    // --- Dosya yükleme (input[type=file] ve drag-drop) ---
    private function storeFile(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'max:5120', 'mimes:jpeg,png,gif,webp'],
        ]);

        $path = $request->file('image')->store('posts/images', 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }

    // --- Base64 (tarayıcı pano yapıştırma) ---
    private function storeBase64(Request $request): JsonResponse
    {
        $base64 = $request->string('base64')->toString();

        // data:image/png;base64,XXXX → ayır
        if (!preg_match('/^data:(image\/[a-z]+);base64,(.+)$/i', $base64, $matches)) {
            return response()->json(['error' => 'Geçersiz base64 formatı.'], 422);
        }

        $mimeType = strtolower($matches[1]);
        if (!in_array($mimeType, self::ALLOWED_MIMES, true)) {
            return response()->json(['error' => 'Desteklenmeyen görsel türü.'], 422);
        }

        $data = base64_decode($matches[2], strict: true);
        if ($data === false || strlen($data) > self::MAX_SIZE_BYTES) {
            return response()->json(['error' => 'Görsel çok büyük veya geçersiz (max 5 MB).'], 422);
        }

        $ext      = explode('/', $mimeType)[1];
        $filename = 'posts/images/' . Str::uuid() . '.' . $ext;
        Storage::disk('public')->put($filename, $data);

        return response()->json(['url' => Storage::disk('public')->url($filename)]);
    }

    // --- Uzak URL (internetten kopyalanan görsel URL'si) ---
    private function storeRemoteUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => ['required', 'url', 'max:2048'],
        ]);

        $remoteUrl = $request->string('url')->toString();

        // Sadece http/https kabul et
        if (!preg_match('/^https?:\/\//i', $remoteUrl)) {
            return response()->json(['error' => 'Sadece HTTP/HTTPS URL desteklenir.'], 422);
        }

        $context = stream_context_create([
            'http' => [
                'timeout'       => 10,
                'max_redirects' => 3,
                'user_agent'    => 'Benizledim/1.0',
            ],
        ]);

        $data = @file_get_contents($remoteUrl, false, $context);
        if ($data === false || strlen($data) > self::MAX_SIZE_BYTES) {
            return response()->json(['error' => 'Görsel indirilemedi veya çok büyük (max 5 MB).'], 422);
        }

        // MIME tespiti
        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($data);
        if (!in_array($mimeType, self::ALLOWED_MIMES, true)) {
            return response()->json(['error' => 'Desteklenmeyen görsel türü.'], 422);
        }

        $ext      = explode('/', $mimeType)[1];
        $filename = 'posts/images/' . Str::uuid() . '.' . $ext;
        Storage::disk('public')->put($filename, $data);

        return response()->json(['url' => Storage::disk('public')->url($filename)]);
    }
}
```

**Route ekle** (`routes/web.php`):
```php
Route::post('/posts/images', [PostImageController::class, 'store'])
    ->name('posts.images.store');
```

### 4.2 Frontend — Tiptap Custom Image Extension

`resources/js/Extensions/UploadImage.js` (YENİ DOSYA)

```js
import Image from '@tiptap/extension-image';
import { Plugin } from '@tiptap/pm/state';
import axios from 'axios';

const UPLOAD_URL = '/admin/posts/images';

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
}

async function uploadBase64(base64) {
    const { data } = await axios.post(UPLOAD_URL, { base64 });
    return data.url;
}

async function uploadRemoteUrl(url) {
    const { data } = await axios.post(UPLOAD_URL, { url });
    return data.url;
}

export const UploadImage = Image.extend({
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    // ---- Sürükle-bırak (drag & drop) ----
                    handleDrop(view, event) {
                        const files = [...(event.dataTransfer?.files ?? [])].filter(f =>
                            f.type.startsWith('image/')
                        );
                        if (!files.length) return false;

                        event.preventDefault();
                        files.forEach(async (file) => {
                            const url = await uploadFile(file);
                            const { schema } = view.state;
                            const node = schema.nodes.image.create({ src: url });
                            const transaction = view.state.tr.replaceSelectionWith(node);
                            view.dispatch(transaction);
                        });
                        return true;
                    },

                    // ---- Yapıştırma (Ctrl+V / Cmd+V) ----
                    handlePaste(view, event) {
                        const items = [...(event.clipboardData?.items ?? [])];

                        // Önce dosya görseli ara (ekran görüntüsü, kopyalanmış görsel)
                        const imageItem = items.find(i => i.type.startsWith('image/'));
                        if (imageItem) {
                            event.preventDefault();
                            const file = imageItem.getAsFile();
                            uploadFile(file).then((url) => {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                view.dispatch(view.state.tr.replaceSelectionWith(node));
                            });
                            return true;
                        }

                        // Sonra metin içinde görsel URL'si ara
                        const textItem = items.find(i => i.type === 'text/plain');
                        if (textItem) {
                            textItem.getAsString(async (text) => {
                                const trimmed = text.trim();
                                const isImageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(trimmed);
                                if (isImageUrl) {
                                    event.preventDefault();
                                    const url = await uploadRemoteUrl(trimmed);
                                    const { schema } = view.state;
                                    const node = schema.nodes.image.create({ src: url });
                                    view.dispatch(view.state.tr.replaceSelectionWith(node));
                                }
                            });
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});
```

### 4.3 `RichTextEditor.vue` — Image Extension değişimi

Mevcut `import Image from '@tiptap/extension-image'` satırını kaldır, yenisini ekle:

```js
// ÖNCE (kaldır):
import Image from '@tiptap/extension-image';

// SONRA (ekle):
import { UploadImage } from '../../Extensions/UploadImage.js';
```

`extensions` dizisinde `Image` yerine `UploadImage` kullan.

### 4.4 Toolbar — Görsel Yükleme Butonu

Mevcut `addImage()` fonksiyonunu (`window.prompt` ile URL soran) tamamen yeniden yaz:

```js
// Dosya seç (input[type=file])
const imageInputRef = ref(null);

const addImage = () => imageInputRef.value?.click();

const handleImageFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Yükleniyor göstergesi
    uploadingImage.value = true;
    try {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post('/admin/posts/images', formData);
        editor.value?.chain().focus().setImage({ src: data.url }).run();
    } finally {
        uploadingImage.value = false;
        e.target.value = '';
    }
};
```

Template'e ekle:
```html
<!-- Gizli file input -->
<input
    ref="imageInputRef"
    type="file"
    accept="image/jpeg,image/png,image/gif,image/webp"
    class="hidden"
    @change="handleImageFile"
/>

<!-- Toolbar butonu — mevcut görsel butonunu değiştir -->
<button type="button" @click="addImage" :disabled="uploadingImage"
        class="toolbar-btn" title="Görsel ekle (dosya, yapıştır veya sürükle-bırak)">
    <span v-if="uploadingImage">⏳</span>
    <span v-else>🖼</span>
</button>
```

### 4.5 Desteklenen Görsel Yükleme Yöntemleri (özet)

| Yöntem | Nasıl Çalışır | Kullanıcı Aksiyonu |
|--------|--------------|-------------------|
| **Dosya seç** | `input[type=file]` → `multipart/form-data` | Toolbar butonuna tıkla |
| **Sürükle-bırak** | ProseMirror `handleDrop` plugin | Görsel dosyasını editöre sürükle |
| **Pano yapıştır** | ProseMirror `handlePaste` plugin | Screenshotu veya kopyalanan görseli Ctrl+V |
| **URL yapıştır** | `handlePaste` + URL regex tespiti | Görsel URL'sini Ctrl+V |

---

## 5. C — Editör UX Geliştirmeleri

### 5.1 Yeni Tiptap Extension'ları

Mevcut `package.json`'a eklenecek paketler:
```bash
npm install @tiptap/extension-character-count @tiptap/extension-typography \
            @tiptap/extension-text-align @tiptap/extension-highlight \
            @tiptap/extension-code-block-lowlight lowlight
```

`RichTextEditor.vue` extensions dizinine ekle:
```js
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

// extensions dizinine ekle:
CharacterCount.configure({ limit: 50000 }),
Typography,
TextAlign.configure({ types: ['heading', 'paragraph'] }),
Highlight.configure({ multicolor: false }),
CodeBlockLowlight.configure({ lowlight }),
```

### 5.2 Toolbar Eklentileri

Mevcut toolbar'a eklenecek butonlar:
- **Metin hizalama:** Sol / Orta / Sağ
- **Satır kesme:** `<hr>` ekleme
- **Kod bloğu:** `<pre><code>` toggle
- **İşaretleme (highlight):** sarı arka plan
- **Heading 1:** H1 toggle (şu an sadece H2/H3 var)
- **Fullscreen:** Editörü tam ekran yap

### 5.3 Kelime/Karakter Sayacı

Editörün altına ekle:
```html
<div class="flex justify-end gap-4 px-3 py-1 text-xs text-gray-500 border-t border-[var(--bi-ink)]">
    <span>{{ editor?.storage.characterCount.words() }} kelime</span>
    <span>{{ editor?.storage.characterCount.characters() }} karakter</span>
    <span>~{{ readingTime }} dk okuma</span>
</div>
```

`readingTime` hesabı:
```js
const readingTime = computed(() => {
    const words = editor.value?.storage.characterCount.words() ?? 0;
    return Math.max(1, Math.ceil(words / 200));
});
```

Bu değeri `Create.vue` / `Edit.vue` içinde `form.reading_time_minutes`'e otomatik bağla.

### 5.4 Görsel Caption (Alt Metin)

Tiptap Image node'unu extend ederek görsele tıklandığında `alt` ve `title` alanı düzenlenebilir yap:
```js
// UploadImage.js extension'ına addAttributes ekle:
addAttributes() {
    return {
        ...this.parent?.(),
        caption: { default: null },
    };
},
```

---

## 6. D — Backend API Endpoint'leri (tam liste)

| Method | URL | Açıklama | Controller |
|--------|-----|----------|-----------|
| `PUT` | `/admin/posts/{post}/autosave` | Otomatik taslak kayıt | `AdminPostController@autosave` |
| `POST` | `/admin/posts/images` | Görsel yükle (dosya/base64/url) | `PostImageController@store` |
| `GET` | `/admin/posts/{post}/draft-status` | Sunucudaki son kayıt zamanı | `AdminPostController@draftStatus` |

**`draftStatus` metodu:**
```php
public function draftStatus(Post $post): JsonResponse
{
    $this->authorize('view', $post);
    return response()->json([
        'updated_at' => $post->updated_at->toISOString(),
        'status'     => $post->status,
    ]);
}
```

---

## 7. E — Güvenlik & Validation

1. **Dosya boyutu:** Max 5 MB (backend ve frontend'de ayrı ayrı kontrol).
2. **MIME kontrolü:** Sadece `image/jpeg, image/png, image/gif, image/webp`. Extension spoofing'e karşı `finfo` ile gerçek MIME kontrol et (backend `storeBase64` metodunda zaten var).
3. **Uzak URL fetch:** `stream_context` timeout 10s, max redirect 3. Private IP (127.0.0.1, 192.168.x.x, 10.x.x.x) adreslerine fetch engelle — SSRF koruması:
   ```php
   // storeRemoteUrl içine ekle (parse_url sonrası):
   $host = parse_url($remoteUrl, PHP_URL_HOST);
   if (filter_var($host, FILTER_VALIDATE_IP)) {
       // Sadece public IP'ye izin ver
       if (!filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
           return response()->json(['error' => 'Bu IP adresine erişim yasak.'], 403);
       }
   }
   ```
4. **Autosave auth:** `$this->authorize('update', $post)` — başkasının yazısını autosave etme.
5. **Rate limiting:** `throttle:60,1` middleware ile `/admin/posts/images` endpoint'ini koru.
6. **XSS:** Tiptap HTML çıktısı zaten güvenli, ancak backend'de `HTMLPurifier` veya Laravel'in built-in sanitization kullanılabilir (opsiyonel, Tiptap schema whitelist yeterli).

---

## 8. Dosya Değişiklik Özeti

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `resources/js/Components/Admin/RichTextEditor.vue` | UploadImage extension, autosave composable entegrasyonu, toolbar güncellemeleri, kelime sayacı |
| `resources/js/Pages/Admin/Posts/Create.vue` | autosaveKey prop geçme, draft restore banner |
| `resources/js/Pages/Admin/Posts/Edit.vue` | autosaveKey + autosaveEndpoint prop geçme, draft restore banner |
| `app/Http/Controllers/Admin/AdminPostController.php` | `autosave()` ve `draftStatus()` metodları ekle |
| `routes/web.php` | 3 yeni route (autosave, images, draft-status) |

### Oluşturulacak Yeni Dosyalar

| Dosya | İçerik |
|-------|--------|
| `resources/js/Composables/useAutosave.js` | Autosave composable |
| `resources/js/Extensions/UploadImage.js` | Tiptap custom image extension (sürükle-bırak, yapıştır) |
| `app/Http/Controllers/Admin/PostImageController.php` | Görsel upload controller |

---

## 9. Uygulama Sırası

```
1. PostImageController.php oluştur + route ekle
2. UploadImage.js extension oluştur
3. RichTextEditor.vue — Image extension'ı değiştir, toolbar güncelle
4. useAutosave.js composable oluştur
5. RichTextEditor.vue — autosave entegrasyonu, banner ekle
6. AdminPostController.php — autosave() + draftStatus() ekle + route
7. Create.vue + Edit.vue — autosaveKey prop + draft restore banner
8. npm run build → test
9. php artisan test → tüm testler yeşil olmalı
```

---

## 10. Test Edilmesi Gerekenler

- [ ] Dosya seçici ile JPG/PNG/GIF/WebP yükleme çalışıyor
- [ ] 5 MB üzeri dosya hata veriyor
- [ ] Ekran görüntüsü Ctrl+V ile editöre yapıştırılıyor
- [ ] Görsel URL'si Ctrl+V yapıştırıldığında uzak görsel indirilip yükleniyor
- [ ] Dosya sürüklenip editöre bırakıldığında yükleniyor
- [ ] 30 sn sonra autosave çalışıyor (Network tab'dan kontrol et)
- [ ] Tarayıcı kapanıp açıldığında draft restore banner'ı çıkıyor
- [ ] "Devam Et" butonu localStorage içeriğini yüklüyor
- [ ] "Yoksay" butonu localStorage'ı temizliyor
- [ ] Kelime sayacı doğru çalışıyor
- [ ] Yetki dışı kullanıcı `/admin/posts/images` POST atamıyor (403)
- [ ] Private IP URL fetch engelleniyor (SSRF koruması)
