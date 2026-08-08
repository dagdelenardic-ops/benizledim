<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import FollowButton from '../../Components/Social/FollowButton.vue';

const props = defineProps({
    authors: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
});

const page = usePage();
const authUser = computed(() => page.props.auth?.user);
const q = ref(props.filters.q || '');

function search() {
    router.get('/yazarlar', { q: q.value }, { preserveState: true, replace: true });
}
</script>

<template>
    <AppLayout>
        <section class="mx-auto max-w-6xl px-4 py-8">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-black text-[var(--bi-ink)]">Yazarlar</h1>
                <form class="flex gap-2" @submit.prevent="search">
                    <input v-model="q" type="search" placeholder="Yazar ara" class="h-10 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm">
                    <button class="h-10 rounded-md bg-red-600 px-4 text-sm font-black text-white">Ara</button>
                </form>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <article v-for="author in authors.data" :key="author.id" class="rounded-md border-2 border-[var(--bi-ink)] bg-white p-4">
                    <div class="flex gap-3">
                        <img v-if="author.avatar" :src="author.avatar" :alt="author.name" class="h-12 w-12 rounded-full object-cover">
                        <div v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-black text-red-700">
                            {{ author.name.charAt(0) }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <Link :href="`/profile/${author.id}`" class="truncate text-lg font-black text-[var(--bi-ink)] hover:text-red-700">
                                {{ author.name }}
                            </Link>
                            <p class="mt-1 line-clamp-2 text-sm text-gray-600">{{ author.bio || 'Film, dizi ve izleme notları.' }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between gap-3">
                        <p class="text-xs font-bold uppercase text-gray-500">{{ author.posts_count }} yazı</p>
                        <FollowButton
                            v-if="authUser && authUser.id !== author.id"
                            :user="author"
                            :initial-following="author.is_following"
                            :initial-followers-count="author.followers_count"
                        />
                        <span v-else class="text-xs font-bold text-gray-500">{{ author.followers_count }} takipçi</span>
                    </div>
                </article>
            </div>
        </section>
    </AppLayout>
</template>
