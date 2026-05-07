<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AdminLayout from '../../Components/Admin/AdminLayout.vue';
import Icon from '../../Components/Admin/AdminIcon.vue';
import PageviewChart from '../../Components/Admin/PageviewChart.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
    recentPosts: {
        type: Array,
        required: true,
    },
    recentComments: {
        type: Array,
        required: true,
    },
    authorBreakdown: {
        type: Array,
        default: () => [],
    },
    analytics: {
        type: Object,
        default: null,
    },
    pageviewSeries: {
        type: Array,
        default: () => [],
    },
});

const { timeAgo } = useDate();
const page = usePage();
const authUser = computed(() => page.props.auth?.user || {});
const canManageAll = computed(() => ['admin', 'editor'].includes(authUser.value.role || ''));
const heading = computed(() => (canManageAll.value ? 'Yönetim Özeti' : 'Yazı Masam'));
const intro = computed(() => (
    canManageAll.value
        ? 'Onay bekleyen içerikleri, son hareketleri ve yazar dağılımını tek ekranda takip edin.'
        : 'Taslaklarını, incelemeye giden yazılarını ve yayındaki içeriklerini hızlıca gör.'
));

const statCards = computed(() => {
    const managerCards = [
        { key: 'pending_review_posts', label: 'İncelemede', icon: 'posts', tone: 'red' },
        { key: 'pending_deletion_posts', label: 'Silme Talebi', icon: 'alert', tone: 'black' },
        { key: 'published_posts', label: 'Yayında', icon: 'check', tone: 'green' },
        { key: 'total_posts', label: 'Toplam Yazı', icon: 'dashboard', tone: 'neutral' },
        { key: 'total_comments', label: 'Yorum', icon: 'comments', tone: 'neutral' },
        { key: 'total_users', label: 'Kullanıcı', icon: 'users', tone: 'neutral' },
    ];

    const authorCards = [
        { key: 'draft_posts', label: 'Taslaklarım', icon: 'page', tone: 'neutral' },
        { key: 'pending_review_posts', label: 'İncelemede', icon: 'posts', tone: 'red' },
        { key: 'published_posts', label: 'Yayında', icon: 'check', tone: 'green' },
        { key: 'total_comments', label: 'Yorum', icon: 'comments', tone: 'neutral' },
    ];

    return (canManageAll.value ? managerCards : authorCards)
        .filter((card) => props.stats[card.key] !== null && props.stats[card.key] !== undefined);
});

const getStatusBadge = (status) => {
    if (status === 'pending_deletion') return 'border-red-700 bg-red-50 text-red-800';
    if (status === 'pending_review') return 'border-amber-700 bg-amber-50 text-amber-800';
    if (status === 'published') return 'border-emerald-700 bg-emerald-50 text-emerald-800';
    return 'border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]';
};

const getStatusLabel = (status) => {
    if (status === 'pending_deletion') return 'Silme Talebi';
    if (status === 'pending_review') return 'İncelemede';
    return status === 'published' ? 'Yayında' : 'Taslak';
};

const resolveStatus = (post) => (post.deletion_requested_at ? 'pending_deletion' : post.status);
</script>

