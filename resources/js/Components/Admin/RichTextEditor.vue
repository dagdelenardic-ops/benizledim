<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import axios from 'axios';
import { useAutosave } from '../../Composables/useAutosave';
import { UploadImage } from '../../Extensions/UploadImage';
import { EmbedExtension } from '../../Extensions/EmbedExtension';
import OutlineSidebar from './OutlineSidebar.vue';

const lowlight = createLowlight(common);

const props = defineProps({
    modelValue: { type: String, default: '' },
    autosaveKey: { type: String, default: null },
    autosaveEndpoint: { type: String, default: null },
});

const emit = defineEmits(['update:modelValue', 'update:readingTime']);

const previewMode = ref(false);
const uploadingImage = ref(false);
const imageInputRef = ref(null);
const editorRef = ref(null);
const draftRestoreAvailable = ref(false);
const draftSavedAt = ref('');
const showLinkModal = ref(false);
const linkUrl = ref('');
const linkSearchQuery = ref('');
const linkSearchResults = ref([]);
const linkSearchLoading = ref(false);
let linkSearchTimer = null;

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            link: false,
            underline: false,
            codeBlock: false,
        }),
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: 'Yazınızı buraya yazın...' }),
        Underline,
        CharacterCount.configure({ limit: 50000 }),
        Typography,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Highlight.configure({ multicolor: false }),
        CodeBlockLowlight.configure({ lowlight }),
        UploadImage,
        EmbedExtension,
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
        const words = editor.storage.characterCount?.words() ?? 0;
        const rt = Math.max(1, Math.ceil(words / 200));
        emit('update:readingTime', rt);
    },
});

const getContent = () => {
    if (!editor.value) return '';
    try { return editor.value.getHTML(); } catch { return props.modelValue; }
};

const {
    lastSavedAt, saveStatus, saveToServer, startInterval, stopInterval,
    restoreFromLocal, clearLocal, formatTime,
} = useAutosave(
    computed(() => getContent()),
    {
        localKey: props.autosaveKey,
        endpoint: props.autosaveEndpoint,
        debounceMs: 500,
        intervalMs: 30000,
    }
);

onMounted(() => {
    startInterval();
    if (props.autosaveKey) {
        const draft = restoreFromLocal();
        if (draft?.content && draft.content !== props.modelValue && draft.content.length > 0) {
            draftRestoreAvailable.value = true;
            draftSavedAt.value = new Date(draft.savedAt).toLocaleString('tr-TR');
        }
    }
});

onUnmounted(() => stopInterval());

const restoreDraft = () => {
    const draft = restoreFromLocal();
    if (draft?.content && editor.value) {
        editor.value.commands.setContent(draft.content);
    }
    draftRestoreAvailable.value = false;
};

const discardDraft = () => {
    clearLocal();
    draftRestoreAvailable.value = false;
};

watch(() => props.modelValue, (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
        editor.value.commands.setContent(value, false);
    }
});

const readingTime = computed(() => {
    const words = editor.value?.storage.characterCount?.words() ?? 0;
    return Math.max(1, Math.ceil(words / 200));
});

// --- Toolbar helpers ---
const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleHeading1 = () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run();
const toggleHeading2 = () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run();
const toggleHeading3 = () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run();
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();
const toggleHighlight = () => editor.value?.chain().focus().toggleHighlight().run();
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run();
const setTextAlign = (align) => editor.value?.chain().focus().setTextAlign(align).run();
const toggleHorizontalRule = () => editor.value?.chain().focus().setHorizontalRule().run();
const undo = () => editor.value?.chain().focus().undo().run();
const redo = () => editor.value?.chain().focus().redo().run();
const isActive = (type, options = {}) => editor.value?.isActive(type, options) ?? false;

// --- Link modal ---
const openLinkModal = () => {
    linkUrl.value = '';
    linkSearchQuery.value = '';
    linkSearchResults.value = [];
    showLinkModal.value = true;
};

const insertLink = () => {
    if (linkUrl.value && editor.value) {
        editor.value.chain().focus().setLink({ href: linkUrl.value }).run();
    }
    showLinkModal.value = false;
};

const searchLinks = () => {
    clearTimeout(linkSearchTimer);
    const q = linkSearchQuery.value.trim();
    if (q.length < 2) { linkSearchResults.value = []; return; }
    linkSearchTimer = setTimeout(async () => {
        linkSearchLoading.value = true;
        try {
            const { data } = await axios.get('/admin/posts/search', { params: { q } });
            linkSearchResults.value = data;
        } catch { linkSearchResults.value = []; }
        linkSearchLoading.value = false;
    }, 300);
};

const selectSearchResult = (post) => {
    linkUrl.value = `/yazi/${post.slug}`;
    linkSearchResults.value = [];
    linkSearchQuery.value = '';
};

