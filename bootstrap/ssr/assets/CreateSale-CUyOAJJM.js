import { watch, computed, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, mergeProps, withModifiers, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$4 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$3 } from "./TextInput-CNvSDFvn.js";
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
        separator: ".",
        precision: 2,
        masked: false
      }
    };
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "CreateSale",
  __ssrInlineRender: true,
  props: {
    invoice: {
      type: String
    },
    branches: {
      type: Array
    },
    products: {
      type: Array
    },
    employees: {
      type: Array
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      branch_id: "",
      invoice_number: props.invoice,
      date: "",
      management_structure_id: "",
      products: []
    });
    const addProduct = () => {
      form.products.push({
        branch_product_id: "",
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
    const products = computed(() => usePage().props.products ?? []);
    const formattedProducts = computed(() => {
      return products.value.map((product) => {
        var _a;
        return {
          id: product.id,
          label: `${(_a = product.product_id) == null ? void 0 : _a[0].product_name}`,
          stock: product.quantity || 0,
          serial_barcode: product.serial_barcode,
          tanggal: product.created_at
        };
      });
    }, { deep: true });
    const formatTeknisi = computed(() => usePage().props.employees.map(
      (employee) => {
        var _a;
        return {
          ...employee,
          label: `${(_a = employee.employee_id[0]) == null ? void 0 : _a.name}`
        };
      }
    ));
    const totalPrice = computed(() => {
      return form.products.reduce((sum, product) => {
        return sum + parseInt(product.total_price || 0);
      }, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Penjualan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><nav class="flex mb-4" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2"${_scopeId}><li class="inline-flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("dashboard"),
              class: "inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 w-5 h-5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"${_scopeId2}></path></svg> Produk `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      "stroke-width": "1.5",
                      stroke: "currentColor",
                      class: "mr-1 w-5 h-5"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      })
                    ])),
                    createTextVNode(" Produk ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 6 10"${_scopeId}><path d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("sales.index"),
              class: "text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Data Penjualan`);
                } else {
                  return [
                    createTextVNode("Data Penjualan")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 6 10"${_scopeId}><path d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="text-sm font-medium text-gray-500 dark:text-gray-400"${_scopeId}>Tambah Penjualan</span></div></li></ol></nav><h1 class="text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Tambah Penjualan</h1><p class="text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Formulir untuk menambahkan data penjualan baru</p></div><form${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"${_scopeId}><div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2"${_scopeId}><svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div> Informasi Penjualan </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "invoice_number",
              value: "Nomor Faktur"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "invoice_number",
              type: "text",
              class: "mt-1 block w-full bg-gray-100 dark:bg-gray-700",
              modelValue: unref(form).invoice_number,
              "onUpdate:modelValue": ($event) => unref(form).invoice_number = $event,
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.invoice_number
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "branch_id",
              value: "Cabang *"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).branch_id,
              "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
              options: props.branches,
              "close-on-select": true,
              placeholder: "Pilih Cabang",
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
              value: "Tanggal *"
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
              for: "management_structure_id",
              value: "Teknisi *"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).management_structure_id,
              "onUpdate:modelValue": ($event) => unref(form).management_structure_id = $event,
              options: formatTeknisi.value,
              "close-on-select": true,
              placeholder: "Pilih Teknisi",
              label: "label",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "mt-2",
              message: unref(form).errors.management_structure_id
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"${_scopeId}><div class="bg-green-100 dark:bg-green-900 rounded-lg p-2"${_scopeId}><svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg></div> Daftar Barang </h2><button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15"${_scopeId}></path></svg> Tambah Barang </button></div>`);
            if (unref(form).products.length > 0) {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).products, (product, index) => {
                var _a;
                _push2(`<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"${_scopeId}><div class="flex items-start gap-4"${_scopeId}><div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"${_scopeId}><span class="text-sm font-semibold text-blue-600 dark:text-blue-400"${_scopeId}>${ssrInterpolate(index + 1)}</span></div><div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4"${_scopeId}><div class="md:col-span-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "product_" + index,
                  value: "Barang *"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(VueMultiselect), {
                  modelValue: product.branch_product_id,
                  "onUpdate:modelValue": ($event) => product.branch_product_id = $event,
                  options: formattedProducts.value,
                  "close-on-select": true,
                  placeholder: "Pilih Barang",
                  label: "label",
                  "track-by": "id"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".branch_product_id"]
                }, null, _parent2, _scopeId));
                if (((_a = product.branch_product_id) == null ? void 0 : _a.stock) != null) {
                  _push2(`<div class="mt-2 text-xs text-gray-500 dark:text-gray-400"${_scopeId}><span class="inline-flex items-center gap-1"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg> Stok: <span class="font-semibold"${_scopeId}>${ssrInterpolate(product.branch_product_id.stock)}</span></span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "price_" + index,
                  value: "Harga *"
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
                  value: "Jumlah *"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$3, {
                  id: "quantity_" + index,
                  type: "number",
                  class: "block w-full",
                  placeholder: "Jumlah",
                  modelValue: product.quantity,
                  "onUpdate:modelValue": ($event) => product.quantity = $event,
                  min: "1"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(_sfc_main$4, {
                  class: "mt-2",
                  message: unref(form).errors["products." + index + ".quantity"]
                }, null, _parent2, _scopeId));
                _push2(`</div></div><div class="flex-shrink-0"${_scopeId}><div class="mb-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  for: "total_" + index,
                  value: "Total"
                }, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(component), mergeProps({
                  prefix: "Rp ",
                  class: "bg-gray-100 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:text-white font-semibold",
                  modelValue: product.total_price,
                  "onUpdate:modelValue": ($event) => product.total_price = $event,
                  id: "total_" + index,
                  ref_for: true
                }, _ctx.number, { disabled: "" }), null, _parent2, _scopeId));
                _push2(`</div><button type="button" class="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"${_scopeId}><svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg> Hapus </button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-8 text-gray-400"${_scopeId}><svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg><p${_scopeId}>Belum ada barang yang ditambahkan</p><p class="text-sm"${_scopeId}>Klik tombol &quot;Tambah Barang&quot; untuk menambahkan</p></div>`);
            }
            _push2(`</div>`);
            if (unref(form).products.length > 0) {
              _push2(`<div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border border-green-200 dark:border-green-800 p-6 mb-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="bg-green-100 dark:bg-green-900 rounded-lg p-3"${_scopeId}><svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg></div><div${_scopeId}><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Total Harga</p><p class="text-3xl font-bold text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(totalPrice.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }))}</p></div></div><div class="text-right"${_scopeId}><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Jumlah Item</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(form).products.length)}</p></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-end gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("sales.index"),
              class: "px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
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
            _push2(`<button type="submit" class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800"${_scopeId}><span class="flex items-center gap-2"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg> Simpan Penjualan </span></button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", null, [
                  createVNode("nav", {
                    class: "flex mb-4",
                    "aria-label": "Breadcrumb"
                  }, [
                    createVNode("ol", { class: "inline-flex items-center space-x-1 md:space-x-2" }, [
                      createVNode("li", { class: "inline-flex items-center" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("dashboard"),
                          class: "inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              "stroke-width": "1.5",
                              stroke: "currentColor",
                              class: "mr-1 w-5 h-5"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                              })
                            ])),
                            createTextVNode(" Produk ")
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ]),
                      createVNode("li", null, [
                        createVNode("div", { class: "flex items-center" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3 h-3 text-gray-400 mx-1",
                            fill: "currentColor",
                            viewBox: "0 0 6 10"
                          }, [
                            createVNode("path", { d: "m1 9 4-4-4-4" })
                          ])),
                          createVNode(unref(Link), {
                            href: _ctx.route("sales.index"),
                            class: "text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Data Penjualan")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]),
                      createVNode("li", null, [
                        createVNode("div", { class: "flex items-center" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3 h-3 text-gray-400 mx-1",
                            fill: "currentColor",
                            viewBox: "0 0 6 10"
                          }, [
                            createVNode("path", { d: "m1 9 4-4-4-4" })
                          ])),
                          createVNode("span", { class: "text-sm font-medium text-gray-500 dark:text-gray-400" }, "Tambah Penjualan")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("h1", { class: "text-3xl font-bold text-gray-900 dark:text-white" }, "Tambah Penjualan"),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mt-1" }, "Formulir untuk menambahkan data penjualan baru")
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(($event) => unref(form).post(_ctx.route("sales.store")), ["prevent"])
                }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2" }, [
                      createVNode("div", { class: "bg-blue-100 dark:bg-blue-900 rounded-lg p-2" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 text-blue-600 dark:text-blue-400",
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
                      createTextVNode(" Informasi Penjualan ")
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "invoice_number",
                          value: "Nomor Faktur"
                        }),
                        createVNode(_sfc_main$3, {
                          id: "invoice_number",
                          type: "text",
                          class: "mt-1 block w-full bg-gray-100 dark:bg-gray-700",
                          modelValue: unref(form).invoice_number,
                          "onUpdate:modelValue": ($event) => unref(form).invoice_number = $event,
                          disabled: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.invoice_number
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "branch_id",
                          value: "Cabang *"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).branch_id,
                          "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                          options: props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih Cabang",
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
                          value: "Tanggal *"
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
                          for: "management_structure_id",
                          value: "Teknisi *"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).management_structure_id,
                          "onUpdate:modelValue": ($event) => unref(form).management_structure_id = $event,
                          options: formatTeknisi.value,
                          "close-on-select": true,
                          placeholder: "Pilih Teknisi",
                          label: "label",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$4, {
                          class: "mt-2",
                          message: unref(form).errors.management_structure_id
                        }, null, 8, ["message"])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2" }, [
                        createVNode("div", { class: "bg-green-100 dark:bg-green-900 rounded-lg p-2" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-5 h-5 text-green-600 dark:text-green-400",
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
                        createTextVNode(" Daftar Barang ")
                      ]),
                      createVNode("button", {
                        onClick: addProduct,
                        type: "button",
                        class: "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
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
                            d: "M12 4.5v15m7.5-7.5h-15"
                          })
                        ])),
                        createTextVNode(" Tambah Barang ")
                      ])
                    ]),
                    unref(form).products.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).products, (product, index) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                        }, [
                          createVNode("div", { class: "flex items-start gap-4" }, [
                            createVNode("div", { class: "flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center" }, [
                              createVNode("span", { class: "text-sm font-semibold text-blue-600 dark:text-blue-400" }, toDisplayString(index + 1), 1)
                            ]),
                            createVNode("div", { class: "flex-1 grid grid-cols-1 md:grid-cols-4 gap-4" }, [
                              createVNode("div", { class: "md:col-span-2" }, [
                                createVNode(_sfc_main$2, {
                                  for: "product_" + index,
                                  value: "Barang *"
                                }, null, 8, ["for"]),
                                createVNode(unref(VueMultiselect), {
                                  modelValue: product.branch_product_id,
                                  "onUpdate:modelValue": ($event) => product.branch_product_id = $event,
                                  options: formattedProducts.value,
                                  "close-on-select": true,
                                  placeholder: "Pilih Barang",
                                  label: "label",
                                  "track-by": "id"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                                createVNode(_sfc_main$4, {
                                  class: "mt-2",
                                  message: unref(form).errors["products." + index + ".branch_product_id"]
                                }, null, 8, ["message"]),
                                ((_a = product.branch_product_id) == null ? void 0 : _a.stock) != null ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 text-xs text-gray-500 dark:text-gray-400"
                                }, [
                                  createVNode("span", { class: "inline-flex items-center gap-1" }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-4 h-4",
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
                                    createTextVNode(" Stok: "),
                                    createVNode("span", { class: "font-semibold" }, toDisplayString(product.branch_product_id.stock), 1)
                                  ])
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode(_sfc_main$2, {
                                  for: "price_" + index,
                                  value: "Harga *"
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
                                  value: "Jumlah *"
                                }, null, 8, ["for"]),
                                createVNode(_sfc_main$3, {
                                  id: "quantity_" + index,
                                  type: "number",
                                  class: "block w-full",
                                  placeholder: "Jumlah",
                                  modelValue: product.quantity,
                                  "onUpdate:modelValue": ($event) => product.quantity = $event,
                                  min: "1"
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                createVNode(_sfc_main$4, {
                                  class: "mt-2",
                                  message: unref(form).errors["products." + index + ".quantity"]
                                }, null, 8, ["message"])
                              ])
                            ]),
                            createVNode("div", { class: "flex-shrink-0" }, [
                              createVNode("div", { class: "mb-2" }, [
                                createVNode(_sfc_main$2, {
                                  for: "total_" + index,
                                  value: "Total"
                                }, null, 8, ["for"]),
                                createVNode(unref(component), mergeProps({
                                  prefix: "Rp ",
                                  class: "bg-gray-100 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:text-white font-semibold",
                                  modelValue: product.total_price,
                                  "onUpdate:modelValue": ($event) => product.total_price = $event,
                                  id: "total_" + index,
                                  ref_for: true
                                }, _ctx.number, { disabled: "" }), null, 16, ["modelValue", "onUpdate:modelValue", "id"])
                              ]),
                              createVNode("button", {
                                onClick: ($event) => removeProduct(index),
                                type: "button",
                                class: "w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4 inline mr-1",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  })
                                ])),
                                createTextVNode(" Hapus ")
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-8 text-gray-400"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600",
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
                      createVNode("p", null, "Belum ada barang yang ditambahkan"),
                      createVNode("p", { class: "text-sm" }, 'Klik tombol "Tambah Barang" untuk menambahkan')
                    ]))
                  ]),
                  unref(form).products.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border border-green-200 dark:border-green-800 p-6 mb-6"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("div", { class: "bg-green-100 dark:bg-green-900 rounded-lg p-3" }, [
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
                              d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            })
                          ]))
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Total Harga"),
                          createVNode("p", { class: "text-3xl font-bold text-green-600 dark:text-green-400" }, toDisplayString(totalPrice.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })), 1)
                        ])
                      ]),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Jumlah Item"),
                        createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(form).products.length), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex items-center justify-end gap-3" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("sales.index"),
                      class: "px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Batal ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      class: "px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800"
                    }, [
                      createVNode("span", { class: "flex items-center gap-2" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
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
                        createTextVNode(" Simpan Penjualan ")
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/Sales/CreateSale.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
