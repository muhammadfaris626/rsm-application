import { ref, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./InputLabel-KrFFJXFE.js";
import "./TextInput-CNvSDFvn.js";
import VueMultiselect from "vue-multiselect";
import axios from "axios";
import { LMap, LTileLayer, LPolygon, LMarker } from "@vue-leaflet/vue-leaflet";
/* empty css                                                                  */
import "flowbite";
const _sfc_main = {
  __name: "CreateLocation",
  __ssrInlineRender: true,
  props: {
    branches: {
      type: Array
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      branch_id: "",
      coordinates: ""
    });
    const zoom = ref(5);
    const center = ref([-2.5489, 118.0149]);
    const polygonCoordinates = ref([]);
    const addPoint = (event) => {
      const { lat, lng } = event.latlng;
      polygonCoordinates.value.push([lat, lng]);
    };
    const updatePoint = (index, event) => {
      const { lat, lng } = event.target.getLatLng();
      polygonCoordinates.value[index] = [lat, lng];
    };
    const removePoint = (index) => {
      polygonCoordinates.value.splice(index, 1);
    };
    const resetPolygon = () => {
      polygonCoordinates.value = [];
    };
    const submit = () => {
      form.branch_id = form.branch_id.id;
      form.coordinates = [polygonCoordinates.value];
      axios.post("/api/locations", form.data(), {
        headers: {
          "Content-Type": "application/json"
        }
      });
      window.location.href = "/database/locations";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Lokasi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"${_scopeId}></path></svg> Produk </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("locations.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Lokasi`);
                } else {
                  return [
                    createTextVNode("Lokasi")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Tambah Lokasi</span></div></li></ol></nav></div><div class="pt-2"${_scopeId}><h1 class="text-xl font-semibold text-blue-600"${_scopeId}>TAMBAH PERMINTAAN STOK</h1><form${_scopeId}><div class="grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "branch_id",
              value: "Cabang"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).branch_id,
              "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
              options: props.branches,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "branch_name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-span-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "coordinates",
              value: "Lokasi"
            }, null, _parent2, _scopeId));
            _push2(`<div style="${ssrRenderStyle({ "height": "600px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(LMap), {
              ref: "map",
              zoom: zoom.value,
              "onUpdate:zoom": ($event) => zoom.value = $event,
              center: center.value,
              onClick: addPoint
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(LTileLayer), {
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "layer-type": "base",
                    name: "OpenStreetMap"
                  }, null, _parent3, _scopeId2));
                  if (polygonCoordinates.value.length > 2) {
                    _push3(ssrRenderComponent(unref(LPolygon), {
                      "lat-lngs": [...polygonCoordinates.value, polygonCoordinates.value[0]],
                      color: "blue",
                      fillColor: "blue",
                      "fill-opacity": 0.3
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<!--[-->`);
                  ssrRenderList(polygonCoordinates.value, (coord, index) => {
                    _push3(ssrRenderComponent(unref(LMarker), {
                      key: index,
                      "lat-lng": coord,
                      draggable: "",
                      onDragend: ($event) => updatePoint(index, $event),
                      onContextmenu: ($event) => removePoint(index)
                    }, null, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    createVNode(unref(LTileLayer), {
                      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      "layer-type": "base",
                      name: "OpenStreetMap"
                    }),
                    polygonCoordinates.value.length > 2 ? (openBlock(), createBlock(unref(LPolygon), {
                      key: 0,
                      "lat-lngs": [...polygonCoordinates.value, polygonCoordinates.value[0]],
                      color: "blue",
                      fillColor: "blue",
                      "fill-opacity": 0.3
                    }, null, 8, ["lat-lngs"])) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(polygonCoordinates.value, (coord, index) => {
                      return openBlock(), createBlock(unref(LMarker), {
                        key: index,
                        "lat-lng": coord,
                        draggable: "",
                        onDragend: ($event) => updatePoint(index, $event),
                        onContextmenu: ($event) => removePoint(index)
                      }, null, 8, ["lat-lng", "onDragend", "onContextmenu"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mt-4"${_scopeId}><button type="button" class="px-4 py-2 bg-red-500 text-white rounded"${_scopeId}> Reset Polygon </button></div></div></div></div><div class="mt-6"${_scopeId}><button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${_scopeId}>SIMPAN</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("locations.index"),
              class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`KEMBALI`);
                } else {
                  return [
                    createTextVNode("KEMBALI")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 h-full" }, [
                createVNode("div", { class: "pb-4 border-b-2 border-dashed dark:border-gray-700" }, [
                  createVNode("nav", {
                    class: "flex",
                    "aria-label": "Breadcrumb"
                  }, [
                    createVNode("ol", { class: "inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse" }, [
                      createVNode("li", { class: "inline-flex items-center" }, [
                        createVNode("a", {
                          href: "#",
                          class: "inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                        }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            "stroke-width": "1.5",
                            stroke: "currentColor",
                            class: "mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                            })
                          ])),
                          createTextVNode(" Produk ")
                        ])
                      ]),
                      createVNode("li", null, [
                        createVNode("div", { class: "flex items-center" }, [
                          (openBlock(), createBlock("svg", {
                            class: "rtl:rotate-180 w-3 h-3 text-gray-400 mx-1",
                            "aria-hidden": "true",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 6 10"
                          }, [
                            createVNode("path", {
                              stroke: "currentColor",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "m1 9 4-4-4-4"
                            })
                          ])),
                          createVNode(unref(Link), {
                            href: _ctx.route("locations.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Lokasi")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]),
                      createVNode("li", { "aria-current": "page" }, [
                        createVNode("div", { class: "flex items-center" }, [
                          (openBlock(), createBlock("svg", {
                            class: "rtl:rotate-180 w-3 h-3 text-gray-400 mx-1",
                            "aria-hidden": "true",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 6 10"
                          }, [
                            createVNode("path", {
                              stroke: "currentColor",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "m1 9 4-4-4-4"
                            })
                          ])),
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Tambah Lokasi")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "pt-2" }, [
                  createVNode("h1", { class: "text-xl font-semibold text-blue-600" }, "TAMBAH PERMINTAAN STOK"),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl" }, [
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "branch_id",
                          value: "Cabang"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).branch_id,
                          "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                          options: props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "branch_name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      createVNode("div", { class: "col-span-2" }, [
                        createVNode(_sfc_main$2, {
                          for: "coordinates",
                          value: "Lokasi"
                        }),
                        createVNode("div", { style: { "height": "600px" } }, [
                          createVNode(unref(LMap), {
                            ref: "map",
                            zoom: zoom.value,
                            "onUpdate:zoom": ($event) => zoom.value = $event,
                            center: center.value,
                            onClick: addPoint
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(LTileLayer), {
                                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                "layer-type": "base",
                                name: "OpenStreetMap"
                              }),
                              polygonCoordinates.value.length > 2 ? (openBlock(), createBlock(unref(LPolygon), {
                                key: 0,
                                "lat-lngs": [...polygonCoordinates.value, polygonCoordinates.value[0]],
                                color: "blue",
                                fillColor: "blue",
                                "fill-opacity": 0.3
                              }, null, 8, ["lat-lngs"])) : createCommentVNode("", true),
                              (openBlock(true), createBlock(Fragment, null, renderList(polygonCoordinates.value, (coord, index) => {
                                return openBlock(), createBlock(unref(LMarker), {
                                  key: index,
                                  "lat-lng": coord,
                                  draggable: "",
                                  onDragend: ($event) => updatePoint(index, $event),
                                  onContextmenu: ($event) => removePoint(index)
                                }, null, 8, ["lat-lng", "onDragend", "onContextmenu"]);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["zoom", "onUpdate:zoom", "center"]),
                          createVNode("div", { class: "mt-4" }, [
                            createVNode("button", {
                              type: "button",
                              onClick: resetPolygon,
                              class: "px-4 py-2 bg-red-500 text-white rounded"
                            }, " Reset Polygon ")
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("button", {
                        type: "submit",
                        class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      }, "SIMPAN"),
                      createVNode(unref(Link), {
                        href: _ctx.route("locations.index"),
                        class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("KEMBALI")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Database/Locations/CreateLocation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