// --- Image upload ---
const addImage = () => imageInputRef.value?.click();

const handleImageFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadingImage.value = true;
    try {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post('/admin/posts/images', formData);
        const alt = window.prompt('Alt metin (isteğe bağlı):', '')?.trim() || null;
        editor.value?.chain().focus().setImage({ src: data.url, alt }).run();
    } catch (err) {
        alert('Görsel yüklenemedi.');
    } finally {
        uploadingImage.value = false;
        e.target.value = '';
    }
};

// --- Embed ---
const addEmbed = () => {
    const url = window.prompt('YouTube, Vimeo veya Spotify URL\'si:');
    if (!url) return;
    axios.post('/admin/posts/embed', { url })
        .then(({ data }) => {
            if (data.embed_url) {
                editor.value?.commands.setEmbed({
                    service: data.service,
                    embedUrl: data.embed_url,
                    originalUrl: data.original_url,
                });
            } else {
                alert('Bu URL embed edilemiyor.');
            }
        })
        .catch(() => alert('Embed çözümlenemedi.'));
};

// --- Markdown paste ---
const applyMarkdownBasic = (text) => {
    if (!editor.value) return text;
    return text
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
        .replace(/`(.+?)`/g, '<code>$1</code>');
};

const handleEditorPaste = (view, event) => {
    const text = event.clipboardData?.getData('text/plain');
    if (!text) return false;
    const mdPatterns = /^#{1,3} |\*\*.*\*\*|^- |\*.*\*|`.*`/m;
    if (!mdPatterns.test(text)) return false;

    event.preventDefault();
    const html = applyMarkdownBasic(text);
    const { schema } = view.state;
    const fragment = schema.nodes.paragraph ? `<p>${html}</p>` : html;
    editor.value?.commands.insertContent(fragment);
    return true;
};

const togglePreview = () => {
    previewMode.value = !previewMode.value;
};
</script>

