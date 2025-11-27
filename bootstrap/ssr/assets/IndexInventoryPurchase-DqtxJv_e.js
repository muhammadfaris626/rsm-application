import { ref, computed, watch, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, Fragment, renderList, createCommentVNode, withDirectives, isRef, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1, u as usePermission } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, usePage, router, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./Modal-BsYluhuH.js";
import "./InputError-fLcttu_2.js";
import "./TableDataCell-B8rn1BLe.js";
import "./TablePagination-A5nS3meM.js";
import "flowbite";
import "axios";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IndexInventoryPurchase",
  __ssrInlineRender: true,
  props: ["fetchData"],
  setup(__props) {
    const props = __props;
    const form = useForm({
      id: "",
      invoice_number: "",
      date: "",
      supplier_id: "",
      listData: "",
      last_update: "",
      created_at: "",
      updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    const showFilters = ref(false);
    let searchUrl = computed(() => {
      let url = new URL(route("inventoryPurchases.index"));
      url.searchParams.append("page", pageNumber.value);
      if (search.value) {
        url.searchParams.append("search", search.value);
      }
      return url;
    });
    watch(() => searchUrl.value, (updatedSearchUrl) => {
      router.visit(updatedSearchUrl, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        onSuccess: () => {
          pageNumber.value = 1;
        }
      });
    });
    const hasActiveFilters = computed(() => {
      return search.value;
    });
    ref(false);
    const showModalRead = ref(false);
    ref(false);
    const showModalDelete = ref(false);
    const closeModalRead = () => {
      showModalRead.value = false;
      form.reset();
      form.clearErrors();
    };
    const closeModalDelete = () => {
      showModalDelete.value = false;
      form.reset();
      form.clearErrors();
    };
    const modalLiatData = (data) => {
      showModalRead.value = true;
      form.id = data.id;
      form.invoice_number = data.invoice_number;
      form.date = data.date;
      form.supplier_id = data.supplier_id;
      form.listData = data.listData;
      form.last_update = data.last_update;
      form.created_at = data.created_at;
      form.updated_at = data.updated_at;
    };
    const modalHapusData = (data) => {
      showModalDelete.value = true;
      form.id = data.id;
    };
    const hapusData = () => {
      form.delete(route("inventoryPurchases.destroy", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalDelete.value = false;
        }
      });
    };
    const formatTanggal = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(date);
    };
    const calculateTotalPrice = (listData) => {
      if (!listData || listData.length === 0) return "Rp 0";
      return listData.reduce((accumulator, item) => {
        return accumulator + parseInt(item.total_price || 0, 10);
      }, 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };
    const totalPembelian = computed(() => {
      var _a, _b;
      return ((_b = (_a = props.fetchData) == null ? void 0 : _a.data) == null ? void 0 : _b.length) || 0;
    });
    const totalHarga = computed(() => {
      var _a;
      if (!((_a = props.fetchData) == null ? void 0 : _a.data)) return 0;
      return props.fetchData.data.reduce((sum, purchase) => {
        var _a2;
        return sum + (((_a2 = purchase.listData) == null ? void 0 : _a2.reduce((s, item) => s + parseInt(item.total_price || 0), 0)) || 0);
      }, 0);
    });
    const rataRataTransaksi = computed(() => {
      if (totalPembelian.value === 0) return 0;
      return totalHarga.value / totalPembelian.value;
    });
    function formatRupiah(value) {
      if (!value) return "Rp 0";
      return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Pembelian Persediaan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col gap-4"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Data Pembelian Persediaan</h1><p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Kelola data pembelian persediaan produk</p></div><div${_scopeId}>`);
            if (unref(hasPermission)("inventory-purchase: create")) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("inventoryPurchases.create"),
                class: "w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId2}></path></svg> Tambah Pembelian `);
                  } else {
                    return [
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
                      createTextVNode(" Tambah Pembelian ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"${_scopeId}><div class="flex flex-col gap-4"${_scopeId}><div class="flex flex-col sm:flex-row gap-3"${_scopeId}><div class="flex-1"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"${_scopeId}>Pencarian</label><div class="relative"${_scopeId}><div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"${_scopeId}><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(search))} type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cari nomor faktur, tanggal, atau supplier..."${_scopeId}></div></div><div class="flex items-end"${_scopeId}><button class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"${_scopeId}></path></svg> Filter `);
            if (hasActiveFilters.value) {
              _push2(`<span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"${_scopeId}>1</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button></div></div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"${_scopeId}><div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-green-100 text-sm font-medium mb-1"${_scopeId}>Total Pembelian</p><p class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(((_b = (_a = __props.fetchData) == null ? void 0 : _a.meta) == null ? void 0 : _b.total) || 0)}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div></div></div><div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-blue-100 text-sm font-medium mb-1"${_scopeId}>Total Harga</p><p class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(totalHarga.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }))}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg></div></div></div><div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-purple-100 text-sm font-medium mb-1"${_scopeId}>Rata-rata per Transaksi</p><p class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(rataRataTransaksi.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }))}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId}></path></svg></div></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"${_scopeId}><div class="overflow-x-auto -mx-4 sm:mx-0"${_scopeId}><div class="inline-block min-w-full align-middle"${_scopeId}><table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"${_scopeId}><thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700"${_scopeId}><tr${_scopeId}><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>NO</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>NOMOR FAKTUR</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden sm:table-cell"${_scopeId}>TANGGAL</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden md:table-cell"${_scopeId}>SUPPLIER</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>TOTAL HARGA</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center"${_scopeId}>AKSI</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.fetchData.data, (data, index) => {
              var _a2, _b2;
              _push2(`<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"${_scopeId}><td class="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate((__props.fetchData.meta.current_page - 1) * __props.fetchData.meta.per_page + index + 1)}</td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><div class="flex flex-col"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("inventoryPurchases.show", data.id),
                class: "font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(data.invoice_number)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(data.invoice_number), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<span class="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1"${_scopeId}>${ssrInterpolate(formatTanggal(data.date))}</span></div></td><td class="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg> ${ssrInterpolate(formatTanggal(data.date))}</div></td><td class="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell"${_scopeId}><span${_scopeId}>${ssrInterpolate(((_b2 = (_a2 = data.supplier_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2["name"]) || "N/A")}</span></td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><span class="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base"${_scopeId}>${ssrInterpolate(calculateTotalPrice(data.listData))}</span></td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><div class="flex items-center justify-center gap-1 sm:gap-2"${_scopeId}>`);
              if (unref(hasPermission)("inventory-purchase: read")) {
                _push2(`<button class="p-1.5 sm:p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30" type="button" title="Lihat Detail"${_scopeId}><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId}></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(hasPermission)("inventory-purchase: update")) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("inventoryPurchases.edit", data.id),
                  class: "p-1.5 sm:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30",
                  title: "Edit"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"${_scopeId2}></path></svg>`);
                    } else {
                      return [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 sm:w-5 sm:h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          })
                        ]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(hasPermission)("inventory-purchase: delete")) {
                _push2(`<button type="button" class="p-1.5 sm:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30" title="Hapus"${_scopeId}><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"${_scopeId}></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.fetchData.data || __props.fetchData.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400"${_scopeId}><div class="flex flex-col items-center justify-center"${_scopeId}><svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><p class="text-lg font-medium"${_scopeId}>Tidak ada data pembelian persediaan</p><p class="text-sm"${_scopeId}>Mulai dengan menambahkan pembelian persediaan baru</p></div></td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div></div>`);
            if (__props.fetchData.meta && __props.fetchData.meta.last_page > 1) {
              _push2(`<div class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"${_scopeId}><div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"${_scopeId}><div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left"${_scopeId}> Menampilkan <span class="font-semibold"${_scopeId}>${ssrInterpolate(__props.fetchData.meta.from)}</span> sampai <span class="font-semibold"${_scopeId}>${ssrInterpolate(__props.fetchData.meta.to)}</span> dari <span class="font-semibold"${_scopeId}>${ssrInterpolate(__props.fetchData.meta.total)}</span> data </div><div class="flex items-center gap-1 sm:gap-2 flex-wrap justify-center"${_scopeId}><button${ssrIncludeBooleanAttr(__props.fetchData.meta.current_page === 1) ? " disabled" : ""} class="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"${_scopeId}><span class="hidden sm:inline"${_scopeId}>Sebelumnya</span><span class="sm:hidden"${_scopeId}>‹</span></button><!--[-->`);
              ssrRenderList(Math.min(5, __props.fetchData.meta.last_page), (page) => {
                _push2(`<button class="${ssrRenderClass([
                  "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg",
                  page === __props.fetchData.meta.current_page ? "text-white bg-blue-600 hover:bg-blue-700" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                ])}"${_scopeId}>${ssrInterpolate(page)}</button>`);
              });
              _push2(`<!--]--><button${ssrIncludeBooleanAttr(__props.fetchData.meta.current_page === __props.fetchData.meta.last_page) ? " disabled" : ""} class="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"${_scopeId}><span class="hidden sm:inline"${_scopeId}>Selanjutnya</span><span class="sm:hidden"${_scopeId}>›</span></button></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalRead.value,
              onClose: closeModalRead
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b2, _c2, _d2, _e, _f, _g, _h;
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden"${_scopeId2}><div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><h3 class="text-xl font-bold text-white"${_scopeId2}> Detail Pembelian Persediaan </h3><button class="text-white hover:text-gray-200 transition-colors"${_scopeId2}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId2}></path></svg></button></div></div><div class="p-6 max-h-[70vh] overflow-y-auto"${_scopeId2}><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"${_scopeId2}><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>ID</label><p class="text-lg font-semibold text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(unref(form).id)}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Nomor Faktur</label><p class="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1"${_scopeId2}>${ssrInterpolate(unref(form).invoice_number)}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Tanggal</label><p class="text-lg font-semibold text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(formatTanggal(unref(form).date))}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Supplier</label><p class="text-lg font-semibold text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(((_b2 = (_a2 = unref(form).supplier_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2["name"]) || "N/A")}</p></div></div><div class="mb-6"${_scopeId2}><h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"${_scopeId2}>Daftar Barang</h4><div class="overflow-x-auto"${_scopeId2}><table class="w-full text-sm text-left text-gray-500 dark:text-gray-400"${_scopeId2}><thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700"${_scopeId2}><tr${_scopeId2}><th scope="col" class="px-4 py-3"${_scopeId2}>No</th><th scope="col" class="px-4 py-3"${_scopeId2}>Nama Barang</th><th scope="col" class="px-4 py-3"${_scopeId2}>Harga</th><th scope="col" class="px-4 py-3 text-center"${_scopeId2}>Jumlah</th><th scope="col" class="px-4 py-3 text-right"${_scopeId2}>Total</th></tr></thead><tbody${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(form).listData, (list, index) => {
                    var _a3;
                    _push3(`<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><td class="px-4 py-3 font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(index + 1)}</td><td class="px-4 py-3"${_scopeId2}>${ssrInterpolate(((_a3 = list.product) == null ? void 0 : _a3.product_name) || "N/A")}</td><td class="px-4 py-3"${_scopeId2}>${ssrInterpolate(formatRupiah(list.price))}</td><td class="px-4 py-3 text-center"${_scopeId2}>${ssrInterpolate(list.quantity)}</td><td class="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400"${_scopeId2}>${ssrInterpolate(formatRupiah(list.total_price))}</td></tr>`);
                  });
                  _push3(`<!--]--></tbody></table></div></div><div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><span class="text-lg font-semibold"${_scopeId2}>Total Harga</span><span class="text-2xl font-bold"${_scopeId2}>${ssrInterpolate(calculateTotalPrice(unref(form).listData))}</span></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"${_scopeId2}><div${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Diubah Oleh</label><p class="text-sm font-medium text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(((_d2 = (_c2 = unref(form).last_update) == null ? void 0 : _c2.user) == null ? void 0 : _d2.name) || "N/A")}</p></div><div${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Tanggal Dibuat</label><p class="text-sm font-medium text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(unref(form).created_at || "N/A")}</p></div><div${_scopeId2}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId2}>Tanggal Diubah</label><p class="text-sm font-medium text-gray-900 dark:text-white mt-1"${_scopeId2}>${ssrInterpolate(unref(form).updated_at || "N/A")}</p></div></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden" }, [
                      createVNode("div", { class: "bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("h3", { class: "text-xl font-bold text-white" }, " Detail Pembelian Persediaan "),
                          createVNode("button", {
                            onClick: closeModalRead,
                            class: "text-white hover:text-gray-200 transition-colors"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12"
                              })
                            ]))
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "p-6 max-h-[70vh] overflow-y-auto" }, [
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" }, [
                          createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "ID"),
                            createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).id), 1)
                          ]),
                          createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Nomor Faktur"),
                            createVNode("p", { class: "text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1" }, toDisplayString(unref(form).invoice_number), 1)
                          ]),
                          createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal"),
                            createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                          ]),
                          createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Supplier"),
                            createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(((_f = (_e = unref(form).supplier_id) == null ? void 0 : _e[0]) == null ? void 0 : _f["name"]) || "N/A"), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mb-6" }, [
                          createVNode("h4", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-4" }, "Daftar Barang"),
                          createVNode("div", { class: "overflow-x-auto" }, [
                            createVNode("table", { class: "w-full text-sm text-left text-gray-500 dark:text-gray-400" }, [
                              createVNode("thead", { class: "text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700" }, [
                                createVNode("tr", null, [
                                  createVNode("th", {
                                    scope: "col",
                                    class: "px-4 py-3"
                                  }, "No"),
                                  createVNode("th", {
                                    scope: "col",
                                    class: "px-4 py-3"
                                  }, "Nama Barang"),
                                  createVNode("th", {
                                    scope: "col",
                                    class: "px-4 py-3"
                                  }, "Harga"),
                                  createVNode("th", {
                                    scope: "col",
                                    class: "px-4 py-3 text-center"
                                  }, "Jumlah"),
                                  createVNode("th", {
                                    scope: "col",
                                    class: "px-4 py-3 text-right"
                                  }, "Total")
                                ])
                              ]),
                              createVNode("tbody", null, [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                  var _a3;
                                  return openBlock(), createBlock("tr", {
                                    key: list.id,
                                    class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                  }, [
                                    createVNode("td", { class: "px-4 py-3 font-medium text-gray-900 dark:text-white" }, toDisplayString(index + 1), 1),
                                    createVNode("td", { class: "px-4 py-3" }, toDisplayString(((_a3 = list.product) == null ? void 0 : _a3.product_name) || "N/A"), 1),
                                    createVNode("td", { class: "px-4 py-3" }, toDisplayString(formatRupiah(list.price)), 1),
                                    createVNode("td", { class: "px-4 py-3 text-center" }, toDisplayString(list.quantity), 1),
                                    createVNode("td", { class: "px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400" }, toDisplayString(formatRupiah(list.total_price)), 1)
                                  ]);
                                }), 128))
                              ])
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("span", { class: "text-lg font-semibold" }, "Total Harga"),
                            createVNode("span", { class: "text-2xl font-bold" }, toDisplayString(calculateTotalPrice(unref(form).listData)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Diubah Oleh"),
                            createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(((_h = (_g = unref(form).last_update) == null ? void 0 : _g.user) == null ? void 0 : _h.name) || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal Dibuat"),
                            createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).created_at || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal Diubah"),
                            createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).updated_at || "N/A"), 1)
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalDelete.value,
              onClose: closeModalDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="p-4 md:p-5 text-center"${_scopeId2}><svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"${_scopeId2}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg><h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"${_scopeId2}> Apakah anda yakin ingin menghapus persediaan pembelian ini ? </h3><button type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"${_scopeId2}> Ya, saya yakin </button><button type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"${_scopeId2}> Tidak, batalkan </button></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "p-4 md:p-5 text-center" }, [
                        (openBlock(), createBlock("svg", {
                          class: "mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200",
                          "aria-hidden": "true",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            stroke: "currentColor",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          })
                        ])),
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus persediaan pembelian ini ? "),
                        createVNode("button", {
                          onClick: hapusData,
                          type: "button",
                          class: "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                        }, " Ya, saya yakin "),
                        createVNode("button", {
                          onClick: closeModalDelete,
                          type: "button",
                          class: "py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }, " Tidak, batalkan ")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col gap-4" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, "Data Pembelian Persediaan"),
                      createVNode("p", { class: "text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Kelola data pembelian persediaan produk")
                    ]),
                    createVNode("div", null, [
                      unref(hasPermission)("inventory-purchase: create") ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: _ctx.route("inventoryPurchases.create"),
                        class: "w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800"
                      }, {
                        default: withCtx(() => [
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
                          createTextVNode(" Tambah Pembelian ")
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6" }, [
                    createVNode("div", { class: "flex flex-col gap-4" }, [
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-3" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" }, "Pencarian"),
                          createVNode("div", { class: "relative" }, [
                            createVNode("div", { class: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-5 h-5 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                })
                              ]))
                            ]),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : search = $event,
                              type: "text",
                              class: "block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                              placeholder: "Cari nomor faktur, tanggal, atau supplier..."
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(search)]
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-end" }, [
                          createVNode("button", {
                            onClick: ($event) => showFilters.value = !showFilters.value,
                            class: "w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
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
                                d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                              })
                            ])),
                            createTextVNode(" Filter "),
                            hasActiveFilters.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"
                            }, "1")) : createCommentVNode("", true)
                          ], 8, ["onClick"])
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" }, [
                  createVNode("div", { class: "bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-100 text-sm font-medium mb-1" }, "Total Pembelian"),
                        createVNode("p", { class: "text-3xl font-bold" }, toDisplayString(((_d = (_c = __props.fetchData) == null ? void 0 : _c.meta) == null ? void 0 : _d.total) || 0), 1)
                      ]),
                      createVNode("div", { class: "bg-white/20 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8",
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
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-blue-100 text-sm font-medium mb-1" }, "Total Harga"),
                        createVNode("p", { class: "text-2xl font-bold" }, toDisplayString(totalHarga.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })), 1)
                      ]),
                      createVNode("div", { class: "bg-white/20 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          })
                        ]))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-purple-100 text-sm font-medium mb-1" }, "Rata-rata per Transaksi"),
                        createVNode("p", { class: "text-2xl font-bold" }, toDisplayString(rataRataTransaksi.value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })), 1)
                      ]),
                      createVNode("div", { class: "bg-white/20 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          })
                        ]))
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto -mx-4 sm:mx-0" }, [
                    createVNode("div", { class: "inline-block min-w-full align-middle" }, [
                      createVNode("table", { class: "min-w-full text-sm text-left text-gray-500 dark:text-gray-400" }, [
                        createVNode("thead", { class: "text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700" }, [
                          createVNode("tr", null, [
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold"
                            }, "NO"),
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold"
                            }, "NOMOR FAKTUR"),
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden sm:table-cell"
                            }, "TANGGAL"),
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden md:table-cell"
                            }, "SUPPLIER"),
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold"
                            }, "TOTAL HARGA"),
                            createVNode("th", {
                              scope: "col",
                              class: "px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center"
                            }, "AKSI")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                            var _a2, _b2;
                            return openBlock(), createBlock("tr", {
                              key: data.id,
                              class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            }, [
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white" }, toDisplayString((__props.fetchData.meta.current_page - 1) * __props.fetchData.meta.per_page + index + 1), 1),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("inventoryPurchases.show", data.id),
                                    class: "font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(data.invoice_number), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1" }, toDisplayString(formatTanggal(data.date)), 1)
                                ])
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell" }, [
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-4 h-4 text-gray-400",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    })
                                  ])),
                                  createTextVNode(" " + toDisplayString(formatTanggal(data.date)), 1)
                                ])
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell" }, [
                                createVNode("span", null, toDisplayString(((_b2 = (_a2 = data.supplier_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2["name"]) || "N/A"), 1)
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("span", { class: "font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base" }, toDisplayString(calculateTotalPrice(data.listData)), 1)
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("div", { class: "flex items-center justify-center gap-1 sm:gap-2" }, [
                                  unref(hasPermission)("inventory-purchase: read") ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => modalLiatData(data),
                                    class: "p-1.5 sm:p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30",
                                    type: "button",
                                    title: "Lihat Detail"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-4 h-4 sm:w-5 sm:h-5",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("inventory-purchase: update") ? (openBlock(), createBlock(unref(Link), {
                                    key: 1,
                                    href: _ctx.route("inventoryPurchases.edit", data.id),
                                    class: "p-1.5 sm:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30",
                                    title: "Edit"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-4 h-4 sm:w-5 sm:h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          "stroke-width": "2",
                                          d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        })
                                      ]))
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])) : createCommentVNode("", true),
                                  unref(hasPermission)("inventory-purchase: delete") ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    onClick: ($event) => modalHapusData(data),
                                    type: "button",
                                    class: "p-1.5 sm:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
                                    title: "Hapus"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-4 h-4 sm:w-5 sm:h-5",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ])
                              ])
                            ]);
                          }), 128)),
                          !__props.fetchData.data || __props.fetchData.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                            createVNode("td", {
                              colspan: "6",
                              class: "px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                            }, [
                              createVNode("div", { class: "flex flex-col items-center justify-center" }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-16 h-16 text-gray-300 dark:text-gray-600 mb-4",
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
                                ])),
                                createVNode("p", { class: "text-lg font-medium" }, "Tidak ada data pembelian persediaan"),
                                createVNode("p", { class: "text-sm" }, "Mulai dengan menambahkan pembelian persediaan baru")
                              ])
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ]),
                  __props.fetchData.meta && __props.fetchData.meta.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4" }, [
                      createVNode("div", { class: "text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left" }, [
                        createTextVNode(" Menampilkan "),
                        createVNode("span", { class: "font-semibold" }, toDisplayString(__props.fetchData.meta.from), 1),
                        createTextVNode(" sampai "),
                        createVNode("span", { class: "font-semibold" }, toDisplayString(__props.fetchData.meta.to), 1),
                        createTextVNode(" dari "),
                        createVNode("span", { class: "font-semibold" }, toDisplayString(__props.fetchData.meta.total), 1),
                        createTextVNode(" data ")
                      ]),
                      createVNode("div", { class: "flex items-center gap-1 sm:gap-2 flex-wrap justify-center" }, [
                        createVNode("button", {
                          onClick: ($event) => isRef(pageNumber) ? pageNumber.value = Math.max(1, __props.fetchData.meta.current_page - 1) : pageNumber = Math.max(1, __props.fetchData.meta.current_page - 1),
                          disabled: __props.fetchData.meta.current_page === 1,
                          class: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        }, [
                          createVNode("span", { class: "hidden sm:inline" }, "Sebelumnya"),
                          createVNode("span", { class: "sm:hidden" }, "‹")
                        ], 8, ["onClick", "disabled"]),
                        (openBlock(true), createBlock(Fragment, null, renderList(Math.min(5, __props.fetchData.meta.last_page), (page) => {
                          return openBlock(), createBlock("button", {
                            key: page,
                            onClick: ($event) => isRef(pageNumber) ? pageNumber.value = page : pageNumber = page,
                            class: [
                              "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg",
                              page === __props.fetchData.meta.current_page ? "text-white bg-blue-600 hover:bg-blue-700" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                            ]
                          }, toDisplayString(page), 11, ["onClick"]);
                        }), 128)),
                        createVNode("button", {
                          onClick: ($event) => isRef(pageNumber) ? pageNumber.value = Math.min(__props.fetchData.meta.last_page, __props.fetchData.meta.current_page + 1) : pageNumber = Math.min(__props.fetchData.meta.last_page, __props.fetchData.meta.current_page + 1),
                          disabled: __props.fetchData.meta.current_page === __props.fetchData.meta.last_page,
                          class: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        }, [
                          createVNode("span", { class: "hidden sm:inline" }, "Selanjutnya"),
                          createVNode("span", { class: "sm:hidden" }, "›")
                        ], 8, ["onClick", "disabled"])
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode(_sfc_main$2, {
                  show: showModalRead.value,
                  onClose: closeModalRead
                }, {
                  default: withCtx(() => {
                    var _a2, _b2, _c2, _d2;
                    return [
                      createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden" }, [
                        createVNode("div", { class: "bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("h3", { class: "text-xl font-bold text-white" }, " Detail Pembelian Persediaan "),
                            createVNode("button", {
                              onClick: closeModalRead,
                              class: "text-white hover:text-gray-200 transition-colors"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-6 h-6",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M6 18L18 6M6 6l12 12"
                                })
                              ]))
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "p-6 max-h-[70vh] overflow-y-auto" }, [
                          createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" }, [
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "ID"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).id), 1)
                            ]),
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Nomor Faktur"),
                              createVNode("p", { class: "text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1" }, toDisplayString(unref(form).invoice_number), 1)
                            ]),
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                            ]),
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Supplier"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(((_b2 = (_a2 = unref(form).supplier_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2["name"]) || "N/A"), 1)
                            ])
                          ]),
                          createVNode("div", { class: "mb-6" }, [
                            createVNode("h4", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-4" }, "Daftar Barang"),
                            createVNode("div", { class: "overflow-x-auto" }, [
                              createVNode("table", { class: "w-full text-sm text-left text-gray-500 dark:text-gray-400" }, [
                                createVNode("thead", { class: "text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700" }, [
                                  createVNode("tr", null, [
                                    createVNode("th", {
                                      scope: "col",
                                      class: "px-4 py-3"
                                    }, "No"),
                                    createVNode("th", {
                                      scope: "col",
                                      class: "px-4 py-3"
                                    }, "Nama Barang"),
                                    createVNode("th", {
                                      scope: "col",
                                      class: "px-4 py-3"
                                    }, "Harga"),
                                    createVNode("th", {
                                      scope: "col",
                                      class: "px-4 py-3 text-center"
                                    }, "Jumlah"),
                                    createVNode("th", {
                                      scope: "col",
                                      class: "px-4 py-3 text-right"
                                    }, "Total")
                                  ])
                                ]),
                                createVNode("tbody", null, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                    var _a3;
                                    return openBlock(), createBlock("tr", {
                                      key: list.id,
                                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    }, [
                                      createVNode("td", { class: "px-4 py-3 font-medium text-gray-900 dark:text-white" }, toDisplayString(index + 1), 1),
                                      createVNode("td", { class: "px-4 py-3" }, toDisplayString(((_a3 = list.product) == null ? void 0 : _a3.product_name) || "N/A"), 1),
                                      createVNode("td", { class: "px-4 py-3" }, toDisplayString(formatRupiah(list.price)), 1),
                                      createVNode("td", { class: "px-4 py-3 text-center" }, toDisplayString(list.quantity), 1),
                                      createVNode("td", { class: "px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400" }, toDisplayString(formatRupiah(list.total_price)), 1)
                                    ]);
                                  }), 128))
                                ])
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white" }, [
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("span", { class: "text-lg font-semibold" }, "Total Harga"),
                              createVNode("span", { class: "text-2xl font-bold" }, toDisplayString(calculateTotalPrice(unref(form).listData)), 1)
                            ])
                          ]),
                          createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" }, [
                            createVNode("div", null, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Diubah Oleh"),
                              createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(((_d2 = (_c2 = unref(form).last_update) == null ? void 0 : _c2.user) == null ? void 0 : _d2.name) || "N/A"), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal Dibuat"),
                              createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).created_at || "N/A"), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal Diubah"),
                              createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white mt-1" }, toDisplayString(unref(form).updated_at || "N/A"), 1)
                            ])
                          ])
                        ])
                      ])
                    ];
                  }),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$2, {
                  show: showModalDelete.value,
                  onClose: closeModalDelete
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "p-4 md:p-5 text-center" }, [
                        (openBlock(), createBlock("svg", {
                          class: "mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200",
                          "aria-hidden": "true",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            stroke: "currentColor",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          })
                        ])),
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus persediaan pembelian ini ? "),
                        createVNode("button", {
                          onClick: hapusData,
                          type: "button",
                          class: "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                        }, " Ya, saya yakin "),
                        createVNode("button", {
                          onClick: closeModalDelete,
                          type: "button",
                          class: "py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }, " Tidak, batalkan ")
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["show"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/InventoryPurchases/IndexInventoryPurchase.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
