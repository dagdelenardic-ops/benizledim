<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { useDate } from '@/Composables/useDate';
import { buildResponsiveImage } from '@/Utils/responsiveImage';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const { timeAgo } = useDate();

const coverImage = computed(() => buildResponsiveImage(props.post.cover_image, {
    widths: [480, 768, 960],
    sizes: '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
    fallbackWidth: 768,
}));

const formatReadingTime = (minutes) => {
    if (!minutes) return '2 dk';
    return `${minutes} dk`;
};
</script>

<template>
    <Link :href="`/yazi/${post.slug}`" class="bi-post-card group">
        <div class="bi-post-card__image">
            <img
                v-if="post.cover_image"
                :src="coverImage.src"
                :srcset="coverImage.srcset || undefined"
                :sizes="coverImage.sizes || undefined"
                :alt="post.title"
                loading="lazy"
                decoding="async"
                width="800"
                height="500"
            />
            <div v-else class="bi-post-card__fallback">
                Bİ
            </div>

            <div class="absolute top-3 left-3 flex flex-wrap gap-2">
                <span
                    v-for="category in post.categories?.slice(0, 1)"
                    :key="category.id"
                    class="bi-post-card__category"
                >
                    {{ category.name }}
                </span>
            </div>
        </div>

        <div class="bi-post-card__body">
            <h3 class="bi-post-card__title line-clamp-2 group-hover:text-red-700 transition-colors">
                {{ post.title }}
            </h3>
            <p class="text-sm leading-6 text-[var(--bi-muted)] line-clamp-3">
                {{ post.excerpt }}
            </p>

            <div class="bi-post-card__meta flex flex-wrap items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2">
                    <img
                        v-if="post.user?.avatar"
                        :src="post.user.avatar"
                        :alt="post.user.name"
                        class="h-7 w-7 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    <div
                        v-else
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white"
                    >
                        {{ post.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <span class="truncate font-semibold text-[var(--bi-ink)]">{{ post.user?.name }}</span>
                </div>
                <span>{{ timeAgo(post.published_at) }} · {{ formatReadingTime(post.reading_time_minutes) }}</span>
            </div>
        </div>
    </Link>
</template>
