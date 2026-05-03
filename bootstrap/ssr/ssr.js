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
    /* @__PURE__ */ Object.assign({ "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DASz_YWt.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-C3fDd4p_.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-CFvT2BfT.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-BrrcJTPg.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-Bsg-I_hm.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-D5dL8VCL.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-BbiUO_mJ.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-BU-gwZiw.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit-BzqrXUmO.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-CdJF5z_t.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-Bu-71H7T.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-D2F5BxSY.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-BgJJzDHk.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-BJ5aBjSV.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-Dm3K3v3U.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-CoGr_JyE.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-DImbW9iU.js"), "./Pages/Home.vue": () => import("./assets/Home-CTX2y8Be.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-BGDhVh8y.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-DVYkktso.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-DxNN0X98.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-BRk4B-Yg.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-DgAMF2rj.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-lMeP5qnO.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-DarLu-5L.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-DQ6eid4L.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
