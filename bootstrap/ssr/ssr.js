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
    /* @__PURE__ */ Object.assign({ "./Pages/Admin/Categories/Index.vue": () => import("./assets/Index-DASz_YWt.js"), "./Pages/Admin/Comments/Index.vue": () => import("./assets/Index-C3fDd4p_.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-CFvT2BfT.js"), "./Pages/Admin/Festival/Index.vue": () => import("./assets/Index-BrrcJTPg.js"), "./Pages/Admin/Newsletters/Index.vue": () => import("./assets/Index-Bsg-I_hm.js"), "./Pages/Admin/Pages/Index.vue": () => import("./assets/Index-D5dL8VCL.js"), "./Pages/Admin/Podcasts/Index.vue": () => import("./assets/Index-BbiUO_mJ.js"), "./Pages/Admin/Posts/Create.vue": () => import("./assets/Create-BU-gwZiw.js"), "./Pages/Admin/Posts/Edit.vue": () => import("./assets/Edit-BzqrXUmO.js"), "./Pages/Admin/Posts/Index.vue": () => import("./assets/Index-CdJF5z_t.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-Bu-71H7T.js"), "./Pages/Admin/Tags/Index.vue": () => import("./assets/Index-D2F5BxSY.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-BgJJzDHk.js"), "./Pages/Author/Home.vue": () => import("./assets/Home-Dvf9XBfE.js"), "./Pages/Category/Show.vue": () => import("./assets/Show-DU6t_7NW.js"), "./Pages/Cinema/Index.vue": () => import("./assets/Index-DyEAggUT.js"), "./Pages/Cinema/Show.vue": () => import("./assets/Show-viDY3-KP.js"), "./Pages/Festival/Index.vue": () => import("./assets/Index-B6HnQvnt.js"), "./Pages/Home.vue": () => import("./assets/Home-DweGnKDI.js"), "./Pages/Page/Show.vue": () => import("./assets/Show-BU5JtrtB.js"), "./Pages/Podcast/Index.vue": () => import("./assets/Index-Vy9vJSEw.js"), "./Pages/Post/Index.vue": () => import("./assets/Index-DAUau9By.js"), "./Pages/Post/Show.vue": () => import("./assets/Show-CSdu7AFF.js"), "./Pages/Profile/Show.vue": () => import("./assets/Show-B8cTXAU2.js"), "./Pages/Recommend/Index.vue": () => import("./assets/Index-C3-oo3bK.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-BSUGcfNS.js"), "./Pages/Tag/Show.vue": () => import("./assets/Show-_kO0X2mw.js") })
  ),
  setup({ App, props, plugin }) {
    return createSSRApp({ render: () => h(App, props) }).use(plugin);
  }
}));
