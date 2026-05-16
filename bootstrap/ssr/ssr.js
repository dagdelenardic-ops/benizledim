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
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-BVtZr0Cr.js"), "./Pages/Admin/Analytics/Index.vue": () => import("./assets/Index-BnD1Wqli.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DUULpYZY.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-Cmrq0FNq.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Dtferjwb.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-DO4lXbi6.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-D43BJJsU.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-B79drCLh.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-x_rl9wE_.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-D4p5Ajud.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit--9693HM9.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-8k3zPmOd.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-MO3YyEnn.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-7_odiOhr.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-RgLauznK.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-CgkP_e-A.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-jH9KjW1s.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-Ch_l1edm.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-WURybyRW.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-C-DbrD-y.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-BNTv6u_5.js"), "./Pages/FlashNews/Index.vue": () => import("./assets/Index-1tL00K0S.js"), "./Pages/FlashNews/Show.vue": () => import("./assets/Show-D9N4WLZc.js"), "./Pages/Home.vue": () => import("./assets/Home-DYYfDC4B.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-DO_DDJO5.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-BTHRjR7-.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-CVCv45av.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-jt6cNgbS.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-C9B9BGWq.js"), "./Pages/Quiz/Play.vue": () => import("./assets/Play-BWJIpNKc.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-Cldpyhd9.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-TkUIjsvg.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-BY5cdFzW.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-K6wZp5iX.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
