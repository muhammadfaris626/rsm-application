import { watch, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, mergeProps, withModifiers, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BIJ2sf7b.js";
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
  __name: "CreateInventoryPurchase",
  __ssrInlineRender: true,
  props: {
    suppliers: {
      type: Array
    },
    products: {
      type: Array
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      invoice_number: "",
      date: "",
      supplier_id: "",
      products: []
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
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Pembelian Persediaan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Tambah Pembelian Persediaan</h1><p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Tambah data pembelian persediaan baru</p></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
              class: "inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId2}></path></svg> Kembali `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                      })
                    ])),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><form${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"${_scopeId}><div class="flex items-center gap-3 mb-6"${_scopeId}><div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2"${_scopeId}><svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div><h2 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>Informasi Pembelian</h2></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId}><div${_scopeId}>`);
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
            _push2(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"${_scopeId}><div class="flex items-center gap-3 mb-6"${_scopeId}><div class="bg-green-100 dark:bg-green-900 rounded-lg p-2"${_scopeId}><svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg></div><h2 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>Daftar Barang</h2></div><div${_scopeId}>`);
            if (unref(form).products.length > 0) {
              _push2(`<div class="space-y-4 mb-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).products, (product, index) => {
                _push2(`<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"${_scopeId}><div class="flex flex-col sm:flex-row items-start gap-3"${_scopeId}><div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold"${_scopeId}>${ssrInterpolate(index + 1)}</div><div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><div class="sm:col-span-2 lg:col-span-1"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "product_id_" + index,
                  value: "Nama Barang"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(VueMultiselect), {
                  class: "bg-white dark:bg-gray-700",
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
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "price_" + index,
                  value: "Harga Barang"
                }, null, _parent2, _scopeId));
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
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "quantity_" + index,
                  value: "Jumlah Barang"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$3, {
                  id: "quantity_" + index,
                  type: "text",
                  class: "block w-full bg-white dark:bg-gray-700",
                  placeholder: "Jumlah Barang",
                  modelValue: product.quantity,
                  "onUpdate:modelValue": ($event) => product.quantity = $event
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".quantity"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "total_price_" + index,
                  value: "Total Harga"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(component), mergeProps({
                  prefix: "Rp ",
                  class: "bg-gray-200 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                  modelValue: product.total_price,
                  "onUpdate:modelValue": ($event) => product.total_price = $event,
                  id: "total_price_" + index,
                  placeholder: "Rp 0",
                  ref_for: true
                }, _ctx.number, { disabled: "" }), null, _parent2, _scopeId));
                _push2(`</div></div><div class="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 flex justify-end sm:justify-start"${_scopeId}><button class="p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 rounded-lg disabled:pointer-events-none disabled:opacity-50" type="button" title="Hapus Barang"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"${_scopeId}><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd"${_scopeId}></path></svg></button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"${_scopeId}><svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg><p class="text-gray-500 dark:text-gray-400 mb-4"${_scopeId}>Belum ada barang yang ditambahkan</p></div>`);
            }
            _push2(`<div class="flex justify-center mt-4"${_scopeId}><button type="button" class="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId}></path></svg> Tambah Barang </button></div></div></div>`);
            if (unref(form).products.length > 0) {
              _push2(`<div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"${_scopeId}><div${_scopeId}><p class="text-green-100 text-sm font-medium mb-1"${_scopeId}>Total Item</p><p class="text-xl sm:text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(form).products.length)} Barang</p></div><div${_scopeId}><p class="text-green-100 text-sm font-medium mb-1"${_scopeId}>Total Harga</p><p class="text-xl sm:text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(form).products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }))}</p></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col sm:flex-row gap-3 justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
              class: "inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Batal `);
                } else {
                  return [
                    createTextVNode(" Batal ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit" class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg> Simpan Data </button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, "Tambah Pembelian Persediaan"),
                    createVNode("p", { class: "text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Tambah data pembelian persediaan baru")
                  ]),
                  createVNode("div", null, [
                    createVNode(unref(Link), {
                      href: _ctx.route("inventoryPurchases.index"),
                      class: "inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                          })
                        ])),
                        createTextVNode(" Kembali ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(($event) => unref(form).post(_ctx.route("inventoryPurchases.store")), ["prevent"])
                }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6" }, [
                    createVNode("div", { class: "flex items-center gap-3 mb-6" }, [
                      createVNode("div", { class: "bg-blue-100 dark:bg-blue-900 rounded-lg p-2" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6 text-blue-600 dark:text-blue-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          })
                        ]))
                      ]),
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, "Informasi Pembelian")
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
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
                    ])
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6" }, [
                    createVNode("div", { class: "flex items-center gap-3 mb-6" }, [
                      createVNode("div", { class: "bg-green-100 dark:bg-green-900 rounded-lg p-2" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6 text-green-600 dark:text-green-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          })
                        ]))
                      ]),
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, "Daftar Barang")
                    ]),
                    createVNode("div", null, [
                      unref(form).products.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-4 mb-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).products, (product, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                          }, [
                            createVNode("div", { class: "flex flex-col sm:flex-row items-start gap-3" }, [
                              createVNode("div", { class: "flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold" }, toDisplayString(index + 1), 1),
                              createVNode("div", { class: "flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                                createVNode("div", { class: "sm:col-span-2 lg:col-span-1" }, [
                                  createVNode(_sfc_main$2, {
                                    for: "product_id_" + index,
                                    value: "Nama Barang"
                                  }, null, 8, ["for"]),
                                  createVNode(unref(VueMultiselect), {
                                    class: "bg-white dark:bg-gray-700",
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
                                  createVNode(_sfc_main$2, {
                                    for: "price_" + index,
                                    value: "Harga Barang"
                                  }, null, 8, ["for"]),
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
                                  createVNode(_sfc_main$2, {
                                    for: "quantity_" + index,
                                    value: "Jumlah Barang"
                                  }, null, 8, ["for"]),
                                  createVNode(_sfc_main$3, {
                                    id: "quantity_" + index,
                                    type: "text",
                                    class: "block w-full bg-white dark:bg-gray-700",
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
                                  createVNode(_sfc_main$2, {
                                    for: "total_price_" + index,
                                    value: "Total Harga"
                                  }, null, 8, ["for"]),
                                  createVNode(unref(component), mergeProps({
                                    prefix: "Rp ",
                                    class: "bg-gray-200 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                                    modelValue: product.total_price,
                                    "onUpdate:modelValue": ($event) => product.total_price = $event,
                                    id: "total_price_" + index,
                                    placeholder: "Rp 0",
                                    ref_for: true
                                  }, _ctx.number, { disabled: "" }), null, 16, ["modelValue", "onUpdate:modelValue", "id"])
                                ])
                              ]),
                              createVNode("div", { class: "flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 flex justify-end sm:justify-start" }, [
                                createVNode("button", {
                                  onClick: ($event) => removeProduct(index),
                                  class: "p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 rounded-lg disabled:pointer-events-none disabled:opacity-50",
                                  type: "button",
                                  title: "Hapus Barang"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    class: "w-5 h-5"
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
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          })
                        ])),
                        createVNode("p", { class: "text-gray-500 dark:text-gray-400 mb-4" }, "Belum ada barang yang ditambahkan")
                      ])),
                      createVNode("div", { class: "flex justify-center mt-4" }, [
                        createVNode("button", {
                          onClick: addProduct,
                          type: "button",
                          class: "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                        }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            "stroke-width": "1.5",
                            stroke: "currentColor",
                            class: "w-5 h-5 mr-2"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M12 4.5v15m7.5-7.5h-15"
                            })
                          ])),
                          createTextVNode(" Tambah Barang ")
                        ])
                      ])
                    ])
                  ]),
                  unref(form).products.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white"
                  }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-100 text-sm font-medium mb-1" }, "Total Item"),
                        createVNode("p", { class: "text-xl sm:text-2xl font-bold" }, toDisplayString(unref(form).products.length) + " Barang", 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-100 text-sm font-medium mb-1" }, "Total Harga"),
                        createVNode("p", { class: "text-xl sm:text-2xl font-bold" }, toDisplayString(unref(form).products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-3 justify-end" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("inventoryPurchases.index"),
                      class: "inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Batal ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      class: "inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-5 h-5 mr-2",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M5 13l4 4L19 7"
                        })
                      ])),
                      createTextVNode(" Simpan Data ")
                    ])
                  ])
                ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/InventoryPurchases/CreateInventoryPurchase.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
