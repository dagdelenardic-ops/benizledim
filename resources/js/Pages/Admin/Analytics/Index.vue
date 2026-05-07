<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import Icon from '../../../Components/Admin/AdminIcon.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    range: { type: String, required: true },
    summary: { type: Object, required: true },
    timeseries: { type: Array, required: true },
    topPages: { type: Array, required: true },
    topReferers: { type: Array, required: true },
    devices: { type: Object, required: true },
    authors: { type: Array, required: true },
    realtime: { type: Object, required: true },
});

const { timeAgo } = useDate();

const activeTab = ref('overview');
const tabs = [
    { key: 'overview', label: 'Genel Bakış' },
    { key: 'pages', label: 'Sayfalar' },
    { key: 'authors', label: 'Yazarlar' },
    { key: 'realtime', label: 'Anlık' },
];

const ranges = [
    { key: 'today', label: 'Bugün' },
    { key: 'yesterday', label: 'Dün' },
    { key: '7d', label: 'Son 7 gün' },
    { key: '30d', label: 'Son 30 gün' },
    { key: '90d', label: 'Son 90 gün' },
];

const setRange = (key) => {
    router.get('/admin/analytics', { range: key }, { preserveScroll: true, preserveState: false });
};

const formatDuration = (seconds) => {
    if (!seconds || seconds < 1) return '–';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}d ${s}s` : `${m}d`;
};

const totalDeviceVisitors = computed(() =>
    Object.values(props.devices).reduce((a, b) => a + b, 0)
);

const realtimeState = ref({ ...props.realtime });
let realtimeTimer = null;

const fetchRealtime = async () => {
    try {
        const res = await fetch('/admin/analytics/realtime', { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
        if (res.ok) realtimeState.value = await res.json();
    } catch (e) { /* swallow */ }
};

onMounted(() => {
    realtimeTimer = setInterval(() => {
        if (activeTab.value === 'realtime' || activeTab.value === 'overview') fetchRealtime();
    }, 15000);
});
onBeforeUnmount(() => {
    if (realtimeTimer) clearInterval(realtimeTimer);
});

// Sparkline / line chart paths
const chartGeometry = computed(() => {
    const points = props.timeseries;
    const w = 800;
    const h = 220;
    const pad = 24;
    if (points.length === 0) return { w, h, pvPath: '', uvPath: '', xLabels: [] };
    const maxPv = Math.max(1, ...points.map((p) => p.total_pageviews));
    const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
    const yScale = (v) => h - pad - (v / maxPv) * (h - pad * 2);
    const toPath = (key) => points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * stepX} ${yScale(p[key])}`)
        .join(' ');
    const xLabels = points.map((p, i) => ({
        x: pad + i * stepX,
        label: p.date.slice(5),
        show: points.length <= 14 || i % Math.ceil(points.length / 8) === 0,
    }));
    return { w, h, pvPath: toPath('total_pageviews'), uvPath: toPath('unique_visitors'), xLabels, maxPv };
});

const deviceTotal = computed(() => Math.max(1, totalDeviceVisitors.value));

const roleLabel = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'editor') return 'Editör';
    return 'Yazar';
};
</script>

