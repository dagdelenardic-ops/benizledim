import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { r as resolvePageComponent } from "./assets/vendor-koWuargk.js";
createServer((page) => createInertiaApp({
  page,
  render: renderToString,
  title: (title) => title ? `${title} | Ben İzledim` : "Ben İzledim",
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.vue`,
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-kqa0W1my.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-MO3YyEnn.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-BjYOdWZu.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-DhlWc4-i.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-CGSXk7BI.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-CVt5k-0Q.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-BS6CQWga.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-OKRHBm5p.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-vst2jnoO.js"), "./Pages/Home.vue": () => import("./assets/Home-DX30PC-x.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-APcW3hLZ.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-Dza6zlR1.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-DDsH_5UR.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-Cg6NRpr8.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-BHt8i-3U.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-C1Zl6VNM.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-BFhbl_v-.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-BcEdCYaN.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-CRyjBVmt.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-DI14GWv8.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
