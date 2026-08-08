import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { r as resolvePageComponent } from "./assets/vendor-koWuargk.js";
createServer((page) => createInertiaApp({
  page,
  render: renderToString,
  title: (title) => title || "Ben İzledim",
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.vue`,
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-J8_ulCAA.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-CKn2MVA1.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Asistan/Index.vue": () => import("./assets/Index-Bd_m2Oi9.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-CHJNdKJ2.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-CawIQqfn.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-CLW__enU.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-Cq11WZ9W.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-CjRGspPz.js"), "./Pages/FlashNews/Index.vue": () => import("./assets/Index-DCPvEbb1.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-CUSeTDzE.js"), "./Pages/Home.vue": () => import("./assets/Home-CByoVnr5.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-A9wk6s7f.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-DbXtA6Ew.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-CKaVgtZi.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-Dk7WshDp.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-D6l-4ZCO.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-Dj2AlTan.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-BvcrhMt-.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-D3pshApZ.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-BohwVz2K.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
