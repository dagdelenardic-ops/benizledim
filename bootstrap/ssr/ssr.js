import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
createServer((page) => createInertiaApp({
  page,
  render: renderToString,
  title: (title) => title ? `${title} | Ben İzledim` : "Ben İzledim",
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.vue`,
    /* @__PURE__ */ Object.assign({ "./Pages/Activity/Index.vue": () => import("./assets/Index-BAV8w7KM.js"), "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DASz_YWt.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-BySW2QYG.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-D8qUD-v4.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-BrrcJTPg.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-BIsJpGws.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-D5dL8VCL.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-BbiUO_mJ.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-jPUPZCIj.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit-BFxr_DrA.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-CIi-pb-S.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-Bu-71H7T.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-D2F5BxSY.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-D1Uo-hmK.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-0DJBsLTh.js"), "./Pages/Author/Index.vue": () => import("./assets/Index-Cq-1oi_H.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-DFXwR6Jm.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-U8q6-6fn.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-eOzVMKFm.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-hxrXTaN6.js"), "./Pages/Home.vue": () => import("./assets/Home-Y0yVZX1Q.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-BIJfDjdD.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-wTwxVEzc.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-lnGREYa4.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-DImEgPFw.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-HJf0m0xs.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-D8LqjOyY.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-BYRTQ-MC.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-RhfoF9Qk.js"), "./Pages/Watchlist/Index.vue": () => import("./assets/Index-BwaYwxZw.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
