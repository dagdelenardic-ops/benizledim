<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    item: { type: Object, required: true },
});

const labels = {
    post_published: 'yeni yazı yayınladı',
    watch_log_created: 'izleme notu ekledi',
    followed_user: 'bir yazarı takip etti',
    commented: 'yorum yaptı',
    entry_created: 'entry yazdı',
    mentioned: 'birinden bahsetti',
};
</script>

<template>
    <article class="border-b-2 border-gray-100 py-4">
        <div class="flex gap-3">
            <img
                v-if="item.actor?.avatar"
                :src="item.actor.avatar"
                :alt="item.actor.name"
                class="h-10 w-10 rounded-full object-cover"
            >
            <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">
                {{ item.actor?.name?.charAt(0) || 'B' }}
            </div>

            <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-700">
                    <Link v-if="item.actor" :href="`/profile/${item.actor.id}`" class="font-black text-[var(--bi-ink)] hover:text-red-700">
                        {{ item.actor.name }}
                    </Link>
                    <span v-else class="font-black">Ben/İzledim</span>
                    {{ labels[item.type] || item.type }}
                </p>

                <Link
                    v-if="item.post"
                    :href="`/yazi/${item.post.slug}`"
                    class="mt-2 flex gap-3 rounded-md border border-gray-200 p-2 transition hover:border-red-200"
                >
                    <img v-if="item.post.cover_image" :src="item.post.cover_image" :alt="item.post.title" class="h-14 w-10 rounded object-cover">
                    <div class="min-w-0">
                        <p class="truncate text-sm font-black text-[var(--bi-ink)]">{{ item.post.title }}</p>
                        <p class="mt-1 text-xs uppercase tracking-wide text-red-700">{{ item.post.format || 'post' }}</p>
                    </div>
                </Link>
            </div>
        </div>
    </article>
</template>
