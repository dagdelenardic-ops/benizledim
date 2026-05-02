<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    blocks: { type: Array, required: true },
});

const blockRefs = ref([]);
const visibleBlocks = ref(new Set());

let observer = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const index = parseInt(entry.target.dataset.index);
                if (entry.isIntersecting) {
                    visibleBlocks.value.add(index);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    blockRefs.value.forEach((el) => {
        if (el) observer.observe(el);
    });
});

onUnmounted(() => {
    observer?.disconnect();
});

const setBlockRef = (el, index) => {
    if (el) blockRefs.value[index] = el;
};

const isVisible = (index) => visibleBlocks.value.has(index);
</script>

<template>
    <div class="space-y-12">
        <div
            v-for="(block, index) in blocks"
            :key="block.id || index"
            :ref="(el) => setBlockRef(el, index)"
            :data-index="index"
            class="transition-all duration-700 ease-out"
            :class="isVisible(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
            <!-- Text Block -->
            <div v-if="block.type === 'text'" class="prose prose-lg max-w-none prose-p:text-gray-700">
                <div v-html="block.content.body"></div>
            </div>

            <!-- Image Block -->
            <figure v-else-if="block.type === 'image'" class="space-y-3">
                <img
                    :src="block.content.src"
                    :alt="block.content.caption || ''"
                    class="w-full rounded-xl shadow-sm"
                />
                <figcaption v-if="block.content.caption" class="text-sm text-gray-500 text-center italic">
                    {{ block.content.caption }}
                </figcaption>
                <p v-if="block.content.annotation" class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                    {{ block.content.annotation }}
                </p>
            </figure>

            <!-- Comparison Block (side by side) -->
            <div v-else-if="block.type === 'comparison'" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <figure>
                        <img :src="block.content.left.src" :alt="block.content.left.label" class="w-full rounded-lg" />
                        <figcaption class="text-sm text-gray-500 text-center mt-2">{{ block.content.left.label }}</figcaption>
                    </figure>
                    <figure>
                        <img :src="block.content.right.src" :alt="block.content.right.label" class="w-full rounded-lg" />
                        <figcaption class="text-sm text-gray-500 text-center mt-2">{{ block.content.right.label }}</figcaption>
                    </figure>
                </div>
                <p v-if="block.content.description" class="text-sm text-gray-600 text-center">
                    {{ block.content.description }}
                </p>
            </div>

            <!-- Fullwidth Block (image with overlay text) -->
            <div v-else-if="block.type === 'fullwidth'" class="relative rounded-xl overflow-hidden">
                <img :src="block.content.src" alt="" class="w-full h-64 md:h-96 object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div
                    class="absolute p-6 md:p-10 text-white"
                    :class="{
                        'bottom-0 left-0': !block.content.overlay_position || block.content.overlay_position === 'bottom-left',
                        'bottom-0 right-0 text-right': block.content.overlay_position === 'bottom-right',
                        'top-0 left-0': block.content.overlay_position === 'top-left',
                        'inset-0 flex items-center justify-center text-center': block.content.overlay_position === 'center',
                    }"
                >
                    <p class="text-lg md:text-2xl font-bold leading-relaxed max-w-lg">
                        {{ block.content.overlay_text }}
                    </p>
                </div>
            </div>

            <!-- Quote Block -->
            <blockquote v-else-if="block.type === 'quote'" class="border-l-4 border-red-500 pl-6 py-4">
                <p class="text-xl text-gray-800 italic leading-relaxed">
                    "{{ block.content.text }}"
                </p>
                <footer v-if="block.content.author" class="mt-3 text-sm text-gray-500 font-medium">
                    — {{ block.content.author }}
                </footer>
            </blockquote>
        </div>
    </div>
</template>
