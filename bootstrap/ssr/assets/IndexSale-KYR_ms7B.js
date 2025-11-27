import { ref, computed, watch, unref, withCtx, createBlock, createVNode, openBlock, isRef, toDisplayString, Fragment, renderList, createCommentVNode, withDirectives, vModelText, createTextVNode, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1, u as usePermission } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, usePage, router, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$3 } from "./Modal-BsYluhuH.js";
import "./InputError-fLcttu_2.js";
import { _ as _sfc_main$2 } from "./TextInput-CNvSDFvn.js";
import VueMultiselect from "vue-multiselect";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "IndexSale",
  __ssrInlineRender: true,
  props: ["fetchData", "branches", "technicians", "selectedBranch", "selectedStartDate", "selectedEndDate", "selectedTechnician"],
  setup(__props) {
    const props = __props;
    const form = useForm({
      id: "",
      invoice_number: "",
      date: "",
      management_structure_id: "",
      listData: "",
      last_update: "",
      created_at: "",
      updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search || "");
    let pageNumber = ref(1);
    let selectBranch = ref(props.selectedBranch ? { id: props.selectedBranch } : null);
    let selectStartDate = ref(props.selectedStartDate || "");
    let selectEndDate = ref(props.selectedEndDate || "");
    let selectTechnician = ref(props.selectedTechnician ? { id: props.selectedTechnician } : null);
    let showFilters = ref(false);
    const filterUrl = computed(() => {
      let url = new URL(route("sales.index"));
      url.searchParams.append("page", pageNumber.value);
      if (search.value) {
        url.searchParams.append("search", search.value);
      }
      if (selectBranch.value) {
        url.searchParams.append("branch", selectBranch.value.id);
      }
      if (selectStartDate.value) {
        url.searchParams.append("start_date", selectStartDate.value);
      }
      if (selectEndDate.value) {
        url.searchParams.append("end_date", selectEndDate.value);
      }
      if (selectTechnician.value) {
        url.searchParams.append("technician", selectTechnician.value.id);
      }
      return url;
    });
    watch(() => filterUrl.value, (updatedFilterUrl) => {
      router.visit(updatedFilterUrl, {
        preserveScroll: true,
        preserveState: true,
        replace: true
      });
    });
    watch(() => {
      var _a, _b;
      return (_b = (_a = usePage().props.fetchData) == null ? void 0 : _a.meta) == null ? void 0 : _b.current_page;
    }, (newPage) => {
      if (newPage) {
        pageNumber.value = newPage;
      }
    });
    const clearFilters = () => {
      selectBranch.value = null;
      selectStartDate.value = "";
      selectEndDate.value = "";
      selectTechnician.value = null;
      search.value = "";
      pageNumber.value = 1;
    };
    const showModalRead = ref(false);
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
      form.management_structure_id = data.management_structure_id;
      form.listData = data.listData;
      form.last_update = data.last_update;
      form.created_at = data.created_at;
      form.updated_at = data.updated_at;
    };
    const hapusData = () => {
      form.delete(route("sales.destroy", form.id), {
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
    function formatRupiah(value) {
      if (!value) return "Rp 0";
      return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const hasActiveFilters = computed(() => {
      return selectBranch.value || selectStartDate.value || selectEndDate.value || selectTechnician.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Penjualan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col gap-4"${_scopeId}><div${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Data Penjualan</h1><p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Kelola data penjualan produk</p></div><div${_scopeId}>`);
            if (unref(hasPermission)("sale: create")) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("sales.create"),
                class: "w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId2}></path></svg><span class="hidden sm:inline"${_scopeId2}>Tambah Penjualan</span><span class="sm:hidden"${_scopeId2}>Tambah</span>`);
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
                      createVNode("span", { class: "hidden sm:inline" }, "Tambah Penjualan"),
                      createVNode("span", { class: "sm:hidden" }, "Tambah")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"${_scopeId}><div class="flex flex-col gap-4"${_scopeId}><div class="flex flex-col sm:flex-row gap-3"${_scopeId}><div class="flex-1"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"${_scopeId}>Pencarian</label><div class="relative"${_scopeId}><div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"${_scopeId}><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(search))} type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cari nomor faktur, tanggal, atau teknisi..."${_scopeId}></div></div><div class="flex items-end"${_scopeId}><button class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"${_scopeId}></path></svg> Filter `);
            if (hasActiveFilters.value) {
              _push2(`<span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"${_scopeId}>${ssrInterpolate([unref(selectBranch), unref(selectStartDate), unref(selectEndDate), unref(selectTechnician)].filter((f) => f).length)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button></div></div><div style="${ssrRenderStyle(unref(showFilters) ? null : { display: "none" })}" class="pt-4 border-t border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex flex-wrap gap-4"${_scopeId}><div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Cabang</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(selectBranch),
              "onUpdate:modelValue": ($event) => isRef(selectBranch) ? selectBranch.value = $event : selectBranch = $event,
              options: __props.branches,
              "close-on-select": true,
              placeholder: "Semua Cabang",
              label: "branch_name",
              "track-by": "id",
              clearable: true
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Dari Tanggal</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "startDate",
              type: "date",
              class: "block w-full",
              modelValue: unref(selectStartDate),
              "onUpdate:modelValue": ($event) => isRef(selectStartDate) ? selectStartDate.value = $event : selectStartDate = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Sampai Tanggal</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "endDate",
              type: "date",
              class: "block w-full",
              modelValue: unref(selectEndDate),
              "onUpdate:modelValue": ($event) => isRef(selectEndDate) ? selectEndDate.value = $event : selectEndDate = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Teknisi</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(selectTechnician),
              "onUpdate:modelValue": ($event) => isRef(selectTechnician) ? selectTechnician.value = $event : selectTechnician = $event,
              options: __props.technicians,
              "close-on-select": true,
              placeholder: "Semua Teknisi",
              label: "label",
              "track-by": "id",
              clearable: true
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="mt-4 flex justify-end"${_scopeId}><button class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"${_scopeId}><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg> Hapus Filter </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"${_scopeId}><div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-green-100 text-sm font-medium mb-1"${_scopeId}>Total Penjualan</p><p class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(((_b = (_a = __props.fetchData) == null ? void 0 : _a.meta) == null ? void 0 : _b.total) || 0)}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div></div></div><div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-blue-100 text-sm font-medium mb-1"${_scopeId}>Total Omzet</p><p class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(((_d = (_c = __props.fetchData) == null ? void 0 : _c.data) == null ? void 0 : _d.reduce((sum, sale) => {
              var _a2;
              return sum + (((_a2 = sale.listData) == null ? void 0 : _a2.reduce((s, item) => s + parseInt(item.total_price || 0), 0)) || 0);
            }, 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })) || "Rp 0")}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg></div></div></div><div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-purple-100 text-sm font-medium mb-1"${_scopeId}>Rata-rata per Transaksi</p><p class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(((_f = (_e = __props.fetchData) == null ? void 0 : _e.data) == null ? void 0 : _f.length) > 0 ? (__props.fetchData.data.reduce((sum, sale) => {
              var _a2;
              return sum + (((_a2 = sale.listData) == null ? void 0 : _a2.reduce((s, item) => s + parseInt(item.total_price || 0), 0)) || 0);
            }, 0) / __props.fetchData.data.length).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : "Rp 0")}</p></div><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId}></path></svg></div></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"${_scopeId}><div class="overflow-x-auto -mx-4 sm:mx-0"${_scopeId}><div class="inline-block min-w-full align-middle"${_scopeId}><table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"${_scopeId}><thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700"${_scopeId}><tr${_scopeId}><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>NO</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>NOMOR FAKTUR</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden sm:table-cell"${_scopeId}>TANGGAL</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden md:table-cell"${_scopeId}>TEKNISI</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold"${_scopeId}>TOTAL HARGA</th><th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center"${_scopeId}>AKSI</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.fetchData.data, (data, index) => {
              var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
              _push2(`<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"${_scopeId}><td class="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate((__props.fetchData.meta.current_page - 1) * __props.fetchData.meta.per_page + index + 1)}</td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><div class="flex flex-col"${_scopeId}><span class="font-bold text-blue-600 dark:text-blue-400"${_scopeId}>${ssrInterpolate(data.invoice_number)}</span><span class="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1"${_scopeId}>${ssrInterpolate(formatTanggal(data.date))}</span></div></td><td class="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg> ${ssrInterpolate(formatTanggal(data.date))}</div></td><td class="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"${_scopeId}><span class="text-xs font-semibold text-blue-600 dark:text-blue-400"${_scopeId}>${ssrInterpolate(((_e2 = (_d2 = (_c2 = (_b2 = (_a2 = data.management_structure_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.employee_id) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.name) == null ? void 0 : _e2.charAt(0)) || "T")}</span></div><span${_scopeId}>${ssrInterpolate(((_i2 = (_h2 = (_g2 = (_f2 = data.management_structure_id) == null ? void 0 : _f2[0]) == null ? void 0 : _g2.employee_id) == null ? void 0 : _h2[0]) == null ? void 0 : _i2.name) || "N/A")}</span></div></td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><span class="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base"${_scopeId}>${ssrInterpolate(calculateTotalPrice(data.listData))}</span></td><td class="px-3 sm:px-6 py-3 sm:py-4"${_scopeId}><div class="flex items-center justify-center gap-1 sm:gap-2"${_scopeId}>`);
              if (unref(hasPermission)("sale: read")) {
                _push2(`<button class="p-1.5 sm:p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30" type="button" title="Lihat Detail"${_scopeId}><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId}></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.fetchData.data || __props.fetchData.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400"${_scopeId}><div class="flex flex-col items-center justify-center"${_scopeId}><svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><p class="text-lg font-medium"${_scopeId}>Tidak ada data penjualan</p><p class="text-sm"${_scopeId}>Mulai dengan menambahkan penjualan baru</p></div></td></tr>`);
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
            _push2(ssrRenderComponent(_sfc_main$3, {
              show: showModalRead.value,
              onClose: closeModalRead
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2;
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden"${_scopeId2}><div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700"${_scopeId2}><h3 class="text-xl font-bold text-white"${_scopeId2}> Detail Penjualan </h3><button class="text-white hover:text-gray-200 transition-colors"${_scopeId2}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId2}></path></svg></button></div><div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"${_scopeId2}><div class="space-y-6"${_scopeId2}><div class="grid grid-cols-2 gap-4"${_scopeId2}><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId2}>Nomor Faktur</p><p class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(unref(form).invoice_number)}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId2}>Tanggal</p><p class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(formatTanggal(unref(form).date))}</p></div></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId2}><p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId2}>Teknisi</p><p class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(((_d2 = (_c2 = (_b2 = (_a2 = unref(form).management_structure_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.employee_id) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.name) || "N/A")}</p></div><div${_scopeId2}><p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"${_scopeId2}>Daftar Barang</p><div class="overflow-x-auto"${_scopeId2}><table class="w-full text-sm text-left border-collapse"${_scopeId2}><thead${_scopeId2}><tr class="bg-blue-50 dark:bg-blue-900/20"${_scopeId2}><th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300"${_scopeId2}>No</th><th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300"${_scopeId2}>Nama Barang</th><th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right"${_scopeId2}>Harga</th><th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-center"${_scopeId2}>Jumlah</th><th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right"${_scopeId2}>Total</th></tr></thead><tbody${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(form).listData, (list, index) => {
                    var _a3, _b3;
                    _push3(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-700"${_scopeId2}><td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-center"${_scopeId2}>${ssrInterpolate(index + 1)}</td><td class="px-4 py-3 border border-gray-200 dark:border-gray-700"${_scopeId2}>${ssrInterpolate(((_b3 = (_a3 = list.branch_product) == null ? void 0 : _a3.product) == null ? void 0 : _b3.product_name) || "N/A")}</td><td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right"${_scopeId2}>${ssrInterpolate(formatRupiah(list.price))}</td><td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-center"${_scopeId2}>${ssrInterpolate(list.quantity)}</td><td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-semibold"${_scopeId2}>${ssrInterpolate(formatRupiah(list.total_price))}</td></tr>`);
                  });
                  _push3(`<!--]--></tbody><tfoot${_scopeId2}><tr class="bg-green-50 dark:bg-green-900/20"${_scopeId2}><td colspan="4" class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-gray-900 dark:text-white"${_scopeId2}> TOTAL HARGA </td><td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-green-600 dark:text-green-400 text-lg"${_scopeId2}>${ssrInterpolate(calculateTotalPrice(unref(form).listData))}</td></tr></tfoot></table></div></div><div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"${_scopeId2}><div${_scopeId2}><p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId2}>Dibuat</p><p class="text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(unref(form).created_at)}</p></div><div${_scopeId2}><p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId2}>Diubah oleh</p><p class="text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(((_f2 = (_e2 = unref(form).last_update) == null ? void 0 : _e2.user) == null ? void 0 : _f2.name) || "N/A")}</p></div></div></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden" }, [
                      createVNode("div", { class: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700" }, [
                        createVNode("h3", { class: "text-xl font-bold text-white" }, " Detail Penjualan "),
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
                      ]),
                      createVNode("div", { class: "p-6 overflow-y-auto max-h-[calc(90vh-120px)]" }, [
                        createVNode("div", { class: "space-y-6" }, [
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Nomor Faktur"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(unref(form).invoice_number), 1)
                            ]),
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Tanggal"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                            ])
                          ]),
                          createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                            createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Teknisi"),
                            createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(((_j2 = (_i2 = (_h2 = (_g2 = unref(form).management_structure_id) == null ? void 0 : _g2[0]) == null ? void 0 : _h2.employee_id) == null ? void 0 : _i2[0]) == null ? void 0 : _j2.name) || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" }, "Daftar Barang"),
                            createVNode("div", { class: "overflow-x-auto" }, [
                              createVNode("table", { class: "w-full text-sm text-left border-collapse" }, [
                                createVNode("thead", null, [
                                  createVNode("tr", { class: "bg-blue-50 dark:bg-blue-900/20" }, [
                                    createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300" }, "No"),
                                    createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300" }, "Nama Barang"),
                                    createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right" }, "Harga"),
                                    createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-center" }, "Jumlah"),
                                    createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right" }, "Total")
                                  ])
                                ]),
                                createVNode("tbody", null, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                    var _a3, _b3;
                                    return openBlock(), createBlock("tr", {
                                      key: list.id,
                                      class: "hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }, [
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-center" }, toDisplayString(index + 1), 1),
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700" }, toDisplayString(((_b3 = (_a3 = list.branch_product) == null ? void 0 : _a3.product) == null ? void 0 : _b3.product_name) || "N/A"), 1),
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right" }, toDisplayString(formatRupiah(list.price)), 1),
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-center" }, toDisplayString(list.quantity), 1),
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-semibold" }, toDisplayString(formatRupiah(list.total_price)), 1)
                                    ]);
                                  }), 128))
                                ]),
                                createVNode("tfoot", null, [
                                  createVNode("tr", { class: "bg-green-50 dark:bg-green-900/20" }, [
                                    createVNode("td", {
                                      colspan: "4",
                                      class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-gray-900 dark:text-white"
                                    }, " TOTAL HARGA "),
                                    createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-green-600 dark:text-green-400 text-lg" }, toDisplayString(calculateTotalPrice(unref(form).listData)), 1)
                                  ])
                                ])
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700" }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Dibuat"),
                              createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(form).created_at), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Diubah oleh"),
                              createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(((_l2 = (_k2 = unref(form).last_update) == null ? void 0 : _k2.user) == null ? void 0 : _l2.name) || "N/A"), 1)
                            ])
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              show: showModalDelete.value,
              onClose: closeModalDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-md bg-white rounded-xl shadow-xl dark:bg-gray-800"${_scopeId2}><div class="p-6 text-center"${_scopeId2}><div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"${_scopeId2}><svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"${_scopeId2}></path></svg></div><h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white"${_scopeId2}> Konfirmasi Hapus </h3><p class="mb-6 text-sm text-gray-500 dark:text-gray-400"${_scopeId2}> Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan. </p><div class="flex items-center justify-center gap-3"${_scopeId2}><button class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"${_scopeId2}> Batal </button><button class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"${_scopeId2}> Ya, Hapus </button></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-md bg-white rounded-xl shadow-xl dark:bg-gray-800" }, [
                      createVNode("div", { class: "p-6 text-center" }, [
                        createVNode("div", { class: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4" }, [
                          (openBlock(), createBlock("svg", {
                            class: "h-8 w-8 text-red-600 dark:text-red-400",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            })
                          ]))
                        ]),
                        createVNode("h3", { class: "mb-4 text-lg font-semibold text-gray-900 dark:text-white" }, " Konfirmasi Hapus "),
                        createVNode("p", { class: "mb-6 text-sm text-gray-500 dark:text-gray-400" }, " Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan. "),
                        createVNode("div", { class: "flex items-center justify-center gap-3" }, [
                          createVNode("button", {
                            onClick: closeModalDelete,
                            class: "px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          }, " Batal "),
                          createVNode("button", {
                            onClick: hapusData,
                            class: "px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                          }, " Ya, Hapus ")
                        ])
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
                  createVNode("div", null, [
                    createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, "Data Penjualan"),
                        createVNode("p", { class: "text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Kelola data penjualan produk")
                      ]),
                      createVNode("div", null, [
                        unref(hasPermission)("sale: create") ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: _ctx.route("sales.create"),
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
                            createVNode("span", { class: "hidden sm:inline" }, "Tambah Penjualan"),
                            createVNode("span", { class: "sm:hidden" }, "Tambah")
                          ]),
                          _: 1
                        }, 8, ["href"])) : createCommentVNode("", true)
                      ])
                    ])
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
                            placeholder: "Cari nomor faktur, tanggal, atau teknisi..."
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(search)]
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-end" }, [
                        createVNode("button", {
                          onClick: ($event) => isRef(showFilters) ? showFilters.value = !unref(showFilters) : showFilters = !unref(showFilters),
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
                          }, toDisplayString([unref(selectBranch), unref(selectStartDate), unref(selectEndDate), unref(selectTechnician)].filter((f) => f).length), 1)) : createCommentVNode("", true)
                        ], 8, ["onClick"])
                      ])
                    ]),
                    withDirectives(createVNode("div", { class: "pt-4 border-t border-gray-200 dark:border-gray-700" }, [
                      createVNode("div", { class: "flex flex-wrap gap-4" }, [
                        createVNode("div", { class: "flex flex-col flex-1 min-w-[200px] max-w-full" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Cabang"),
                          createVNode("div", { class: "flex-shrink-0" }, [
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(selectBranch),
                              "onUpdate:modelValue": ($event) => isRef(selectBranch) ? selectBranch.value = $event : selectBranch = $event,
                              options: __props.branches,
                              "close-on-select": true,
                              placeholder: "Semua Cabang",
                              label: "branch_name",
                              "track-by": "id",
                              clearable: true
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col flex-1 min-w-[200px] max-w-full" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Dari Tanggal"),
                          createVNode("div", { class: "flex-shrink-0" }, [
                            createVNode(_sfc_main$2, {
                              id: "startDate",
                              type: "date",
                              class: "block w-full",
                              modelValue: unref(selectStartDate),
                              "onUpdate:modelValue": ($event) => isRef(selectStartDate) ? selectStartDate.value = $event : selectStartDate = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col flex-1 min-w-[200px] max-w-full" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Sampai Tanggal"),
                          createVNode("div", { class: "flex-shrink-0" }, [
                            createVNode(_sfc_main$2, {
                              id: "endDate",
                              type: "date",
                              class: "block w-full",
                              modelValue: unref(selectEndDate),
                              "onUpdate:modelValue": ($event) => isRef(selectEndDate) ? selectEndDate.value = $event : selectEndDate = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col flex-1 min-w-[200px] max-w-full" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Teknisi"),
                          createVNode("div", { class: "flex-shrink-0" }, [
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(selectTechnician),
                              "onUpdate:modelValue": ($event) => isRef(selectTechnician) ? selectTechnician.value = $event : selectTechnician = $event,
                              options: __props.technicians,
                              "close-on-select": true,
                              placeholder: "Semua Teknisi",
                              label: "label",
                              "track-by": "id",
                              clearable: true
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                          ])
                        ])
                      ]),
                      hasActiveFilters.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-4 flex justify-end"
                      }, [
                        createVNode("button", {
                          onClick: clearFilters,
                          class: "w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-2",
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
                          ])),
                          createTextVNode(" Hapus Filter ")
                        ])
                      ])) : createCommentVNode("", true)
                    ], 512), [
                      [vShow, unref(showFilters)]
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" }, [
                  createVNode("div", { class: "bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-100 text-sm font-medium mb-1" }, "Total Penjualan"),
                        createVNode("p", { class: "text-3xl font-bold" }, toDisplayString(((_h = (_g = __props.fetchData) == null ? void 0 : _g.meta) == null ? void 0 : _h.total) || 0), 1)
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
                        createVNode("p", { class: "text-blue-100 text-sm font-medium mb-1" }, "Total Omzet"),
                        createVNode("p", { class: "text-2xl font-bold" }, toDisplayString(((_j = (_i = __props.fetchData) == null ? void 0 : _i.data) == null ? void 0 : _j.reduce((sum, sale) => {
                          var _a2;
                          return sum + (((_a2 = sale.listData) == null ? void 0 : _a2.reduce((s, item) => s + parseInt(item.total_price || 0), 0)) || 0);
                        }, 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })) || "Rp 0"), 1)
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
                        createVNode("p", { class: "text-2xl font-bold" }, toDisplayString(((_l = (_k = __props.fetchData) == null ? void 0 : _k.data) == null ? void 0 : _l.length) > 0 ? (__props.fetchData.data.reduce((sum, sale) => {
                          var _a2;
                          return sum + (((_a2 = sale.listData) == null ? void 0 : _a2.reduce((s, item) => s + parseInt(item.total_price || 0), 0)) || 0);
                        }, 0) / __props.fetchData.data.length).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : "Rp 0"), 1)
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
                            }, "TEKNISI"),
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
                            var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
                            return openBlock(), createBlock("tr", {
                              key: data.id,
                              class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            }, [
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white" }, toDisplayString((__props.fetchData.meta.current_page - 1) * __props.fetchData.meta.per_page + index + 1), 1),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode("span", { class: "font-bold text-blue-600 dark:text-blue-400" }, toDisplayString(data.invoice_number), 1),
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
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  createVNode("div", { class: "w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center" }, [
                                    createVNode("span", { class: "text-xs font-semibold text-blue-600 dark:text-blue-400" }, toDisplayString(((_e2 = (_d2 = (_c2 = (_b2 = (_a2 = data.management_structure_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.employee_id) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.name) == null ? void 0 : _e2.charAt(0)) || "T"), 1)
                                  ]),
                                  createVNode("span", null, toDisplayString(((_i2 = (_h2 = (_g2 = (_f2 = data.management_structure_id) == null ? void 0 : _f2[0]) == null ? void 0 : _g2.employee_id) == null ? void 0 : _h2[0]) == null ? void 0 : _i2.name) || "N/A"), 1)
                                ])
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("span", { class: "font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base" }, toDisplayString(calculateTotalPrice(data.listData)), 1)
                              ]),
                              createVNode("td", { class: "px-3 sm:px-6 py-3 sm:py-4" }, [
                                createVNode("div", { class: "flex items-center justify-center gap-1 sm:gap-2" }, [
                                  unref(hasPermission)("sale: read") ? (openBlock(), createBlock("button", {
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
                                createVNode("p", { class: "text-lg font-medium" }, "Tidak ada data penjualan"),
                                createVNode("p", { class: "text-sm" }, "Mulai dengan menambahkan penjualan baru")
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
                createVNode(_sfc_main$3, {
                  show: showModalRead.value,
                  onClose: closeModalRead
                }, {
                  default: withCtx(() => {
                    var _a2, _b2, _c2, _d2, _e2, _f2;
                    return [
                      createVNode("div", { class: "relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden" }, [
                        createVNode("div", { class: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700" }, [
                          createVNode("h3", { class: "text-xl font-bold text-white" }, " Detail Penjualan "),
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
                        ]),
                        createVNode("div", { class: "p-6 overflow-y-auto max-h-[calc(90vh-120px)]" }, [
                          createVNode("div", { class: "space-y-6" }, [
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Nomor Faktur"),
                                createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(unref(form).invoice_number), 1)
                              ]),
                              createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Tanggal"),
                                createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                              ])
                            ]),
                            createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Teknisi"),
                              createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(((_d2 = (_c2 = (_b2 = (_a2 = unref(form).management_structure_id) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.employee_id) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.name) || "N/A"), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" }, "Daftar Barang"),
                              createVNode("div", { class: "overflow-x-auto" }, [
                                createVNode("table", { class: "w-full text-sm text-left border-collapse" }, [
                                  createVNode("thead", null, [
                                    createVNode("tr", { class: "bg-blue-50 dark:bg-blue-900/20" }, [
                                      createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300" }, "No"),
                                      createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300" }, "Nama Barang"),
                                      createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right" }, "Harga"),
                                      createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-center" }, "Jumlah"),
                                      createVNode("th", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right" }, "Total")
                                    ])
                                  ]),
                                  createVNode("tbody", null, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                      var _a3, _b3;
                                      return openBlock(), createBlock("tr", {
                                        key: list.id,
                                        class: "hover:bg-gray-50 dark:hover:bg-gray-700"
                                      }, [
                                        createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-center" }, toDisplayString(index + 1), 1),
                                        createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700" }, toDisplayString(((_b3 = (_a3 = list.branch_product) == null ? void 0 : _a3.product) == null ? void 0 : _b3.product_name) || "N/A"), 1),
                                        createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right" }, toDisplayString(formatRupiah(list.price)), 1),
                                        createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-center" }, toDisplayString(list.quantity), 1),
                                        createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-semibold" }, toDisplayString(formatRupiah(list.total_price)), 1)
                                      ]);
                                    }), 128))
                                  ]),
                                  createVNode("tfoot", null, [
                                    createVNode("tr", { class: "bg-green-50 dark:bg-green-900/20" }, [
                                      createVNode("td", {
                                        colspan: "4",
                                        class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-gray-900 dark:text-white"
                                      }, " TOTAL HARGA "),
                                      createVNode("td", { class: "px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-green-600 dark:text-green-400 text-lg" }, toDisplayString(calculateTotalPrice(unref(form).listData)), 1)
                                    ])
                                  ])
                                ])
                              ])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Dibuat"),
                                createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(form).created_at), 1)
                              ]),
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Diubah oleh"),
                                createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(((_f2 = (_e2 = unref(form).last_update) == null ? void 0 : _e2.user) == null ? void 0 : _f2.name) || "N/A"), 1)
                              ])
                            ])
                          ])
                        ])
                      ])
                    ];
                  }),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$3, {
                  show: showModalDelete.value,
                  onClose: closeModalDelete
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-md bg-white rounded-xl shadow-xl dark:bg-gray-800" }, [
                      createVNode("div", { class: "p-6 text-center" }, [
                        createVNode("div", { class: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4" }, [
                          (openBlock(), createBlock("svg", {
                            class: "h-8 w-8 text-red-600 dark:text-red-400",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            })
                          ]))
                        ]),
                        createVNode("h3", { class: "mb-4 text-lg font-semibold text-gray-900 dark:text-white" }, " Konfirmasi Hapus "),
                        createVNode("p", { class: "mb-6 text-sm text-gray-500 dark:text-gray-400" }, " Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan. "),
                        createVNode("div", { class: "flex items-center justify-center gap-3" }, [
                          createVNode("button", {
                            onClick: closeModalDelete,
                            class: "px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          }, " Batal "),
                          createVNode("button", {
                            onClick: hapusData,
                            class: "px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                          }, " Ya, Hapus ")
                        ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/Sales/IndexSale.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