<template>
    <AdminLayout title="Genel Bakış">
        <div class="space-y-8">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6">
                <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span class="bi-kicker">{{ canManageAll ? 'Panel' : 'Yazar' }}</span>
                        <h2 class="mt-3 text-3xl font-black leading-tight text-[var(--bi-ink)] md:text-4xl">{{ heading }}</h2>
                        <p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base">{{ intro }}</p>
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

            <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div
                    v-for="card in statCards"
                    :key="card.key"
                    class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">{{ card.label }}</p>
                            <p class="mt-3 text-3xl font-black text-[var(--bi-ink)]">{{ stats[card.key]?.toLocaleString() }}</p>
                        </div>
                        <div
                            :class="[
                                'grid h-10 w-10 place-items-center border-2',
                                card.tone === 'red'
                                    ? 'border-red-700 bg-red-700 text-white'
                                    : card.tone === 'green'
                                        ? 'border-emerald-700 bg-emerald-700 text-white'
                                        : 'border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]',
                            ]"
                        >
                            <Icon :name="card.icon" />
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="pageviewSeries.length" class="border-2 border-[var(--bi-ink)] bg-white">
                <div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4">
                    <h2 class="text-lg font-black text-[var(--bi-ink)]">Son 7 Gün</h2>
                    <Link href="/admin/analytics" class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900">
                        Detaylı Analitik
                    </Link>
                </div>
                <div class="px-5 py-5">
                    <PageviewChart :series="pageviewSeries" />
                </div>
            </section>

            <section v-if="analytics" class="border-2 border-[var(--bi-ink)] bg-white">
                <div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4">
                    <h2 class="text-lg font-black text-[var(--bi-ink)]">Bugün Sitede</h2>
                    <Link href="/admin/analytics" class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900">
                        Tüm Analitik
                    </Link>
                </div>
                <div class="grid gap-px bg-[var(--bi-rule-soft)] sm:grid-cols-4">
                    <div class="bg-white px-5 py-4">
                        <p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Bugünkü Tekil Ziyaretçi</p>
                        <p class="mt-2 text-2xl font-black text-[var(--bi-ink)]">{{ analytics.today_unique_visitors.toLocaleString() }}</p>
                    </div>
                    <div class="bg-white px-5 py-4">
                        <p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Bugünkü Görüntüleme</p>
                        <p class="mt-2 text-2xl font-black text-[var(--bi-ink)]">{{ analytics.today_pageviews.toLocaleString() }}</p>
                    </div>
                    <div class="bg-white px-5 py-4">
                        <p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-emerald-800">Anlık Çevrimiçi</p>
                        <p class="mt-2 text-2xl font-black text-emerald-800">{{ analytics.active_visitors }}</p>
                    </div>
                    <div class="bg-white px-5 py-4">
                        <p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Online Yazar</p>
                        <p class="mt-2 text-2xl font-black text-[var(--bi-ink)]">{{ analytics.online_authors }}</p>
                    </div>
                </div>
            </section>

            <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div class="border-2 border-[var(--bi-ink)] bg-white">
                    <div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4">
                        <h2 class="text-lg font-black text-[var(--bi-ink)]">Son Yazılar</h2>
                        <Link href="/admin/posts" class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900">
                            Tümünü Gör
                        </Link>
                    </div>
                    <div class="divide-y divide-[var(--bi-rule-soft)]">
                        <div
                            v-for="post in recentPosts"
                            :key="post.id"
                            class="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center"
                        >
                            <div class="min-w-0">
                                <Link
                                    :href="`/admin/posts/${post.id}/edit`"
                                    class="block truncate text-base font-black text-[var(--bi-ink)] hover:text-red-700"
                                >
                                    {{ post.title }}
                                </Link>
                                <p class="mt-1 text-sm text-[var(--bi-muted)]">
                                    {{ post.user?.name }} · {{ timeAgo(post.created_at) }}
                                </p>
                            </div>
                            <span :class="['w-fit border px-2 py-1 text-xs font-bold', getStatusBadge(resolveStatus(post))]">
                                {{ getStatusLabel(resolveStatus(post)) }}
                            </span>
                        </div>
                        <div v-if="recentPosts.length === 0" class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]">
                            Henüz yazı yok.
                        </div>
                    </div>
                </div>

                <div class="border-2 border-[var(--bi-ink)] bg-white">
                    <div class="border-b-2 border-[var(--bi-ink)] px-5 py-4">
                        <h2 class="text-lg font-black text-[var(--bi-ink)]">Son Yorumlar</h2>
                    </div>
                    <div class="divide-y divide-[var(--bi-rule-soft)]">
                        <div
                            v-for="comment in recentComments"
                            :key="comment.id"
                            class="px-5 py-4"
                        >
                            <p class="text-sm font-bold text-[var(--bi-ink)]">{{ comment.user?.name }}</p>
                            <p class="mt-1 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]">{{ comment.content }}</p>
                            <Link
                                :href="`/yazi/${comment.post?.slug}`"
                                class="mt-2 block truncate text-xs font-bold text-red-700 hover:text-red-900"
                            >
                                {{ comment.post?.title }}
                            </Link>
                        </div>
                        <div v-if="recentComments.length === 0" class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]">
                            Henüz yorum yok.
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="authorBreakdown.length" class="border-2 border-[var(--bi-ink)] bg-white">
                <div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4">
                    <h2 class="text-lg font-black text-[var(--bi-ink)]">Yazı Sahipliği</h2>
                    <Link href="/admin/posts" class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900">
                        Yönet
                    </Link>
                </div>
                <div class="divide-y divide-[var(--bi-rule-soft)]">
                    <div
                        v-for="author in authorBreakdown"
                        :key="author.id"
                        class="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                        <div class="min-w-0">
                            <p class="truncate font-bold text-[var(--bi-ink)]">{{ author.name }}</p>
                            <p class="truncate text-sm text-[var(--bi-muted)]">{{ author.email }} · {{ author.role }}</p>
                        </div>
                        <span class="text-sm font-black text-[var(--bi-ink)]">{{ author.posts_count }} yazı</span>
                    </div>
                </div>
            </section>
        </div>
    </AdminLayout>
</template>