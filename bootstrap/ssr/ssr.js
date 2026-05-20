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
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-C3Kc2UvD.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-MO3YyEnn.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-CEQHgUVh.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-c0Xej_0a.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-B2iUucDx.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-Dp3l37_s.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-D9Wk3v7b.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-DGEdzKvL.js"), "./Pages/FlashNews/Index.vue": () => import("./assets/Index-DQnBGy-T.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-DFplacgX.js"), "./Pages/Home.vue": () => import("./assets/Home-DgQPIfw9.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-dcF0vw4x.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-DJcJ2bCS.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-CkhDc7JF.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-BV-AQbMd.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-Bob5imfl.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-BMVPBAT8.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-DetlulNV.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-BgFWenDG.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-w_apDY0Y.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-Dk0KIui9.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
