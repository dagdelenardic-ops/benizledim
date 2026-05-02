<script setup>
import { ref, watch } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import Icon from '../../../Components/Admin/AdminIcon.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    posts: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
    permissions: {
        type: Object,
        default: () => ({
            canApproveDeletion: false,
            canManageAllPosts: false,
        }),
    },
    owners: {
        type: Array,
        default: () => [],
    },
});

const { timeAgo } = useDate();
const page = usePage();
const search = ref(props.filters.search || '');
const status = ref(props.filters.status || '');
const owner = ref(props.filters.owner || '');

let searchTimeout;
watch([search, status, owner], () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/posts', {
            search: search.value,
            status: status.value,
            owner: owner.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
});

const getStatusLabel = (postStatus) => {
    if (postStatus === 'pending_deletion') return 'Silme Talebi';
    if (postStatus === 'pending_review') return 'İncelemede';
    return postStatus === 'published' ? 'Yayında' : 'Taslak';
};

const getStatusBadge = (postStatus) => {
    if (postStatus === 'pending_deletion') return 'border-red-700 bg-red-50 text-red-800';
    if (postStatus === 'pending_review') return 'border-amber-700 bg-amber-50 text-amber-800';
    if (postStatus === 'published') return 'border-emerald-700 bg-emerald-50 text-emerald-800';
    return 'border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]';
};

const deletePost = (post) => {
    const role = page.props.auth?.user?.role;
    const isAdmin = role === 'admin';

    const confirmText = isAdmin
        ? `"${post.title}" yazısını kalıcı olarak silmek istediğinize emin misiniz?`
        : `"${post.title}" yazısını yayından kaldırıp admin onayına göndermek istiyor musunuz?`;

    if (!confirm(confirmText)) return;

    router.delete(`/admin/posts/${post.id}`);
};

