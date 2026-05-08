import { ref, computed, onMounted, watch, onBeforeUnmount, mergeProps, withCtx, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-lGkS_X2S.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    cinemas: { type: Array, default: () => [] },
    districts: { type: Array, default: () => [] },
    filters: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const selectedDistrict = ref(props.filters.district || "");
    const mapContainer = ref(null);
    let map = null;
    let markersLayer = null;
    const filteredCinemas = computed(() => {
      if (!selectedDistrict.value) return props.cinemas;
      return props.cinemas.filter((c) => c.district === selectedDistrict.value);
    });
    const filterByDistrict = (district) => {
      selectedDistrict.value = district;
      router.get("/sinemalar", district ? { district } : {}, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const syncSelectedDistrict = (district) => {
      selectedDistrict.value = district || "";
    };
    const renderMarkers = async () => {
      if (!map) return;
      const L = await import("leaflet");
      if (markersLayer) {
        markersLayer.clearLayers();
      } else {
        markersLayer = L.layerGroup().addTo(map);
      }
      const redIcon = L.divIcon({
        html: '<div style="background:#DC2626;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>',
        className: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      const cinemasWithCoordinates = filteredCinemas.value.filter(
        (cinema) => cinema.latitude && cinema.longitude
      );
      cinemasWithCoordinates.forEach((cinema) => {
        L.marker([cinema.latitude, cinema.longitude], { icon: redIcon }).addTo(markersLayer).bindPopup(`
                <strong>${cinema.name}</strong><br>
                <small>${cinema.district}</small><br>
                <a href="/sinema/${cinema.slug}" style="color:#DC2626">Detay</a>
            `);
      });
      if (cinemasWithCoordinates.length === 0) {
        map.setView([41.0082, 28.9784], 12);
        return;
      }
      if (cinemasWithCoordinates.length === 1) {
        map.setView([cinemasWithCoordinates[0].latitude, cinemasWithCoordinates[0].longitude], 14);
        return;
      }
      map.fitBounds(markersLayer.getBounds(), { padding: [32, 32] });
    };
    onMounted(async () => {
      if (!mapContainer.value) return;
      const L = await import("leaflet");
      await Promise.resolve({                   });
      map = L.map(mapContainer.value).setView([41.0082, 28.9784], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);
      await renderMarkers();
    });
    watch(() => props.filters.district, syncSelectedDistrict);
    watch(filteredCinemas, () => {
      renderMarkers();
    });
    onBeforeUnmount(() => {
      if (map) {
        map.remove();
        map = null;
        markersLayer = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: "Sinemalar",
        description: "İstanbul'daki bağımsız sinemalar ve gösterimleri"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="bg-white border-b border-gray-200"${_scopeId}><div class="max-w-7xl mx-auto px-4 py-8"${_scopeId}><h1 class="text-3xl font-bold text-gray-900"${_scopeId}>Sinema Haritası</h1><p class="mt-2 text-gray-600"${_scopeId}>İstanbul&#39;daki bağımsız sinemalar, gösterimdeki filmler ve kullanıcı yorumları</p></div></div><div class="max-w-7xl mx-auto px-4 py-8"${_scopeId}><div class="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-200"${_scopeId}></div><div class="flex flex-wrap gap-2 mb-6"${_scopeId}><button class="${ssrRenderClass([!selectedDistrict.value ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50", "px-4 py-1.5 text-sm font-medium rounded-full transition-colors"])}"${_scopeId}> Tumu </button><!--[-->`);
            ssrRenderList(__props.districts, (district) => {
              _push2(`<button class="${ssrRenderClass([selectedDistrict.value === district ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50", "px-4 py-1.5 text-sm font-medium rounded-full transition-colors"])}"${_scopeId}>${ssrInterpolate(district)}</button>`);
            });
            _push2(`<!--]--></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
            ssrRenderList(filteredCinemas.value, (cinema) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: cinema.id,
                href: `/sinema/${cinema.slug}`,
                class: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (cinema.photo) {
                      _push3(`<img${ssrRenderAttr("src", cinema.photo)}${ssrRenderAttr("alt", cinema.name)} class="w-full h-48 object-cover"${_scopeId2}>`);
                    } else {
                      _push3(`<div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"${_scopeId2}><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"${_scopeId2}></path></svg></div>`);
                    }
                    _push3(`<div class="p-4"${_scopeId2}><h3 class="font-bold text-gray-900"${_scopeId2}>${ssrInterpolate(cinema.name)}</h3><p class="text-sm text-gray-500 mt-1"${_scopeId2}>${ssrInterpolate(cinema.district)} · ${ssrInterpolate(cinema.address)}</p><div class="flex items-center gap-3 mt-3 text-sm text-gray-500"${_scopeId2}>`);
                    if (cinema.current_screenings?.length) {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(cinema.current_screenings.length)} film gosterimde </span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (cinema.reviews_count) {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(cinema.reviews_count)} yorum </span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                  } else {
                    return [
                      cinema.photo ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: cinema.photo,
                        alt: cinema.name,
                        class: "w-full h-48 object-cover"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-12 h-12 text-gray-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "1.5",
                            d: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                          })
                        ]))
                      ])),
                      createVNode("div", { class: "p-4" }, [
                        createVNode("h3", { class: "font-bold text-gray-900" }, toDisplayString(cinema.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500 mt-1" }, toDisplayString(cinema.district) + " · " + toDisplayString(cinema.address), 1),
                        createVNode("div", { class: "flex items-center gap-3 mt-3 text-sm text-gray-500" }, [
                          cinema.current_screenings?.length ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(cinema.current_screenings.length) + " film gosterimde ", 1)) : createCommentVNode("", true),
                          cinema.reviews_count ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(cinema.reviews_count) + " yorum ", 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (filteredCinemas.value.length === 0) {
              _push2(`<div class="text-center py-16 text-gray-400"${_scopeId}> Bu bolgede sinema bulunamadi. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "bg-white border-b border-gray-200" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 py-8" }, [
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900" }, "Sinema Haritası"),
                    createVNode("p", { class: "mt-2 text-gray-600" }, "İstanbul'daki bağımsız sinemalar, gösterimdeki filmler ve kullanıcı yorumları")
                  ])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 py-8" }, [
                  createVNode("div", {
                    ref_key: "mapContainer",
                    ref: mapContainer,
                    class: "w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-200"
                  }, null, 512),
                  createVNode("div", { class: "flex flex-wrap gap-2 mb-6" }, [
                    createVNode("button", {
                      onClick: ($event) => filterByDistrict(""),
                      class: ["px-4 py-1.5 text-sm font-medium rounded-full transition-colors", !selectedDistrict.value ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"]
                    }, " Tumu ", 10, ["onClick"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.districts, (district) => {
                      return openBlock(), createBlock("button", {
                        key: district,
                        onClick: ($event) => filterByDistrict(district),
                        class: ["px-4 py-1.5 text-sm font-medium rounded-full transition-colors", selectedDistrict.value === district ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"]
                      }, toDisplayString(district), 11, ["onClick"]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredCinemas.value, (cinema) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: cinema.id,
                        href: `/sinema/${cinema.slug}`,
                        class: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      }, {
                        default: withCtx(() => [
                          cinema.photo ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: cinema.photo,
                            alt: cinema.name,
                            class: "w-full h-48 object-cover"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-12 h-12 text-gray-400",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "1.5",
                                d: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                              })
                            ]))
                          ])),
                          createVNode("div", { class: "p-4" }, [
                            createVNode("h3", { class: "font-bold text-gray-900" }, toDisplayString(cinema.name), 1),
                            createVNode("p", { class: "text-sm text-gray-500 mt-1" }, toDisplayString(cinema.district) + " · " + toDisplayString(cinema.address), 1),
                            createVNode("div", { class: "flex items-center gap-3 mt-3 text-sm text-gray-500" }, [
                              cinema.current_screenings?.length ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(cinema.current_screenings.length) + " film gosterimde ", 1)) : createCommentVNode("", true),
                              cinema.reviews_count ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(cinema.reviews_count) + " yorum ", 1)) : createCommentVNode("", true)
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"]);
                    }), 128))
                  ]),
                  filteredCinemas.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-16 text-gray-400"
                  }, " Bu bolgede sinema bulunamadi. ")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cinema/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