<template>
    <div class="overflow-hidden border-2 border-[var(--bi-ink)] bg-white">
        <!-- Draft restore banner -->
        <div v-if="draftRestoreAvailable"
             class="flex items-center justify-between border-b-2 border-amber-500 bg-amber-50 px-4 py-3">
            <span class="text-sm font-bold text-amber-900">Kaydedilmemiş taslak bulundu ({{ draftSavedAt }})</span>
            <div class="flex gap-2">
                <button @click="restoreDraft" class="border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600">
                    Devam Et
                </button>
                <button @click="discardDraft" class="border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    Yoksay
                </button>
            </div>
        </div>

        <!-- Autosave status banner -->
        <div class="flex items-center gap-2 border-b border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-1 text-xs">
            <span v-if="saveStatus === 'saving'" class="text-gray-500">⏳ Kaydediliyor...</span>
            <span v-else-if="saveStatus === 'saved'" class="text-green-700">✓ {{ formatTime(lastSavedAt) }} kaydedildi</span>
            <span v-else-if="saveStatus === 'error'" class="text-red-600">⚠ Kayıt hatası — internet bağlantısını kontrol et</span>
            <span v-else class="text-gray-400">Otomatik kayıt aktif</span>
        </div>

        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-1 border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-2">
            <!-- Formatting -->
            <button type="button" @click="toggleBold"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('bold') }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Kalın">B</button>
            <button type="button" @click="toggleItalic"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('italic') }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold italic transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="İtalik">I</button>
            <button type="button" @click="toggleUnderline"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('underline') }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold underline transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Alt Çizgi">U</button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Headings -->
            <button type="button" @click="toggleHeading1"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('heading', { level: 1 }) }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Başlık 1">H1</button>
            <button type="button" @click="toggleHeading2"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('heading', { level: 2 }) }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Başlık 2">H2</button>
            <button type="button" @click="toggleHeading3"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('heading', { level: 3 }) }"
                class="border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Başlık 3">H3</button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Align -->
            <button type="button" @click="setTextAlign('left')"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive({ textAlign: 'left' }) }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Sola Hizala">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"/></svg>
            </button>
            <button type="button" @click="setTextAlign('center')"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive({ textAlign: 'center' }) }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Ortala">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"/></svg>
            </button>
            <button type="button" @click="setTextAlign('right')"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive({ textAlign: 'right' }) }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Sağa Hizala">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M14 12h6M6 18h14"/></svg>
            </button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Lists & block -->
            <button type="button" @click="toggleBulletList"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('bulletList') }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Liste">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button type="button" @click="toggleOrderedList"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('orderedList') }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Numaralı Liste">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01"/></svg>
            </button>
            <button type="button" @click="toggleBlockquote"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('blockquote') }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Alıntı">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
            </button>
            <button type="button" @click="toggleCodeBlock"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('codeBlock') }"
                class="border border-transparent px-3 py-1.5 text-sm font-mono transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Kod Bloğu">&lt;/&gt;</button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Media -->
            <button type="button" @click="openLinkModal"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('link') }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Link">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            </button>
            <button type="button" @click="addImage" :disabled="uploadingImage"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white disabled:opacity-50" title="Görsel">
                <span v-if="uploadingImage">⏳</span>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </button>
            <button type="button" @click="addEmbed"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Embed (YouTube/Vimeo)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Highlight & HR -->
            <button type="button" @click="toggleHighlight"
                :class="{ 'bg-white border-[var(--bi-ink)]': isActive('highlight') }"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="İşaretle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            <button type="button" @click="toggleHorizontalRule"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Yatay Çizgi">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
            </button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>

            <!-- Undo/Redo & Preview -->
            <button type="button" @click="undo"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Geri Al">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
            </button>
            <button type="button" @click="redo"
                class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="İleri Al">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>
            </button>
            <div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div>
            <button type="button" @click="togglePreview"
                :class="{ 'bg-[var(--bi-ink)] text-white': previewMode }"
                class="border border-[var(--bi-ink)] px-3 py-1.5 text-xs font-bold transition-colors hover:bg-[var(--bi-ink)] hover:text-white" title="Önizleme">
                {{ previewMode ? 'Düzenle' : 'Önizle' }}
            </button>
        </div>

        <!-- Editor / Preview -->
        <div class="flex">
            <div class="flex-1 min-w-0">
                <EditorContent v-if="!previewMode" :editor="editor" class="prose prose-lg max-w-none p-4 min-h-[300px] focus:outline-none" />
                <div v-else class="prose prose-lg max-w-none p-4 min-h-[300px]" v-html="editor?.getHTML() || ''"></div>

                <!-- Word count footer -->
                <div class="flex justify-between gap-4 border-t border-[var(--bi-ink)] px-3 py-1 text-xs text-gray-500">
                    <span>{{ editor?.storage.characterCount?.words() ?? 0 }} kelime · {{ editor?.storage.characterCount?.characters() ?? 0 }} karakter</span>
                    <span>~{{ readingTime }} dk okuma</span>
                </div>
            </div>
            <OutlineSidebar v-if="!previewMode" :editor="editor" />
        </div>

        <!-- Hidden file input -->
        <input ref="imageInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="handleImageFile" />

        <!-- Link modal -->
        <Teleport to="body">
            <div v-if="showLinkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showLinkModal = false">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border-2 border-[var(--bi-ink)]">
                    <h3 class="text-lg font-bold mb-4">Link Ekle</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input v-model="linkUrl" type="text" placeholder="https://veya /yazi/slug" class="w-full border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" @keyup.enter="insertLink" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Yazılarda Ara</label>
                            <input v-model="linkSearchQuery" type="text" placeholder="Yazı adı yazın..." class="w-full border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" @input="searchLinks" />
                            <div v-if="linkSearchLoading" class="text-xs text-gray-400 mt-1">Aranıyor...</div>
                            <div v-if="linkSearchResults.length" class="mt-1 border border-[var(--bi-ink)] max-h-40 overflow-y-auto bg-white">
                                <button v-for="post in linkSearchResults" :key="post.id" @click="selectSearchResult(post)" class="block w-full text-left px-3 py-2 text-sm hover:bg-[var(--bi-paper)] border-b border-gray-100 last:border-0">
                                    <span class="font-medium">{{ post.title }}</span>
                                    <span class="text-gray-400 ml-2">/yazi/{{ post.slug }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <button @click="showLinkModal = false" class="border border-[var(--bi-ink)] px-4 py-2 text-sm font-bold hover:bg-[var(--bi-paper)]">İptal</button>
                        <button @click="insertLink" class="bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800">Ekle</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
}

.ProseMirror mark {
    background-color: #fef08a;
    padding: 0 0.125em;
    border-radius: 0.125em;
}

.ProseMirror pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
}

.ProseMirror pre code {
    color: inherit;
    background: none;
    font-size: 0.875em;
}

.ProseMirror img {
    max-width: 100%;
    height: auto;
    border: 2px solid var(--bi-ink, #000);
    margin: 1rem 0;
}

.hljs-comment,
.hljs-quote { color: #6a9955; }
.hljs-keyword,
.hljs-selector-tag,
.hljs-type { color: #569cd6; }
.hljs-string,
.hljs-attr { color: #ce9178; }
.hljs-number,
.hljs-literal { color: #b5cea8; }
.hljs-title,
.hljs-section { color: #dcdcaa; }
.hljs-built_in { color: #4ec9b0; }
.hljs-meta { color: #9b9b9b; }
</style>
