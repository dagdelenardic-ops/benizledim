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
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-Dt37rHix.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-CKn2MVA1.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Asistan/Index.vue": () => import("./assets/Index-7PGKSvHn.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-DElFY8Jr.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-BQ4cQ1pc.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-B8rgEi6n.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-C3J-32fh.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-Du6AXCn1.js"), "./Pages/FlashNews/Index.vue": () => import("./assets/Index-BYCErxtj.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-C1yoXVF_.js"), "./Pages/Home.vue": () => import("./assets/Home-CG_hZmvB.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-KS9nwnM5.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-D-D-aobL.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-DaDANOaF.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-oJzb5SZq.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-CfMcxOGY.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-Dkf2Kd2c.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-nx9Jp6F4.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-CugAXXFC.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-9ENTCzm0.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