const approveDeletion = (post) => {
    if (!confirm(`"${post.title}" için silme talebini onaylayıp kalıcı silmek istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/approve-deletion`);
};

const rejectDeletion = (post) => {
    if (!confirm(`"${post.title}" için silme talebini reddedip tekrar yayına almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/reject-deletion`);
};

const approveReview = (post) => {
    if (!confirm(`"${post.title}" yazısını yayına almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/approve-review`);
};

const rejectReview = (post) => {
    if (!confirm(`"${post.title}" yazısını taslağa geri almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/reject-review`);
};

const updateOwner = (post, userId) => {
    router.put(`/admin/posts/${post.id}/owner`, {
        user_id: Number(userId),
    }, {
        preserveScroll: true,
    });
};

const resolveStatus = (post) => post.resolved_status || (post.is_deletion_pending ? 'pending_deletion' : post.status);
</script>

<template>
    <AdminLayout title="Yazılar">
        <div class="space-y-6">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span class="bi-kicker">İçerik</span>
                        <h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]">Yazılar</h1>
                        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]">
                            Taslak, inceleme ve yayın akışını buradan yönetin.
                        </p>
                    </div>
                    <Link
                        href="/admin/posts/create"
                        class="inline-flex items-center justify-center gap-2 bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                    >
                        <Icon name="posts" />
                        Yeni Yazı
                    </Link>
                </div>
            </section>

            <section class="grid gap-3 border-2 border-[var(--bi-ink)] bg-white p-4 lg:grid-cols-[1fr_180px_220px]">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Başlık veya özet ara"
                    class="min-w-0 border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                />
                <select
                    v-model="status"
                    class="border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                >
                    <option value="">Tüm Durumlar</option>
                    <option value="published">Yayında</option>
                    <option value="pending_review">İncelemede</option>
                    <option value="draft">Taslak</option>
                    <option value="pending_deletion">Silme Talebi</option>
                </select>
                <select
                    v-if="permissions.canManageAllPosts"
                    v-model="owner"
                    class="border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                >
                    <option value="">Tüm Yazarlar</option>
                    <option v-for="item in owners" :key="item.id" :value="item.id">{{ item.name }}</option>
                </select>
            </section>

            <section class="space-y-3">
                <article
                    v-for="post in posts.data"
                    :key="post.id"
                    class="border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[4px_4px_0_var(--bi-ink)]"
                >
                    <div class="grid gap-4 xl:grid-cols-[1fr_240px_230px] xl:items-start">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <span :class="['border px-2 py-1 text-xs font-bold', getStatusBadge(resolveStatus(post))]">
                                    {{ getStatusLabel(resolveStatus(post)) }}
                                </span>
                                <span class="text-xs font-bold text-[var(--bi-muted)]">{{ timeAgo(post.created_at) }}</span>
                                <span class="text-xs font-bold text-[var(--bi-muted)]">{{ post.view_count?.toLocaleString() }} görüntülenme</span>
                            </div>
                            <Link
                                :href="`/admin/posts/${post.id}/edit`"
                                class="mt-3 block text-xl font-black leading-tight text-[var(--bi-ink)] hover:text-red-700"
                            >
                                {{ post.title }}
                            </Link>
                            <p v-if="post.excerpt" class="mt-2 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]">{{ post.excerpt }}</p>
                            <div class="mt-3 space-y-1 text-xs text-[var(--bi-muted)]">
                                <p v-if="post.reviewed_by?.name">Son inceleyen: {{ post.reviewed_by.name }}</p>
                                <p v-if="resolveStatus(post) === 'pending_review' && post.pending_review_by?.name">
                                    İncelemeye gönderen: {{ post.pending_review_by.name }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p class="bi-mono mb-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Yazar</p>
                            <template v-if="permissions.canReassignPosts">
                                <select
                                    :value="post.user?.id"
                                    @change="updateOwner(post, $event.target.value)"
                                    class="w-full border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                                >
                                    <option v-for="item in owners" :key="item.id" :value="item.id">
                                        {{ item.name }}
                                    </option>
                                </select>
                                <p class="mt-1 truncate text-xs text-[var(--bi-muted)]">{{ post.user?.email }}</p>
                            </template>
                            <template v-else>
                                <p class="font-bold text-[var(--bi-ink)]">{{ post.user?.name }}</p>
                                <p class="truncate text-xs text-[var(--bi-muted)]">{{ post.user?.email }}</p>
                            </template>
                        </div>

                        <div class="flex flex-wrap gap-2 xl:justify-end">
                            <Link
                                :href="`/admin/posts/${post.id}/edit`"
                                class="border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold hover:bg-[var(--bi-paper)]"
                            >
                                Düzenle
                            </Link>
                            <template v-if="resolveStatus(post) === 'pending_review' && permissions.canReviewPosts">
                                <button
                                    @click="approveReview(post)"
                                    class="border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800"
                                >
                                    Yayına Al
                                </button>
                                <button
                                    @click="rejectReview(post)"
                                    class="border border-amber-700 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100"
                                >
                                    Taslağa Al
                                </button>
                            </template>
                            <template v-if="post.is_deletion_pending && permissions.canApproveDeletion">
                                <button
                                    @click="approveDeletion(post)"
                                    class="border border-red-700 bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"
                                >
                                    Kalıcı Sil
                                </button>
                                <button
                                    @click="rejectDeletion(post)"
                                    class="border border-emerald-700 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
                                >
                                    Yayına Al
                                </button>
                            </template>
                            <button
                                v-else
                                @click="deletePost(post)"
                                class="border border-red-700 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
                            >
                                {{ page.props.auth?.user?.role === 'admin' ? 'Sil' : 'Silme Talebi' }}
                            </button>
                        </div>
                    </div>
                </article>

                <div v-if="posts.data.length === 0" class="border-2 border-[var(--bi-ink)] bg-white px-5 py-12 text-center text-sm text-[var(--bi-muted)]">
                    Yazı bulunamadı.
                </div>
            </section>

            <nav v-if="posts.links" class="flex flex-wrap justify-center gap-2 border-2 border-[var(--bi-ink)] bg-white p-4">
                <Link
                    v-for="(link, index) in posts.links"
                    :key="index"
                    :href="link.url || '#'"
                    :class="[
                        'border px-3 py-2 text-sm font-bold',
                        link.active
                            ? 'border-red-700 bg-red-700 text-white'
                            : link.url
                                ? 'border-[var(--bi-ink)] text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]'
                                : 'border-[var(--bi-rule-soft)] text-[var(--bi-muted)]',
                    ]"
                    v-html="link.label"
                />
            </nav>
        </div>
    </AdminLayout>
</template>