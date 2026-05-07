import { ref, computed, onMounted, onBeforeUnmount, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, withDirectives, createTextVNode, createCommentVNode, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    range: { type: String, required: true },
    summary: { type: Object, required: true },
    timeseries: { type: Array, required: true },
    topPages: { type: Array, required: true },
    topReferers: { type: Array, required: true },
    devices: { type: Object, required: true },
    authors: { type: Array, required: true },
    realtime: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const { timeAgo } = useDate();
    const activeTab = ref("overview");
    const tabs = [
      { key: "overview", label: "Genel Bakış" },
      { key: "pages", label: "Sayfalar" },
      { key: "authors", label: "Yazarlar" },
      { key: "realtime", label: "Anlık" }
    ];
    const ranges = [
      { key: "today", label: "Bugün" },
      { key: "yesterday", label: "Dün" },
      { key: "7d", label: "Son 7 gün" },
      { key: "30d", label: "Son 30 gün" },
      { key: "90d", label: "Son 90 gün" }
    ];
    const setRange = (key) => {
      router.get("/admin/analytics", { range: key }, { preserveScroll: true, preserveState: false });
    };
    const formatDuration = (seconds) => {
      if (!seconds || seconds < 1) return "–";
      if (seconds < 60) return `${seconds}s`;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return s > 0 ? `${m}d ${s}s` : `${m}d`;
    };
    const totalDeviceVisitors = computed(
      () => Object.values(props.devices).reduce((a, b) => a + b, 0)
    );
    const realtimeState = ref({ ...props.realtime });
    let realtimeTimer = null;
    const fetchRealtime = async () => {
      try {
        const res = await fetch("/admin/analytics/realtime", { headers: { Accept: "application/json" }, credentials: "same-origin" });
        if (res.ok) realtimeState.value = await res.json();
      } catch (e) {
      }
    };
    onMounted(() => {
      realtimeTimer = setInterval(() => {
        if (activeTab.value === "realtime" || activeTab.value === "overview") fetchRealtime();
      }, 15e3);
    });
    onBeforeUnmount(() => {
      if (realtimeTimer) clearInterval(realtimeTimer);
    });
    const chartGeometry = computed(() => {
      const points = props.timeseries;
      const w = 800;
      const h = 220;
      const pad = 24;
      if (points.length === 0) return { w, h, pvPath: "", uvPath: "", xLabels: [] };
      const maxPv = Math.max(1, ...points.map((p) => p.total_pageviews));
      const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
      const yScale = (v) => h - pad - v / maxPv * (h - pad * 2);
      const toPath = (key) => points.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${yScale(p[key])}`).join(" ");
      const xLabels = points.map((p, i) => ({
        x: pad + i * stepX,
        label: p.date.slice(5),
        show: points.length <= 14 || i % Math.ceil(points.length / 8) === 0
      }));
      return { w, h, pvPath: toPath("total_pageviews"), uvPath: toPath("unique_visitors"), xLabels, maxPv };
    });
    const deviceTotal = computed(() => Math.max(1, totalDeviceVisitors.value));
    const roleLabel = (role) => {
      if (role === "admin") return "Admin";
      if (role === "editor") return "Editör";
      return "Yazar";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Analitik" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6"${_scopeId}><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"${_scopeId}><div${_scopeId}><span class="bi-kicker"${_scopeId}>Analitik</span><h2 class="mt-3 text-3xl font-black leading-tight md:text-4xl"${_scopeId}>Site Trafiği &amp; Yazar Aktivitesi</h2><p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base"${_scopeId}> Günlük ziyaretçi, popüler sayfalar, yazarların online durumu ve son giriş zamanları. </p></div><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(ranges, (r) => {
              _push2(`<button class="${ssrRenderClass([
                "border-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                __props.range === r.key ? "border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]"
              ])}"${_scopeId}>${ssrInterpolate(r.label)}</button>`);
            });
            _push2(`<!--]--></div></div></section><section class="flex flex-wrap gap-2 border-b-2 border-[var(--bi-ink)] pb-2"${_scopeId}><!--[-->`);
            ssrRenderList(tabs, (t) => {
              _push2(`<button class="${ssrRenderClass([
                "border-2 px-4 py-2 text-sm font-bold transition",
                activeTab.value === t.key ? "border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]"
              ])}"${_scopeId}>${ssrInterpolate(t.label)}</button>`);
            });
            _push2(`<!--]--></section><section class="space-y-6" style="${ssrRenderStyle(activeTab.value === "overview" ? null : { display: "none" })}"${_scopeId}><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"${_scopeId}><div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Tekil Ziyaretçi</p><p class="mt-3 text-3xl font-black"${_scopeId}>${ssrInterpolate(__props.summary.unique_visitors.toLocaleString())}</p></div><div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Toplam Görüntüleme</p><p class="mt-3 text-3xl font-black"${_scopeId}>${ssrInterpolate(__props.summary.total_pageviews.toLocaleString())}</p></div><div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Ort. Oturum Süresi</p><p class="mt-3 text-3xl font-black"${_scopeId}>${ssrInterpolate(formatDuration(__props.summary.avg_session_duration_seconds))}</p></div><div class="border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800"${_scopeId}>Anlık Çevrimiçi</p><p class="mt-3 text-3xl font-black text-emerald-800"${_scopeId}>${ssrInterpolate(realtimeState.value.active_visitors)}</p><p class="mt-1 text-xs text-[var(--bi-muted)]"${_scopeId}>son ${ssrInterpolate(realtimeState.value.window_minutes)} dk</p></div></div><div class="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]"${_scopeId}><div class="border-2 border-[var(--bi-ink)] bg-white p-5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>Günlük Trafik</h3><div class="flex items-center gap-3 text-xs"${_scopeId}><span class="flex items-center gap-1"${_scopeId}><span class="inline-block h-2 w-3 bg-red-700"${_scopeId}></span> Görüntüleme</span><span class="flex items-center gap-1"${_scopeId}><span class="inline-block h-2 w-3 bg-[var(--bi-ink)]"${_scopeId}></span> Tekil</span></div></div><svg${ssrRenderAttr("viewBox", `0 0 ${chartGeometry.value.w} ${chartGeometry.value.h}`)} class="mt-4 w-full" preserveAspectRatio="none" style="${ssrRenderStyle({ "height": "220px" })}"${_scopeId}><path${ssrRenderAttr("d", chartGeometry.value.pvPath)} fill="none" stroke="#b91c1c" stroke-width="2"${_scopeId}></path><path${ssrRenderAttr("d", chartGeometry.value.uvPath)} fill="none" stroke="#0f0f0f" stroke-width="2" stroke-dasharray="4 3"${_scopeId}></path><!--[-->`);
            ssrRenderList(chartGeometry.value.xLabels, (lbl, i) => {
              _push2(`<g${_scopeId}>`);
              if (lbl.show) {
                _push2(`<text${ssrRenderAttr("x", lbl.x)}${ssrRenderAttr("y", chartGeometry.value.h - 4)} font-size="10" text-anchor="middle" fill="#666"${_scopeId}>${ssrInterpolate(lbl.label)}</text>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</g>`);
            });
            _push2(`<!--]--></svg></div><div class="border-2 border-[var(--bi-ink)] bg-white p-5"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>Cihaz Dağılımı</h3><div class="mt-4 space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.devices, (count, key) => {
              _push2(`<div${_scopeId}><div class="flex items-center justify-between text-sm font-bold"${_scopeId}><span class="capitalize"${_scopeId}>${ssrInterpolate(key)}</span><span${_scopeId}>${ssrInterpolate(count)}</span></div><div class="mt-1 h-2 w-full border border-[var(--bi-ink)] bg-[var(--bi-paper)]"${_scopeId}><div class="h-full bg-red-700" style="${ssrRenderStyle({ width: count / deviceTotal.value * 100 + "%" })}"${_scopeId}></div></div></div>`);
            });
            _push2(`<!--]--></div><div class="mt-6 border-t-2 border-[var(--bi-ink)] pt-4"${_scopeId}><h4 class="text-sm font-black"${_scopeId}>Trafik Kaynakları</h4><ul class="mt-2 space-y-1 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(__props.topReferers, (r) => {
              _push2(`<li class="flex items-center justify-between"${_scopeId}><span class="truncate"${_scopeId}>${ssrInterpolate(r.referer)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate(r.views)}</span></li>`);
            });
            _push2(`<!--]-->`);
            if (__props.topReferers.length === 0) {
              _push2(`<li class="text-[var(--bi-muted)]"${_scopeId}>Veri yok</li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul></div></div></div></section><section class="border-2 border-[var(--bi-ink)] bg-white" style="${ssrRenderStyle(activeTab.value === "pages" ? null : { display: "none" })}"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>En Çok Okunan Sayfalar</h3></div><table class="w-full text-left text-sm"${_scopeId}><thead class="bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]"${_scopeId}><tr${_scopeId}><th class="px-5 py-3 font-black"${_scopeId}>Yol</th><th class="px-5 py-3 font-black text-right"${_scopeId}>Görüntüleme</th><th class="px-5 py-3 font-black text-right"${_scopeId}>Tekil</th><th class="px-5 py-3 font-black text-right"${_scopeId}>Ort. Süre</th></tr></thead><tbody class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(__props.topPages, (row) => {
              _push2(`<tr${_scopeId}><td class="px-5 py-3 truncate max-w-md"${_scopeId}><a${ssrRenderAttr("href", row.path)} target="_blank" class="hover:text-red-700"${_scopeId}>${ssrInterpolate(row.path)}</a></td><td class="px-5 py-3 text-right font-bold"${_scopeId}>${ssrInterpolate(row.views.toLocaleString())}</td><td class="px-5 py-3 text-right"${_scopeId}>${ssrInterpolate(row.visitors.toLocaleString())}</td><td class="px-5 py-3 text-right"${_scopeId}>${ssrInterpolate(formatDuration(row.avg_seconds))}</td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.topPages.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="4" class="px-5 py-10 text-center text-[var(--bi-muted)]"${_scopeId}>Bu aralıkta veri yok.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></section><section class="border-2 border-[var(--bi-ink)] bg-white" style="${ssrRenderStyle(activeTab.value === "authors" ? null : { display: "none" })}"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>Yazar Aktivitesi</h3><p class="mt-1 text-xs text-[var(--bi-muted)]"${_scopeId}>Yeşil nokta = son 5 dakika içinde aktif</p></div><table class="w-full text-left text-sm"${_scopeId}><thead class="bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]"${_scopeId}><tr${_scopeId}><th class="px-5 py-3 font-black"${_scopeId}>Yazar</th><th class="px-5 py-3 font-black"${_scopeId}>Rol</th><th class="px-5 py-3 font-black"${_scopeId}>Son Aktivite</th><th class="px-5 py-3 font-black"${_scopeId}>Son Giriş</th><th class="px-5 py-3 font-black text-right"${_scopeId}>Yazı</th><th class="px-5 py-3 font-black text-right"${_scopeId}>7g Okunma</th><th class="px-5 py-3 font-black text-right"${_scopeId}>Toplam Okunma</th></tr></thead><tbody class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(__props.authors, (a) => {
              _push2(`<tr${_scopeId}><td class="px-5 py-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="${ssrRenderClass(["inline-block h-2 w-2 rounded-full", a.is_online ? "bg-emerald-600" : "bg-gray-400"])}"${_scopeId}></span>`);
              if (a.avatar) {
                _push2(`<img${ssrRenderAttr("src", a.avatar)} class="h-7 w-7 rounded-full object-cover" alt=""${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="font-bold"${_scopeId}>${ssrInterpolate(a.name)}</span></div></td><td class="px-5 py-3"${_scopeId}>${ssrInterpolate(roleLabel(a.role))}</td><td class="px-5 py-3"${_scopeId}>${ssrInterpolate(a.last_seen_at ? unref(timeAgo)(a.last_seen_at) : "–")}</td><td class="px-5 py-3"${_scopeId}>${ssrInterpolate(a.last_login_at ? unref(timeAgo)(a.last_login_at) : "–")}</td><td class="px-5 py-3 text-right font-bold"${_scopeId}>${ssrInterpolate(a.posts_count)}</td><td class="px-5 py-3 text-right"${_scopeId}>${ssrInterpolate(a.post_views_7d.toLocaleString())}</td><td class="px-5 py-3 text-right"${_scopeId}>${ssrInterpolate(a.total_post_views.toLocaleString())}</td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.authors.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="7" class="px-5 py-10 text-center text-[var(--bi-muted)]"${_scopeId}>Yazar bulunamadı.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></section><section class="space-y-6" style="${ssrRenderStyle(activeTab.value === "realtime" ? null : { display: "none" })}"${_scopeId}><div class="grid gap-4 sm:grid-cols-3"${_scopeId}><div class="border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800"${_scopeId}>Aktif Ziyaretçi</p><p class="mt-3 text-3xl font-black text-emerald-800"${_scopeId}>${ssrInterpolate(realtimeState.value.active_visitors)}</p><p class="mt-1 text-xs text-[var(--bi-muted)]"${_scopeId}>son ${ssrInterpolate(realtimeState.value.window_minutes)} dk</p></div><div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Online Yazar</p><p class="mt-3 text-3xl font-black"${_scopeId}>${ssrInterpolate(realtimeState.value.online_authors.length)}</p></div><div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Otomatik Yenileme</p><p class="mt-3 text-3xl font-black"${_scopeId}>15s</p></div></div><div class="grid gap-6 xl:grid-cols-2"${_scopeId}><div class="border-2 border-[var(--bi-ink)] bg-white"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>Şu Anda Görüntülenen Sayfalar</h3></div><ul class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(realtimeState.value.active_pages, (p) => {
              _push2(`<li class="flex items-center justify-between gap-3 px-5 py-3"${_scopeId}><a${ssrRenderAttr("href", p.path)} target="_blank" class="truncate text-sm hover:text-red-700"${_scopeId}>${ssrInterpolate(p.path)}</a><span class="border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800"${_scopeId}>${ssrInterpolate(p.visitors)}</span></li>`);
            });
            _push2(`<!--]-->`);
            if (realtimeState.value.active_pages.length === 0) {
              _push2(`<li class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]"${_scopeId}> Şu an aktif ziyaretçi yok. </li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul></div><div class="border-2 border-[var(--bi-ink)] bg-white"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>Online Yazarlar</h3></div><ul class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(realtimeState.value.online_authors, (u) => {
              _push2(`<li class="flex items-center gap-3 px-5 py-3"${_scopeId}><span class="inline-block h-2 w-2 rounded-full bg-emerald-600"${_scopeId}></span>`);
              if (u.avatar) {
                _push2(`<img${ssrRenderAttr("src", u.avatar)} class="h-7 w-7 rounded-full object-cover" alt=""${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="min-w-0 flex-1"${_scopeId}><p class="truncate text-sm font-bold"${_scopeId}>${ssrInterpolate(u.name)}</p><p class="truncate text-xs text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(roleLabel(u.role))} · ${ssrInterpolate(u.last_seen_at ? unref(timeAgo)(u.last_seen_at) : "")}</p></div></li>`);
            });
            _push2(`<!--]-->`);
            if (realtimeState.value.online_authors.length === 0) {
              _push2(`<li class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]"${_scopeId}> Şu an online yazar yok. </li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul></div></div></section></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6" }, [
                  createVNode("div", { class: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "Analitik"),
                      createVNode("h2", { class: "mt-3 text-3xl font-black leading-tight md:text-4xl" }, "Site Trafiği & Yazar Aktivitesi"),
                      createVNode("p", { class: "mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base" }, " Günlük ziyaretçi, popüler sayfalar, yazarların online durumu ve son giriş zamanları. ")
                    ]),
                    createVNode("div", { class: "flex flex-wrap gap-2" }, [
                      (openBlock(), createBlock(Fragment, null, renderList(ranges, (r) => {
                        return createVNode("button", {
                          key: r.key,
                          onClick: ($event) => setRange(r.key),
                          class: [
                            "border-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                            __props.range === r.key ? "border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]"
                          ]
                        }, toDisplayString(r.label), 11, ["onClick"]);
                      }), 64))
                    ])
                  ])
                ]),
                createVNode("section", { class: "flex flex-wrap gap-2 border-b-2 border-[var(--bi-ink)] pb-2" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(tabs, (t) => {
                    return createVNode("button", {
                      key: t.key,
                      onClick: ($event) => activeTab.value = t.key,
                      class: [
                        "border-2 px-4 py-2 text-sm font-bold transition",
                        activeTab.value === t.key ? "border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]"
                      ]
                    }, toDisplayString(t.label), 11, ["onClick"]);
                  }), 64))
                ]),
                withDirectives(createVNode("section", { class: "space-y-6" }, [
                  createVNode("div", { class: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" }, [
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Tekil Ziyaretçi"),
                      createVNode("p", { class: "mt-3 text-3xl font-black" }, toDisplayString(__props.summary.unique_visitors.toLocaleString()), 1)
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Toplam Görüntüleme"),
                      createVNode("p", { class: "mt-3 text-3xl font-black" }, toDisplayString(__props.summary.total_pageviews.toLocaleString()), 1)
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Ort. Oturum Süresi"),
                      createVNode("p", { class: "mt-3 text-3xl font-black" }, toDisplayString(formatDuration(__props.summary.avg_session_duration_seconds)), 1)
                    ]),
                    createVNode("div", { class: "border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800" }, "Anlık Çevrimiçi"),
                      createVNode("p", { class: "mt-3 text-3xl font-black text-emerald-800" }, toDisplayString(realtimeState.value.active_visitors), 1),
                      createVNode("p", { class: "mt-1 text-xs text-[var(--bi-muted)]" }, "son " + toDisplayString(realtimeState.value.window_minutes) + " dk", 1)
                    ])
                  ]),
                  createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.4fr_0.6fr]" }, [
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h3", { class: "text-lg font-black" }, "Günlük Trafik"),
                        createVNode("div", { class: "flex items-center gap-3 text-xs" }, [
                          createVNode("span", { class: "flex items-center gap-1" }, [
                            createVNode("span", { class: "inline-block h-2 w-3 bg-red-700" }),
                            createTextVNode(" Görüntüleme")
                          ]),
                          createVNode("span", { class: "flex items-center gap-1" }, [
                            createVNode("span", { class: "inline-block h-2 w-3 bg-[var(--bi-ink)]" }),
                            createTextVNode(" Tekil")
                          ])
                        ])
                      ]),
                      (openBlock(), createBlock("svg", {
                        viewBox: `0 0 ${chartGeometry.value.w} ${chartGeometry.value.h}`,
                        class: "mt-4 w-full",
                        preserveAspectRatio: "none",
                        style: { "height": "220px" }
                      }, [
                        createVNode("path", {
                          d: chartGeometry.value.pvPath,
                          fill: "none",
                          stroke: "#b91c1c",
                          "stroke-width": "2"
                        }, null, 8, ["d"]),
                        createVNode("path", {
                          d: chartGeometry.value.uvPath,
                          fill: "none",
                          stroke: "#0f0f0f",
                          "stroke-width": "2",
                          "stroke-dasharray": "4 3"
                        }, null, 8, ["d"]),
                        (openBlock(true), createBlock(Fragment, null, renderList(chartGeometry.value.xLabels, (lbl, i) => {
                          return openBlock(), createBlock("g", { key: i }, [
                            lbl.show ? (openBlock(), createBlock("text", {
                              key: 0,
                              x: lbl.x,
                              y: chartGeometry.value.h - 4,
                              "font-size": "10",
                              "text-anchor": "middle",
                              fill: "#666"
                            }, toDisplayString(lbl.label), 9, ["x", "y"])) : createCommentVNode("", true)
                          ]);
                        }), 128))
                      ], 8, ["viewBox"]))
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5" }, [
                      createVNode("h3", { class: "text-lg font-black" }, "Cihaz Dağılımı"),
                      createVNode("div", { class: "mt-4 space-y-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.devices, (count, key) => {
                          return openBlock(), createBlock("div", { key }, [
                            createVNode("div", { class: "flex items-center justify-between text-sm font-bold" }, [
                              createVNode("span", { class: "capitalize" }, toDisplayString(key), 1),
                              createVNode("span", null, toDisplayString(count), 1)
                            ]),
                            createVNode("div", { class: "mt-1 h-2 w-full border border-[var(--bi-ink)] bg-[var(--bi-paper)]" }, [
                              createVNode("div", {
                                class: "h-full bg-red-700",
                                style: { width: count / deviceTotal.value * 100 + "%" }
                              }, null, 4)
                            ])
                          ]);
                        }), 128))
                      ]),
                      createVNode("div", { class: "mt-6 border-t-2 border-[var(--bi-ink)] pt-4" }, [
                        createVNode("h4", { class: "text-sm font-black" }, "Trafik Kaynakları"),
                        createVNode("ul", { class: "mt-2 space-y-1 text-sm" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.topReferers, (r) => {
                            return openBlock(), createBlock("li", {
                              key: r.referer,
                              class: "flex items-center justify-between"
                            }, [
                              createVNode("span", { class: "truncate" }, toDisplayString(r.referer), 1),
                              createVNode("span", { class: "font-bold" }, toDisplayString(r.views), 1)
                            ]);
                          }), 128)),
                          __props.topReferers.length === 0 ? (openBlock(), createBlock("li", {
                            key: 0,
                            class: "text-[var(--bi-muted)]"
                          }, "Veri yok")) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ], 512), [
                  [vShow, activeTab.value === "overview"]
                ]),
                withDirectives(createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                  createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                    createVNode("h3", { class: "text-lg font-black" }, "En Çok Okunan Sayfalar")
                  ]),
                  createVNode("table", { class: "w-full text-left text-sm" }, [
                    createVNode("thead", { class: "bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-5 py-3 font-black" }, "Yol"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "Görüntüleme"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "Tekil"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "Ort. Süre")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.topPages, (row) => {
                        return openBlock(), createBlock("tr", {
                          key: row.path
                        }, [
                          createVNode("td", { class: "px-5 py-3 truncate max-w-md" }, [
                            createVNode("a", {
                              href: row.path,
                              target: "_blank",
                              class: "hover:text-red-700"
                            }, toDisplayString(row.path), 9, ["href"])
                          ]),
                          createVNode("td", { class: "px-5 py-3 text-right font-bold" }, toDisplayString(row.views.toLocaleString()), 1),
                          createVNode("td", { class: "px-5 py-3 text-right" }, toDisplayString(row.visitors.toLocaleString()), 1),
                          createVNode("td", { class: "px-5 py-3 text-right" }, toDisplayString(formatDuration(row.avg_seconds)), 1)
                        ]);
                      }), 128)),
                      __props.topPages.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "4",
                          class: "px-5 py-10 text-center text-[var(--bi-muted)]"
                        }, "Bu aralıkta veri yok.")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ], 512), [
                  [vShow, activeTab.value === "pages"]
                ]),
                withDirectives(createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                  createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                    createVNode("h3", { class: "text-lg font-black" }, "Yazar Aktivitesi"),
                    createVNode("p", { class: "mt-1 text-xs text-[var(--bi-muted)]" }, "Yeşil nokta = son 5 dakika içinde aktif")
                  ]),
                  createVNode("table", { class: "w-full text-left text-sm" }, [
                    createVNode("thead", { class: "bg-[var(--bi-paper)] border-b border-[var(--bi-ink)]" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-5 py-3 font-black" }, "Yazar"),
                        createVNode("th", { class: "px-5 py-3 font-black" }, "Rol"),
                        createVNode("th", { class: "px-5 py-3 font-black" }, "Son Aktivite"),
                        createVNode("th", { class: "px-5 py-3 font-black" }, "Son Giriş"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "Yazı"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "7g Okunma"),
                        createVNode("th", { class: "px-5 py-3 font-black text-right" }, "Toplam Okunma")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.authors, (a) => {
                        return openBlock(), createBlock("tr", {
                          key: a.id
                        }, [
                          createVNode("td", { class: "px-5 py-3" }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              createVNode("span", {
                                class: ["inline-block h-2 w-2 rounded-full", a.is_online ? "bg-emerald-600" : "bg-gray-400"]
                              }, null, 2),
                              a.avatar ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: a.avatar,
                                class: "h-7 w-7 rounded-full object-cover",
                                alt: ""
                              }, null, 8, ["src"])) : createCommentVNode("", true),
                              createVNode("span", { class: "font-bold" }, toDisplayString(a.name), 1)
                            ])
                          ]),
                          createVNode("td", { class: "px-5 py-3" }, toDisplayString(roleLabel(a.role)), 1),
                          createVNode("td", { class: "px-5 py-3" }, toDisplayString(a.last_seen_at ? unref(timeAgo)(a.last_seen_at) : "–"), 1),
                          createVNode("td", { class: "px-5 py-3" }, toDisplayString(a.last_login_at ? unref(timeAgo)(a.last_login_at) : "–"), 1),
                          createVNode("td", { class: "px-5 py-3 text-right font-bold" }, toDisplayString(a.posts_count), 1),
                          createVNode("td", { class: "px-5 py-3 text-right" }, toDisplayString(a.post_views_7d.toLocaleString()), 1),
                          createVNode("td", { class: "px-5 py-3 text-right" }, toDisplayString(a.total_post_views.toLocaleString()), 1)
                        ]);
                      }), 128)),
                      __props.authors.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "7",
                          class: "px-5 py-10 text-center text-[var(--bi-muted)]"
                        }, "Yazar bulunamadı.")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ], 512), [
                  [vShow, activeTab.value === "authors"]
                ]),
                withDirectives(createVNode("section", { class: "space-y-6" }, [
                  createVNode("div", { class: "grid gap-4 sm:grid-cols-3" }, [
                    createVNode("div", { class: "border-2 border-emerald-700 bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-emerald-800" }, "Aktif Ziyaretçi"),
                      createVNode("p", { class: "mt-3 text-3xl font-black text-emerald-800" }, toDisplayString(realtimeState.value.active_visitors), 1),
                      createVNode("p", { class: "mt-1 text-xs text-[var(--bi-muted)]" }, "son " + toDisplayString(realtimeState.value.window_minutes) + " dk", 1)
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Online Yazar"),
                      createVNode("p", { class: "mt-3 text-3xl font-black" }, toDisplayString(realtimeState.value.online_authors.length), 1)
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]" }, [
                      createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Otomatik Yenileme"),
                      createVNode("p", { class: "mt-3 text-3xl font-black" }, "15s")
                    ])
                  ]),
                  createVNode("div", { class: "grid gap-6 xl:grid-cols-2" }, [
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                      createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                        createVNode("h3", { class: "text-lg font-black" }, "Şu Anda Görüntülenen Sayfalar")
                      ]),
                      createVNode("ul", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(realtimeState.value.active_pages, (p) => {
                          return openBlock(), createBlock("li", {
                            key: p.path,
                            class: "flex items-center justify-between gap-3 px-5 py-3"
                          }, [
                            createVNode("a", {
                              href: p.path,
                              target: "_blank",
                              class: "truncate text-sm hover:text-red-700"
                            }, toDisplayString(p.path), 9, ["href"]),
                            createVNode("span", { class: "border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800" }, toDisplayString(p.visitors), 1)
                          ]);
                        }), 128)),
                        realtimeState.value.active_pages.length === 0 ? (openBlock(), createBlock("li", {
                          key: 0,
                          class: "px-5 py-10 text-center text-sm text-[var(--bi-muted)]"
                        }, " Şu an aktif ziyaretçi yok. ")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                      createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                        createVNode("h3", { class: "text-lg font-black" }, "Online Yazarlar")
                      ]),
                      createVNode("ul", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(realtimeState.value.online_authors, (u) => {
                          return openBlock(), createBlock("li", {
                            key: u.id,
                            class: "flex items-center gap-3 px-5 py-3"
                          }, [
                            createVNode("span", { class: "inline-block h-2 w-2 rounded-full bg-emerald-600" }),
                            u.avatar ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: u.avatar,
                              class: "h-7 w-7 rounded-full object-cover",
                              alt: ""
                            }, null, 8, ["src"])) : createCommentVNode("", true),
                            createVNode("div", { class: "min-w-0 flex-1" }, [
                              createVNode("p", { class: "truncate text-sm font-bold" }, toDisplayString(u.name), 1),
                              createVNode("p", { class: "truncate text-xs text-[var(--bi-muted)]" }, toDisplayString(roleLabel(u.role)) + " · " + toDisplayString(u.last_seen_at ? unref(timeAgo)(u.last_seen_at) : ""), 1)
                            ])
                          ]);
                        }), 128)),
                        realtimeState.value.online_authors.length === 0 ? (openBlock(), createBlock("li", {
                          key: 0,
                          class: "px-5 py-10 text-center text-sm text-[var(--bi-muted)]"
                        }, " Şu an online yazar yok. ")) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ], 512), [
                  [vShow, activeTab.value === "realtime"]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Analytics/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
