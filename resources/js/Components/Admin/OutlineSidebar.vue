<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useEditor } from '@tiptap/vue-3';

const props = defineProps({
    editor: { type: Object, default: null },
});

const headings = ref([]);
const activeId = ref(null);

let observer = null;

const extractHeadings = () => {
    if (!props.editor) return;
    const doc = props.editor.state.doc;
    const items = [];
    doc.descendants((node, pos) => {
        if (node.type.name === 'heading' && [1, 2, 3].includes(node.attrs.level)) {
            items.push({
                id: `h-${pos}`,
                level: node.attrs.level,
                text: node.textContent || '',
                pos,
            });
        }
    });
    headings.value = items;
};

const scrollToHeading = (pos) => {
    if (!props.editor) return;
    props.editor.commands.setTextSelection(pos);
    props.editor.commands.focus();
    const element = document.querySelector(`[data-outline-id="h-${pos}"]`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

watch(() => props.editor, (ed) => {
    if (!ed) return;
    ed.on('update', extractHeadings);
    extractHeadings();
});

onMounted(() => {
    if (props.editor) {
        props.editor.on('update', extractHeadings);
        extractHeadings();
    }
});

onUnmounted(() => {
    if (props.editor) {
        props.editor.off('update', extractHeadings);
    }
});
</script>

<template>
    <div v-if="headings.length" class="w-56 flex-shrink-0 border-l-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3">
        <h4 class="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">İçerik Yapısı</h4>
        <nav class="space-y-0.5">
            <button
                v-for="h in headings"
                :key="h.id"
                @click="scrollToHeading(h.pos)"
                :class="[
                    'block w-full text-left text-xs truncate py-0.5 hover:text-red-700 transition-colors',
                    h.level === 1 ? 'font-bold' : h.level === 2 ? 'pl-2 font-medium' : 'pl-4 text-[var(--bi-muted)]'
                ]"
            >
                {{ h.text }}
            </button>
        </nav>
    </div>
</template>
