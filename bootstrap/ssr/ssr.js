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
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-D-eD4qia.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-MO3YyEnn.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-DlrxtWjv.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-DuXsLG_y.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-C6p7_zPj.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-BJnyf_ZR.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-I4naSLL6.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-FLHFEszo.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-BGNWVysz.js"), "./Pages/Home.vue": () => import("./assets/Home-B-jktK1O.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-I-6jom8R.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-CussvvQG.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-CV7C1mey.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-YgkvuNCn.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-C6Aiktmu.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-BDodAAMH.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-Mu7c1otp.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-DppSFKkM.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-PJXt1lFi.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-pBsLCcfD.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
