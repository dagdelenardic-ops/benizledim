<script setup>
import { watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Image,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: 'Yazınızı buraya yazın...' }),
        Underline,
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
});

watch(() => props.modelValue, (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
        editor.value.commands.setContent(value);
    }
});

const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleHeading2 = () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run();
const toggleHeading3 = () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run();
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();

const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
        editor.value?.chain().focus().setLink({ href: url }).run();
    }
};

const addImage = () => {
    const url = window.prompt('Görsel URL:');
    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run();
    }
};

const undo = () => editor.value?.chain().focus().undo().run();
const redo = () => editor.value?.chain().focus().redo().run();

const isActive = (type, options = {}) => {
    return editor.value?.isActive(type, options) ?? false;
};
</script>

<template>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
        <!-- Toolbar -->
        <div class="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
            <button
                type="button"
                @click="toggleBold"
                :class="{ 'bg-gray-200': isActive('bold') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 font-bold text-sm transition-colors"
                title="Bold"
            >
                B
            </button>
            <button
                type="button"
                @click="toggleItalic"
                :class="{ 'bg-gray-200': isActive('italic') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 italic text-sm transition-colors"
                title="Italic"
            >
                I
            </button>
            <button
                type="button"
                @click="toggleUnderline"
                :class="{ 'bg-gray-200': isActive('underline') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 underline text-sm transition-colors"
                title="Underline"
            >
                U
            </button>
            <div class="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                type="button"
                @click="toggleHeading2"
                :class="{ 'bg-gray-200': isActive('heading', { level: 2 }) }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-bold transition-colors"
                title="Başlık 2"
            >
                H2
            </button>
            <button
                type="button"
                @click="toggleHeading3"
                :class="{ 'bg-gray-200': isActive('heading', { level: 3 }) }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-bold transition-colors"
                title="Başlık 3"
            >
                H3
            </button>
            <div class="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                type="button"
                @click="toggleBulletList"
                :class="{ 'bg-gray-200': isActive('bulletList') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Liste"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <button
                type="button"
                @click="toggleOrderedList"
                :class="{ 'bg-gray-200': isActive('orderedList') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Numaralı Liste"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01" />
                </svg>
            </button>
            <button
                type="button"
                @click="toggleBlockquote"
                :class="{ 'bg-gray-200': isActive('blockquote') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Alıntı"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            </button>
            <div class="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                type="button"
                @click="addLink"
                :class="{ 'bg-gray-200': isActive('link') }"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Link"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </button>
            <button
                type="button"
                @click="addImage"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Görsel"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>
            <div class="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                type="button"
                @click="undo"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="Geri Al"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
            </button>
            <button
                type="button"
                @click="redo"
                class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm transition-colors"
                title="İleri Al"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
            </button>
        </div>

        <!-- Editor Content -->
        <EditorContent
            :editor="editor"
            class="prose prose-lg max-w-none p-4 min-h-[300px] focus:outline-none"
        />
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
</style>
