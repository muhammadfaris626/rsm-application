import { ref, watch, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, withModifiers, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$4 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$3 } from "./TextInput-CNvSDFvn.js";
import "./Textarea-CO9y0V9s.js";
import VueMultiselect from "vue-multiselect";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "EditRequestReturn",
  __ssrInlineRender: true,
  props: {
    requestReturn: {
      type: Object,
      required: true
    },
    requestOrders: {
      type: Array
    },
    branches: {
      type: Array
    }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const form = useForm({
      id: (_a = props.requestReturn) == null ? void 0 : _a.id,
      request_number: (_b = props.requestReturn) == null ? void 0 : _b.request_number,
      request_order_id: (_c = props.requestReturn) == null ? void 0 : _c.request_order_id,
      branch_id: (_d = props.requestReturn) == null ? void 0 : _d.branch_id,
      date: (_e = props.requestReturn) == null ? void 0 : _e.date
    });
    const branchProducts = ref([]);
    watch(() => form.request_order_id, (newVal) => {
      if (newVal == null ? void 0 : newVal.branch_product) {
        branchProducts.value = newVal.branch_product.map((product) => ({
          ...product,
          total_return: product.total_return ?? ""
        }));
      } else {
        branchProducts.value = [];
      }
    }, { deep: true, immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Ubah Permintaan Return" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"${_scopeId}></path></svg> Produk </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("requestReturns.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Permintaan Return`);
                } else {
                  return [
                    createTextVNode("Permintaan Return")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Ubah Permintaan Return</span></div></li></ol></nav></div><div class="pt-4"${_scopeId}><h1 class="text-xl font-semibold text-blue-600"${_scopeId}>UBAH PERMINTAAN RETURN</h1><form${_scopeId}><div class="grid grid-cols-4 gap-2 mt-2 bg-white p-4 rounded-xl"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "request_number",
              value: "Nomor Permintaan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "request_number",
              type: "text",
              class: "mt-1 block w-full bg-slate-300",
              modelValue: unref(form).request_number,
              "onUpdate:modelValue": ($event) => unref(form).request_number = $event,
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.request_number
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "request_order_id",
              value: "Nomor RO"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).request_order_id,
              "onUpdate:modelValue": ($event) => unref(form).request_order_id = $event,
              options: props.requestOrders,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "ro_number",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.request_order_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
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
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.branch_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "date",
              value: "Tanggal"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "date",
              type: "date",
              class: "mt-1 block w-full",
              modelValue: unref(form).date,
              "onUpdate:modelValue": ($event) => unref(form).date = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.date
            }, null, _parent2, _scopeId));
            _push2(`</div></div><h1 class="text-xl font-semibold text-blue-600 my-2"${_scopeId}>BARANG</h1><div class="bg-white pt-4 pb-6 px-4 rounded-xl"${_scopeId}><div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all"${_scopeId}><h1 class="mr-10 text-md font-semibold text-center"${_scopeId}>NO</h1><div class="grid grid-cols-5 gap-2 w-full text-center"${_scopeId}><div class="col-span-2"${_scopeId}><h1 class="mr-5 text-md font-semibold text-center"${_scopeId}>NAMA BARANG</h1></div><div${_scopeId}><h1 class="mr-5 text-md font-semibold text-center"${_scopeId}>SISA STOK</h1></div><div${_scopeId}><h1 class="mr-5 text-md font-semibold text-center"${_scopeId}>JUMLAH RETURN</h1></div></div></div><!--[-->`);
            ssrRenderList(branchProducts.value, (product, index) => {
              _push2(`<div${_scopeId}><div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all"${_scopeId}><h1 class="mr-10 text-lg font-semibold text-center"${_scopeId}>${ssrInterpolate(index + 1)}.</h1><div class="grid grid-cols-5 gap-2 w-full"${_scopeId}><div class="col-span-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                type: "text",
                class: "block w-full bg-slate-300",
                placeholder: "Jumlah Barang",
                modelValue: product.product.product_name,
                "onUpdate:modelValue": ($event) => product.product.product_name = $event,
                disabled: ""
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                type: "text",
                class: "block w-full bg-slate-300 text-center",
                placeholder: "Jumlah Barang",
                modelValue: product.quantity,
                "onUpdate:modelValue": ($event) => product.quantity = $event,
                disabled: ""
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                type: "text",
                class: "block w-full bg-white text-center",
                placeholder: "Jumlah Barang",
                modelValue: unref(form).request_order_id.branch_product[index].total_return,
                "onUpdate:modelValue": ($event) => unref(form).request_order_id.branch_product[index].total_return = $event
              }, null, _parent2, _scopeId));
              _push2(`</div></div></div></div>`);
            });
            _push2(`<!--]--></div><div class="mt-6"${_scopeId}><button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${_scopeId}>SIMPAN</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("requestReturns.index"),
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
                            href: _ctx.route("requestReturns.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Permintaan Return")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Ubah Permintaan Return")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "pt-4" }, [
                  createVNode("h1", { class: "text-xl font-semibold text-blue-600" }, "UBAH PERMINTAAN RETURN"),
                  createVNode("form", {
                    onSubmit: withModifiers(_ctx.submitRequest, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-4 gap-2 mt-2 bg-white p-4 rounded-xl" }, [
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "request_number",
                          value: "Nomor Permintaan"
                        }),
                        createVNode(_sfc_main$3, {
                          id: "request_number",
                          type: "text",
                          class: "mt-1 block w-full bg-slate-300",
                          modelValue: unref(form).request_number,
                          "onUpdate:modelValue": ($event) => unref(form).request_number = $event,
                          disabled: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.request_number
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "request_order_id",
                          value: "Nomor RO"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).request_order_id,
                          "onUpdate:modelValue": ($event) => unref(form).request_order_id = $event,
                          options: props.requestOrders,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "ro_number",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.request_order_id
                        }, null, 8, ["message"])
                      ]),
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
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.branch_id
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "date",
                          value: "Tanggal"
                        }),
                        createVNode(_sfc_main$3, {
                          id: "date",
                          type: "date",
                          class: "mt-1 block w-full",
                          modelValue: unref(form).date,
                          "onUpdate:modelValue": ($event) => unref(form).date = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.date
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("h1", { class: "text-xl font-semibold text-blue-600 my-2" }, "BARANG"),
                    createVNode("div", { class: "bg-white pt-4 pb-6 px-4 rounded-xl" }, [
                      createVNode("div", { class: "text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all" }, [
                        createVNode("h1", { class: "mr-10 text-md font-semibold text-center" }, "NO"),
                        createVNode("div", { class: "grid grid-cols-5 gap-2 w-full text-center" }, [
                          createVNode("div", { class: "col-span-2" }, [
                            createVNode("h1", { class: "mr-5 text-md font-semibold text-center" }, "NAMA BARANG")
                          ]),
                          createVNode("div", null, [
                            createVNode("h1", { class: "mr-5 text-md font-semibold text-center" }, "SISA STOK")
                          ]),
                          createVNode("div", null, [
                            createVNode("h1", { class: "mr-5 text-md font-semibold text-center" }, "JUMLAH RETURN")
                          ])
                        ])
                      ]),
                      (openBlock(true), createBlock(Fragment, null, renderList(branchProducts.value, (product, index) => {
                        return openBlock(), createBlock("div", { key: index }, [
                          createVNode("div", { class: "text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all" }, [
                            createVNode("h1", { class: "mr-10 text-lg font-semibold text-center" }, toDisplayString(index + 1) + ".", 1),
                            createVNode("div", { class: "grid grid-cols-5 gap-2 w-full" }, [
                              createVNode("div", { class: "col-span-2" }, [
                                createVNode(_sfc_main$3, {
                                  type: "text",
                                  class: "block w-full bg-slate-300",
                                  placeholder: "Jumlah Barang",
                                  modelValue: product.product.product_name,
                                  "onUpdate:modelValue": ($event) => product.product.product_name = $event,
                                  disabled: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", null, [
                                createVNode(_sfc_main$3, {
                                  type: "text",
                                  class: "block w-full bg-slate-300 text-center",
                                  placeholder: "Jumlah Barang",
                                  modelValue: product.quantity,
                                  "onUpdate:modelValue": ($event) => product.quantity = $event,
                                  disabled: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", null, [
                                createVNode(_sfc_main$3, {
                                  type: "text",
                                  class: "block w-full bg-white text-center",
                                  placeholder: "Jumlah Barang",
                                  modelValue: unref(form).request_order_id.branch_product[index].total_return,
                                  "onUpdate:modelValue": ($event) => unref(form).request_order_id.branch_product[index].total_return = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ])
                            ])
                          ])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("button", {
                        type: "submit",
                        class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      }, "SIMPAN"),
                      createVNode(unref(Link), {
                        href: _ctx.route("requestReturns.index"),
                        class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("KEMBALI")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/RequestReturns/EditRequestReturn.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
