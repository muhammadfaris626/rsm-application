import { watch, unref, withCtx, createTextVNode, mergeProps, createVNode, createBlock, openBlock, withModifiers, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$4 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$3 } from "./TextInput-CNvSDFvn.js";
import "./Textarea-CO9y0V9s.js";
import VueMultiselect from "vue-multiselect";
import { component } from "@coders-tm/vue-number-format";
/* empty css                                                                  */
import "flowbite";
import "axios";
const __default__ = {
  components: {
    VueNumber: component
  },
  data() {
    return {
      number: {
        decimal: ",",
        // Pemisah desimal
        separator: ".",
        // Pemisah ribuan
        precision: 2,
        // Jumlah desimal
        masked: false
        // Nilai sebenarnya tetap berupa angka
      }
    };
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "EditInventoryPurchase",
  __ssrInlineRender: true,
  props: {
    inventoryPurchase: {
      type: Object,
      required: true
    },
    suppliers: {
      type: Array
    },
    products: {
      type: Array
    }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const form = useForm({
      id: (_a = props.inventoryPurchase) == null ? void 0 : _a.id,
      invoice_number: (_b = props.inventoryPurchase) == null ? void 0 : _b.invoice_number,
      date: (_c = props.inventoryPurchase) == null ? void 0 : _c.date,
      supplier_id: (_d = props.inventoryPurchase) == null ? void 0 : _d.supplier_id,
      // products: props.inventoryPurchase?.listData,
      products: (_e = props.inventoryPurchase) == null ? void 0 : _e.listData.map((item) => ({
        product_id: item.product,
        price: item.price || "",
        quantity: item.quantity || "",
        total_price: item.total_price || ""
      }))
    });
    const addProduct = () => {
      form.products.push({
        product_id: "",
        price: "",
        quantity: "",
        total_price: ""
      });
    };
    const removeProduct = (index) => {
      form.products.splice(index, 1);
    };
    watch(
      () => form.products.map((product) => ({ price: product.price, quantity: product.quantity })),
      (newValues) => {
        newValues.forEach((value, index) => {
          form.products[index].total_price = ((value.price || 0) * (value.quantity || 0)).toString();
        });
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Ubah Pembeliaan Persediaan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"${_scopeId}></path></svg> Produk </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Data Pembelian Persediaan`);
                } else {
                  return [
                    createTextVNode("Data Pembelian Persediaan")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Ubah Pembelian Persediaan</span></div></li></ol></nav></div><div class="pt-4"${_scopeId}><h1 class="text-xl font-semibold text-blue-600"${_scopeId}>UBAH PEMBELIAN PERSEDIAAN</h1><form${_scopeId}><div class="grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "invoice_number",
              value: "Nomor Faktur"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "invoice_number",
              type: "text",
              class: "mt-1 block w-full",
              modelValue: unref(form).invoice_number,
              "onUpdate:modelValue": ($event) => unref(form).invoice_number = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.invoice_number
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
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "supplier_id",
              value: "Supplier"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).supplier_id,
              "onUpdate:modelValue": ($event) => unref(form).supplier_id = $event,
              options: props.suppliers,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.supplier_id
            }, null, _parent2, _scopeId));
            _push2(`</div></div><h1 class="text-xl font-semibold text-blue-600 my-2"${_scopeId}>UBAH BARANG</h1><div class="bg-white p-4 rounded-xl"${_scopeId}>`);
            if (unref(form).products.length > 0) {
              _push2(`<div class="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 mb-4"${_scopeId}><nav class="flex flex-col gap-1 p-1.5"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).products, (product, index) => {
                _push2(`<div${_scopeId}><div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all"${_scopeId}><h1 class="mr-2 text-lg font-semibold"${_scopeId}>${ssrInterpolate(index + 1)}.</h1><div class="grid grid-cols-5 gap-2 w-full"${_scopeId}><div class="col-span-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(VueMultiselect), {
                  class: "bg-white",
                  modelValue: product.product_id,
                  "onUpdate:modelValue": ($event) => product.product_id = $event,
                  options: props.products,
                  "close-on-select": true,
                  placeholder: "Pilih Barang",
                  label: "product_name",
                  "track-by": "id",
                  id: "product_id_" + index
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".product_id"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}>`);
                _push2(ssrRenderComponent(unref(component), mergeProps({
                  prefix: "Rp ",
                  class: "border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                  modelValue: product.price,
                  "onUpdate:modelValue": ($event) => product.price = $event,
                  id: "price_" + index,
                  placeholder: "Harga Barang",
                  ref_for: true
                }, _ctx.number), null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".price"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$3, {
                  id: "quantity_" + index,
                  type: "text",
                  class: "block w-full bg-white",
                  placeholder: "Jumlah Barang",
                  modelValue: product.quantity,
                  "onUpdate:modelValue": ($event) => product.quantity = $event
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".quantity"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}>`);
                _push2(ssrRenderComponent(unref(component), mergeProps({
                  prefix: "Rp ",
                  class: "bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                  modelValue: product.total_price,
                  "onUpdate:modelValue": ($event) => product.total_price = $event,
                  id: "total_price_" + index,
                  placeholder: "Rp 0",
                  ref_for: true
                }, _ctx.number, { disabled: "" }), null, _parent2, _scopeId));
                _push2(`</div></div><div class="ml-2 grid place-items-center justify-self-end"${_scopeId}><button class="rounded-md border border-transparent p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"${_scopeId}><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd"${_scopeId}></path></svg></button></div></div></div>`);
              });
              _push2(`<!--]--></nav></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex-flex-row-reverse space-x-4 space-x-reverse justify-center"${_scopeId}><div class="text-center"${_scopeId}><button type="button" class="px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"${_scopeId}> Tambah Barang </button></div></div></div><div class="mt-6"${_scopeId}><button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${_scopeId}>UBAH</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
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
                            href: _ctx.route("inventoryPurchases.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Data Pembelian Persediaan")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Ubah Pembelian Persediaan")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "pt-4" }, [
                  createVNode("h1", { class: "text-xl font-semibold text-blue-600" }, "UBAH PEMBELIAN PERSEDIAAN"),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => unref(form).put(_ctx.route("inventoryPurchases.update", unref(form).id)), ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl" }, [
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "invoice_number",
                          value: "Nomor Faktur"
                        }),
                        createVNode(_sfc_main$3, {
                          id: "invoice_number",
                          type: "text",
                          class: "mt-1 block w-full",
                          modelValue: unref(form).invoice_number,
                          "onUpdate:modelValue": ($event) => unref(form).invoice_number = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.invoice_number
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
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "supplier_id",
                          value: "Supplier"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).supplier_id,
                          "onUpdate:modelValue": ($event) => unref(form).supplier_id = $event,
                          options: props.suppliers,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.supplier_id
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("h1", { class: "text-xl font-semibold text-blue-600 my-2" }, "UBAH BARANG"),
                    createVNode("div", { class: "bg-white p-4 rounded-xl" }, [
                      unref(form).products.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 mb-4"
                      }, [
                        createVNode("nav", { class: "flex flex-col gap-1 p-1.5" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(form).products, (product, index) => {
                            return openBlock(), createBlock("div", { key: index }, [
                              createVNode("div", { class: "text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all" }, [
                                createVNode("h1", { class: "mr-2 text-lg font-semibold" }, toDisplayString(index + 1) + ".", 1),
                                createVNode("div", { class: "grid grid-cols-5 gap-2 w-full" }, [
                                  createVNode("div", { class: "col-span-2" }, [
                                    createVNode(unref(VueMultiselect), {
                                      class: "bg-white",
                                      modelValue: product.product_id,
                                      "onUpdate:modelValue": ($event) => product.product_id = $event,
                                      options: props.products,
                                      "close-on-select": true,
                                      placeholder: "Pilih Barang",
                                      label: "product_name",
                                      "track-by": "id",
                                      id: "product_id_" + index
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "id"]),
                                    createVNode(_sfc_main$4, {
                                      class: "mt-2",
                                      message: unref(form).errors["products." + index + ".product_id"]
                                    }, null, 8, ["message"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(unref(component), mergeProps({
                                      prefix: "Rp ",
                                      class: "border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                                      modelValue: product.price,
                                      "onUpdate:modelValue": ($event) => product.price = $event,
                                      id: "price_" + index,
                                      placeholder: "Harga Barang",
                                      ref_for: true
                                    }, _ctx.number), null, 16, ["modelValue", "onUpdate:modelValue", "id"]),
                                    createVNode(_sfc_main$4, {
                                      class: "mt-2",
                                      message: unref(form).errors["products." + index + ".price"]
                                    }, null, 8, ["message"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(_sfc_main$3, {
                                      id: "quantity_" + index,
                                      type: "text",
                                      class: "block w-full bg-white",
                                      placeholder: "Jumlah Barang",
                                      modelValue: product.quantity,
                                      "onUpdate:modelValue": ($event) => product.quantity = $event
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                    createVNode(_sfc_main$4, {
                                      class: "mt-2",
                                      message: unref(form).errors["products." + index + ".quantity"]
                                    }, null, 8, ["message"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(unref(component), mergeProps({
                                      prefix: "Rp ",
                                      class: "bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                                      modelValue: product.total_price,
                                      "onUpdate:modelValue": ($event) => product.total_price = $event,
                                      id: "total_price_" + index,
                                      placeholder: "Rp 0",
                                      ref_for: true
                                    }, _ctx.number, { disabled: "" }), null, 16, ["modelValue", "onUpdate:modelValue", "id"])
                                  ])
                                ]),
                                createVNode("div", { class: "ml-2 grid place-items-center justify-self-end" }, [
                                  createVNode("button", {
                                    onClick: ($event) => removeProduct(index),
                                    class: "rounded-md border border-transparent p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
                                    type: "button"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      viewBox: "0 0 24 24",
                                      fill: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        d: "M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",
                                        "clip-rule": "evenodd"
                                      })
                                    ]))
                                  ], 8, ["onClick"])
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex-flex-row-reverse space-x-4 space-x-reverse justify-center" }, [
                        createVNode("div", { class: "text-center" }, [
                          createVNode("button", {
                            onClick: addProduct,
                            type: "button",
                            class: "px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"
                          }, " Tambah Barang ")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("button", {
                        type: "submit",
                        class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      }, "UBAH"),
                      createVNode(unref(Link), {
                        href: _ctx.route("inventoryPurchases.index"),
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
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/InventoryPurchases/EditInventoryPurchase.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