<template>
    <AdminLayout title="Analitik">
        <div class="space-y-6">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span class="bi-kicker">Analitik</span>
                        <h2 class="mt-3 text-3xl font-black leading-tight md:text-4xl">Site Trafiği & Yazar Aktivitesi</h2>
                        <p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base">
                            Günlük ziyaretçi, popüler sayfalar, yazarların online durumu ve son giriş zamanları.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="r in ranges"
                            :key="r.key"
                            @click="setRange(r.key)"
                            :class="[
                                'border-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition',
                                range === r.key
                                    ? 'border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]'
                                    : 'border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]',
                            ]"
                        >
                            {{ r.label }}
                        </button>
                    </div>
                </div>
            </section>

            <section class="flex flex-wrap gap-2 border-b-2 border-[var(--bi-ink)] pb-2">
                <button
                    v-for="t in tabs"
                    :key="t.key"
                    @click="activeTab = t.key"
                    :class="[
                        'border-2 px-4 py-2 text-sm font-bold transition',
                        activeTab === t.key
                            ? 'border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]'
                            : 'border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]',
                    ]"
                >
                    {{ t.label }}
                </button>
            </section>

            <section v-show="activeTab === 'overview'" class="space-y-6">
                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Tekil Ziyaretçi</p>
                        <p class="mt-3 text-3xl font-black">{{ summary.unique_visitors.toLocaleString() }}</p>
                    </div>
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Toplam Görüntüleme</p>
                        <p class="mt-3 text-3xl font-black">{{ summary.total_pageviews.toLocaleString() }}</p>
                    </div>
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Ort. Oturum Süresi</p>
                        <p class="mt-3 text-3xl font-black">{{ formatDuration(summary.avg_session_duration_seconds) }}</p>
                    </div>
                    <div class="border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800">Anlık Çevrimiçi</p>
                        <p class="mt-3 text-3xl font-black text-emerald-800">{{ realtimeState.active_visitors }}</p>
                        <p class="mt-1 text-xs text-[var(--bi-muted)]">son {{ realtimeState.window_minutes }} dk</p>
                    </div>
                </div>

                <div class="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-black">Günlük Trafik</h3>
                            <div class="flex items-center gap-3 text-xs">
                                <span class="flex items-center gap-1"><span class="inline-block h-2 w-3 bg-red-700"></span> Görüntüleme</span>
                                <span class="flex items-center gap-1"><span class="inline-block h-2 w-3 bg-[var(--bi-ink)]"></span> Tekil</span>
                            </div>
                        </div>
                        <svg :viewBox="`0 0 ${chartGeometry.w} ${chartGeometry.h}`" class="mt-4 w-full" preserveAspectRatio="none" style="height: 220px;">
                            <path :d="chartGeometry.pvPath" fill="none" stroke="#b91c1c" stroke-width="2" />
                            <path :d="chartGeometry.uvPath" fill="none" stroke="#0f0f0f" stroke-width="2" stroke-dasharray="4 3" />
                            <g v-for="(lbl, i) in chartGeometry.xLabels" :key="i">
                                <text v-if="lbl.show" :x="lbl.x" :y="chartGeometry.h - 4" font-size="10" text-anchor="middle" fill="#666">{{ lbl.label }}</text>
                            </g>
                        </svg>
                    </div>

                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5">
                        <h3 class="text-lg font-black">Cihaz Dağılımı</h3>
                        <div class="mt-4 space-y-3">
                            <div v-for="(count, key) in devices" :key="key">
                                <div class="flex items-center justify-between text-sm font-bold">
                                    <span class="capitalize">{{ key }}</span>
                                    <span>{{ count }}</span>
                                </div>
                                <div class="mt-1 h-2 w-full border border-[var(--bi-ink)] bg-[var(--bi-paper)]">
                                    <div class="h-full bg-red-700" :style="{ width: ((count / deviceTotal) * 100) + '%' }"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 border-t-2 border-[var(--bi-ink)] pt-4">
                            <h4 class="text-sm font-black">Trafik Kaynakları</h4>
                            <ul class="mt-2 space-y-1 text-sm">
                                <li v-for="r in topReferers" :key="r.referer" class="flex items-center justify-between">
                                    <span class="truncate">{{ r.referer }}</span>
                                    <span class="font-bold">{{ r.views }}</span>
                                </li>
                                <li v-if="topReferers.length === 0" class="text-[var(--bi-muted)]">Veri yok</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section v-show="activeTab === 'pages'" class="border-2 border-[var(--bi-ink)] bg-white">
                <div class="border-b-2 border-[var(--bi-ink)] px-5 py-4">
                    <h3 class="text-lg font-black">En Çok Okunan Sayfalar</h3>
                </div>
                <table class="w-full text-left text-sm">
                    <thead class="bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]">
                        <tr>
                            <th class="px-5 py-3 font-black">Yol</th>
                            <th class="px-5 py-3 font-black text-right">Görüntüleme</th>
                            <th class="px-5 py-3 font-black text-right">Tekil</th>
                            <th class="px-5 py-3 font-black text-right">Ort. Süre</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--bi-rule-soft)]">
                        <tr v-for="row in topPages" :key="row.path">
                            <td class="px-5 py-3 truncate max-w-md">
                                <a :href="row.path" target="_blank" class="hover:text-red-700">{{ row.path }}</a>
                            </td>
                            <td class="px-5 py-3 text-right font-bold">{{ row.views.toLocaleString() }}</td>
                            <td class="px-5 py-3 text-right">{{ row.visitors.toLocaleString() }}</td>
                            <td class="px-5 py-3 text-right">{{ formatDuration(row.avg_seconds) }}</td>
                        </tr>
                        <tr v-if="topPages.length === 0">
                            <td colspan="4" class="px-5 py-10 text-center text-[var(--bi-muted)]">Bu aralıkta veri yok.</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section v-show="activeTab === 'authors'" class="border-2 border-[var(--bi-ink)] bg-white">
                <div class="border-b-2 border-[var(--bi-ink)] px-5 py-4">
                    <h3 class="text-lg font-black">Yazar Aktivitesi</h3>
                    <p class="mt-1 text-xs text-[var(--bi-muted)]">Yeşil nokta = son 5 dakika içinde aktif</p>
                </div>
                <table class="w-full text-left text-sm">
                    <thead class="bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]">
                        <tr>
                            <th class="px-5 py-3 font-black">Yazar</th>
                            <th class="px-5 py-3 font-black">Rol</th>
                            <th class="px-5 py-3 font-black">Son Aktivite</th>
                            <th class="px-5 py-3 font-black">Son Giriş</th>
                            <th class="px-5 py-3 font-black text-right">Yazı</th>
                            <th class="px-5 py-3 font-black text-right">7g Okunma</th>
                            <th class="px-5 py-3 font-black text-right">Toplam Okunma</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--bi-rule-soft)]">
                        <tr v-for="a in authors" :key="a.id">
                            <td class="px-5 py-3">
                                <div class="flex items-center gap-3">
                                    <span :class="['inline-block h-2 w-2 rounded-full', a.is_online ? 'bg-emerald-600' : 'bg-gray-400']"></span>
                                    <img v-if="a.avatar" :src="a.avatar" class="h-7 w-7 rounded-full object-cover" alt="" />
                                    <span class="font-bold">{{ a.name }}</span>
                                </div>
                            </td>
                            <td class="px-5 py-3">{{ roleLabel(a.role) }}</td>
                            <td class="px-5 py-3">{{ a.last_seen_at ? timeAgo(a.last_seen_at) : '–' }}</td>
                            <td class="px-5 py-3">{{ a.last_login_at ? timeAgo(a.last_login_at) : '–' }}</td>
                            <td class="px-5 py-3 text-right font-bold">{{ a.posts_count }}</td>
                            <td class="px-5 py-3 text-right">{{ a.post_views_7d.toLocaleString() }}</td>
                            <td class="px-5 py-3 text-right">{{ a.total_post_views.toLocaleString() }}</td>
                        </tr>
                        <tr v-if="authors.length === 0">
                            <td colspan="7" class="px-5 py-10 text-center text-[var(--bi-muted)]">Yazar bulunamadı.</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section v-show="activeTab === 'realtime'" class="space-y-6">
                <div class="grid gap-4 sm:grid-cols-3">
                    <div class="border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800">Aktif Ziyaretçi</p>
                        <p class="mt-3 text-3xl font-black text-emerald-800">{{ realtimeState.active_visitors }}</p>
                        <p class="mt-1 text-xs text-[var(--bi-muted)]">son {{ realtimeState.window_minutes }} dk</p>
                    </div>
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Online Yazar</p>
                        <p class="mt-3 text-3xl font-black">{{ realtimeState.online_authors.length }}</p>
                    </div>
                    <div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]">
                        <p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Otomatik Yenileme</p>
                        <p class="mt-3 text-3xl font-black">15s</p>
                    </div>
                </div>

                <div class="grid gap-6 xl:grid-cols-2">
                    <div class="border-2 border-[var(--bi-ink)] bg-white">
                        <div class="border-b-2 border-[var(--bi-ink)] px-5 py-4">
                            <h3 class="text-lg font-black">Şu Anda Görüntülenen Sayfalar</h3>
                        </div>
                        <ul class="divide-y divide-[var(--bi-rule-soft)]">
                            <li v-for="p in realtimeState.active_pages" :key="p.path" class="flex items-center justify-between gap-3 px-5 py-3">
                                <a :href="p.path" target="_blank" class="truncate text-sm hover:text-red-700">{{ p.path }}</a>
                                <span class="border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">{{ p.visitors }}</span>
                            </li>
                            <li v-if="realtimeState.active_pages.length === 0" class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]">
                                Şu an aktif ziyaretçi yok.
                            </li>
                        </ul>
                    </div>

                    <div class="border-2 border-[var(--bi-ink)] bg-white">
                        <div class="border-b-2 border-[var(--bi-ink)] px-5 py-4">
                            <h3 class="text-lg font-black">Online Yazarlar</h3>
                        </div>
                        <ul class="divide-y divide-[var(--bi-rule-soft)]">
                            <li v-for="u in realtimeState.online_authors" :key="u.id" class="flex items-center gap-3 px-5 py-3">
                                <span class="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
                                <img v-if="u.avatar" :src="u.avatar" class="h-7 w-7 rounded-full object-cover" alt="" />
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-bold">{{ u.name }}</p>
                                    <p class="truncate text-xs text-[var(--bi-muted)]">{{ roleLabel(u.role) }} · {{ u.last_seen_at ? timeAgo(u.last_seen_at) : '' }}</p>
                                </div>
                            </li>
                            <li v-if="realtimeState.online_authors.length === 0" class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]">
                                Şu an online yazar yok.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </AdminLayout>
</template>
