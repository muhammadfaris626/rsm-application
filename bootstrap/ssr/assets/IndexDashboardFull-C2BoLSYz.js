import { ref, computed, watch, onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, withDirectives, createTextVNode, openBlock, toDisplayString, vShow, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { router, Head } from "@inertiajs/vue3";
import VueMultiselect from "vue-multiselect";
import { _ as _sfc_main$2 } from "./TextInput-CNvSDFvn.js";
import VueApexCharts from "vue3-apexcharts";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "IndexDashboardFull",
  __ssrInlineRender: true,
  props: ["branches", "sales", "employeeActive", "branchActive", "expenditures", "profile", "userRoleVisitor", "recentSales", "recentOrders", "topProducts", "monthlyStats"],
  setup(__props) {
    const props = __props;
    const selectBranch = ref(""), selectStartDate = ref(""), selectEndDate = ref("");
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
    const showFilters = ref(false);
    const hasActiveFilters = computed(() => {
      return selectBranch.value || selectStartDate.value || selectEndDate.value;
    });
    const clearFilters = () => {
      selectBranch.value = "";
      selectStartDate.value = "";
      selectEndDate.value = "";
    };
    const filterUrl = computed(() => {
      let url = new URL(route("dashboard"));
      if (optionBranch.value) {
        url.searchParams.append("branch", optionBranch.value.id);
      }
      if (optionStartDate.value && optionEndDate.value) {
        url.searchParams.append("start_date", optionStartDate.value);
        url.searchParams.append("end_date", optionEndDate.value);
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
    onMounted(() => {
      if (window.location.search) {
        router.visit(route("dashboard"), {
          replace: true
        });
      }
    });
    function formatRupiah(value) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    }
    const totalOmzet = computed(() => {
      return (props.sales || []).reduce((sum, item) => sum + Number(item.total_price || 0), 0);
    });
    const totalPengeluaran = computed(() => {
      return (props.expenditures || []).reduce((sum, item) => sum + Number(item.total_cost || 0), 0);
    });
    const profit = computed(() => {
      return totalOmzet.value - totalPengeluaran.value;
    });
    const profitPercentage = computed(() => {
      if (totalOmzet.value === 0) return 0;
      return (profit.value / totalOmzet.value * 100).toFixed(1);
    });
    const revenueExpenseChart = computed(() => {
      const salesData = props.sales || [];
      const expenseData = props.expenditures || [];
      const salesByDate = {};
      salesData.forEach((sale) => {
        const date = new Date(sale.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        salesByDate[date] = (salesByDate[date] || 0) + Number(sale.total_price || 0);
      });
      const expensesByDate = {};
      expenseData.forEach((exp) => {
        const date = new Date(exp.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        expensesByDate[date] = (expensesByDate[date] || 0) + Number(exp.total_cost || 0);
      });
      const dates = [.../* @__PURE__ */ new Set([...Object.keys(salesByDate), ...Object.keys(expensesByDate)])].sort();
      return {
        series: [{
          name: "Omzet",
          data: dates.map((date) => salesByDate[date] || 0)
        }, {
          name: "Pengeluaran",
          data: dates.map((date) => expensesByDate[date] || 0)
        }],
        chartOptions: {
          chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false }
          },
          dataLabels: { enabled: false },
          stroke: {
            curve: "smooth",
            width: 3
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3
            }
          },
          colors: ["#10b981", "#ef4444"],
          xaxis: {
            categories: dates
          },
          legend: {
            position: "top"
          },
          grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 3
          }
        }
      };
    });
    const profitChart = computed(() => {
      return {
        series: [totalOmzet.value, totalPengeluaran.value],
        chartOptions: {
          chart: {
            type: "donut",
            height: 300
          },
          labels: ["Omzet", "Pengeluaran"],
          colors: ["#10b981", "#ef4444"],
          legend: {
            position: "bottom"
          },
          dataLabels: {
            enabled: true,
            formatter: function(val) {
              return val.toFixed(1) + "%";
            }
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Beranda" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col gap-4"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Dashboard</h1><p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p></div><div class="flex items-center justify-end"${_scopeId}><button class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"${_scopeId}></path></svg> Filter `);
            if (hasActiveFilters.value) {
              _push2(`<span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"${_scopeId}>${ssrInterpolate([selectBranch.value, selectStartDate.value, selectEndDate.value].filter((f) => f).length)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button></div></div><div style="${ssrRenderStyle(showFilters.value ? null : { display: "none" })}" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"${_scopeId}><div class="flex flex-wrap gap-4"${_scopeId}>`);
            if (__props.userRoleVisitor != "admin-branch") {
              _push2(`<div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Cabang</label><div class="flex-shrink-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(VueMultiselect), {
                modelValue: selectBranch.value,
                "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                options: __props.branches,
                "close-on-select": true,
                placeholder: "Semua Cabang",
                label: "branch_name",
                "track-by": "id",
                clearable: true
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Dari Tanggal</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "startDate",
              type: "date",
              class: "block w-full",
              modelValue: selectStartDate.value,
              "onUpdate:modelValue": ($event) => selectStartDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col flex-1 min-w-[200px] max-w-full"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"${_scopeId}>Sampai Tanggal</label><div class="flex-shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "endDate",
              type: "date",
              class: "block w-full",
              modelValue: selectEndDate.value,
              "onUpdate:modelValue": ($event) => selectEndDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="mt-4 flex justify-end"${_scopeId}><button class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"${_scopeId}><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg> Hapus Filter </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"${_scopeId}><div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg></div><span class="text-green-100 text-sm font-medium"${_scopeId}>OMZET</span></div><h3 class="text-3xl font-bold mb-1"${_scopeId}>${ssrInterpolate(formatRupiah(totalOmzet.value))}</h3><p class="text-green-100 text-sm"${_scopeId}>Total pendapatan</p></div><div class="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"${_scopeId}></path></svg></div><span class="text-red-100 text-sm font-medium"${_scopeId}>PENGELUARAN</span></div><h3 class="text-3xl font-bold mb-1"${_scopeId}>${ssrInterpolate(formatRupiah(totalPengeluaran.value))}</h3><p class="text-red-100 text-sm"${_scopeId}>Total biaya operasional</p></div><div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"${_scopeId}></path></svg></div><span class="text-blue-100 text-sm font-medium"${_scopeId}>KEUNTUNGAN</span></div><h3 class="text-3xl font-bold mb-1"${_scopeId}>${ssrInterpolate(formatRupiah(profit.value))}</h3><p class="text-blue-100 text-sm"${_scopeId}>${ssrInterpolate(profitPercentage.value)}% dari omzet</p></div><div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="bg-white/20 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"${_scopeId}></path></svg></div><span class="text-purple-100 text-sm font-medium"${_scopeId}>KARYAWAN</span></div><h3 class="text-3xl font-bold mb-1"${_scopeId}>${ssrInterpolate(__props.employeeActive)}</h3><p class="text-purple-100 text-sm"${_scopeId}>Karyawan aktif</p></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-gray-600 dark:text-gray-400 text-sm font-medium"${_scopeId}>Cabang Aktif</p><p class="text-3xl font-bold text-gray-900 dark:text-white mt-2"${_scopeId}>${ssrInterpolate(__props.branchActive)}</p></div><div class="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"${_scopeId}></path></svg></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-gray-600 dark:text-gray-400 text-sm font-medium"${_scopeId}>Rata-rata Transaksi</p><p class="text-3xl font-bold text-gray-900 dark:text-white mt-2"${_scopeId}>${ssrInterpolate(__props.sales && __props.sales.length > 0 ? formatRupiah(totalOmzet.value / __props.sales.length) : formatRupiah(0))}</p></div><div class="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId}></path></svg></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-gray-600 dark:text-gray-400 text-sm font-medium"${_scopeId}>Total Transaksi</p><p class="text-3xl font-bold text-gray-900 dark:text-white mt-2"${_scopeId}>${ssrInterpolate(__props.sales ? __props.sales.length : 0)}</p></div><div class="bg-teal-100 dark:bg-teal-900 rounded-lg p-3"${_scopeId}><svg class="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"${_scopeId}></path></svg></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Omzet vs Pengeluaran</h3><span class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Periode terpilih</span></div>`);
            if (revenueExpenseChart.value.series[0].data.length > 0) {
              _push2(ssrRenderComponent(unref(VueApexCharts), {
                type: "area",
                height: "350",
                options: revenueExpenseChart.value.chartOptions,
                series: revenueExpenseChart.value.series
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="flex items-center justify-center h-64 text-gray-400"${_scopeId}><p${_scopeId}>Tidak ada data untuk ditampilkan</p></div>`);
            }
            _push2(`</div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Komposisi Keuangan</h3><span class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Omzet &amp; Pengeluaran</span></div>`);
            if (totalOmzet.value > 0 || totalPengeluaran.value > 0) {
              _push2(ssrRenderComponent(unref(VueApexCharts), {
                type: "donut",
                height: "350",
                options: profitChart.value.chartOptions,
                series: profitChart.value.series
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="flex items-center justify-center h-64 text-gray-400"${_scopeId}><p${_scopeId}>Tidak ada data untuk ditampilkan</p></div>`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"${_scopeId}><div class="p-6 border-b border-gray-200 dark:border-gray-700"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Penjualan Terbaru</h3></div><div class="p-6"${_scopeId}>`);
            if (__props.recentSales && __props.recentSales.length > 0) {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentSales.slice(0, 5), (sale, index) => {
                _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="bg-green-100 dark:bg-green-900 rounded-lg p-2"${_scopeId}><svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg></div><div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(sale.invoice_number || "N/A")}</p><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(sale.date || "N/A")}</p></div></div><span class="font-semibold text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(formatRupiah(sale.total_price || 0))}</span></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-8 text-gray-400"${_scopeId}><p${_scopeId}>Tidak ada penjualan terbaru</p></div>`);
            }
            _push2(`</div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"${_scopeId}><div class="p-6 border-b border-gray-200 dark:border-gray-700"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Permintaan Pesanan Terbaru</h3></div><div class="p-6"${_scopeId}>`);
            if (__props.recentOrders && __props.recentOrders.length > 0) {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentOrders.slice(0, 5), (order, index) => {
                _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2"${_scopeId}><svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"${_scopeId}></path></svg></div><div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(order.ro_number || "N/A")}</p><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(order.status || "N/A")}</p></div></div><span class="${ssrRenderClass([{
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300": order.status === "Sedang diverifikasi",
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300": order.status === "Selesai",
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300": order.status === "Disetujui",
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300": !order.status
                }, "px-3 py-1 text-xs font-semibold rounded-full"])}"${_scopeId}>${ssrInterpolate(order.status || "Pending")}</span></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-8 text-gray-400"${_scopeId}><p${_scopeId}>Tidak ada permintaan pesanan terbaru</p></div>`);
            }
            _push2(`</div></div></div>`);
            if (__props.profile != null) {
              _push2(`<div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800"${_scopeId}><div class="flex items-start gap-4"${_scopeId}><div class="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3"${_scopeId}><svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"${_scopeId}></path></svg></div><div class="flex-1"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Profil Cabang</h3><p class="text-gray-700 dark:text-gray-300 leading-relaxed"${_scopeId}>${ssrInterpolate(__props.profile.description || "Tidak ada deskripsi")}</p></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col gap-4" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, "Dashboard"),
                      createVNode("p", { class: "text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Selamat datang kembali! Berikut ringkasan aktivitas hari ini.")
                    ]),
                    createVNode("div", { class: "flex items-center justify-end" }, [
                      createVNode("button", {
                        onClick: ($event) => showFilters.value = !showFilters.value,
                        class: "inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
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
                        }, toDisplayString([selectBranch.value, selectStartDate.value, selectEndDate.value].filter((f) => f).length), 1)) : createCommentVNode("", true)
                      ], 8, ["onClick"])
                    ])
                  ]),
                  withDirectives(createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6" }, [
                    createVNode("div", { class: "flex flex-wrap gap-4" }, [
                      __props.userRoleVisitor != "admin-branch" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex flex-col flex-1 min-w-[200px] max-w-full"
                      }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Cabang"),
                        createVNode("div", { class: "flex-shrink-0" }, [
                          createVNode(unref(VueMultiselect), {
                            modelValue: selectBranch.value,
                            "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                            options: __props.branches,
                            "close-on-select": true,
                            placeholder: "Semua Cabang",
                            label: "branch_name",
                            "track-by": "id",
                            clearable: true
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex flex-col flex-1 min-w-[200px] max-w-full" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap" }, "Dari Tanggal"),
                        createVNode("div", { class: "flex-shrink-0" }, [
                          createVNode(_sfc_main$2, {
                            id: "startDate",
                            type: "date",
                            class: "block w-full",
                            modelValue: selectStartDate.value,
                            "onUpdate:modelValue": ($event) => selectStartDate.value = $event
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
                            modelValue: selectEndDate.value,
                            "onUpdate:modelValue": ($event) => selectEndDate.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                    [vShow, showFilters.value]
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, [
                  createVNode("div", { class: "bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
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
                      ]),
                      createVNode("span", { class: "text-green-100 text-sm font-medium" }, "OMZET")
                    ]),
                    createVNode("h3", { class: "text-3xl font-bold mb-1" }, toDisplayString(formatRupiah(totalOmzet.value)), 1),
                    createVNode("p", { class: "text-green-100 text-sm" }, "Total pendapatan")
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
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
                            d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-red-100 text-sm font-medium" }, "PENGELUARAN")
                    ]),
                    createVNode("h3", { class: "text-3xl font-bold mb-1" }, toDisplayString(formatRupiah(totalPengeluaran.value)), 1),
                    createVNode("p", { class: "text-red-100 text-sm" }, "Total biaya operasional")
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
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
                            d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-blue-100 text-sm font-medium" }, "KEUNTUNGAN")
                    ]),
                    createVNode("h3", { class: "text-3xl font-bold mb-1" }, toDisplayString(formatRupiah(profit.value)), 1),
                    createVNode("p", { class: "text-blue-100 text-sm" }, toDisplayString(profitPercentage.value) + "% dari omzet", 1)
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
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
                            d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-purple-100 text-sm font-medium" }, "KARYAWAN")
                    ]),
                    createVNode("h3", { class: "text-3xl font-bold mb-1" }, toDisplayString(__props.employeeActive), 1),
                    createVNode("p", { class: "text-purple-100 text-sm" }, "Karyawan aktif")
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-gray-600 dark:text-gray-400 text-sm font-medium" }, "Cabang Aktif"),
                        createVNode("p", { class: "text-3xl font-bold text-gray-900 dark:text-white mt-2" }, toDisplayString(__props.branchActive), 1)
                      ]),
                      createVNode("div", { class: "bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8 text-indigo-600 dark:text-indigo-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          })
                        ]))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-gray-600 dark:text-gray-400 text-sm font-medium" }, "Rata-rata Transaksi"),
                        createVNode("p", { class: "text-3xl font-bold text-gray-900 dark:text-white mt-2" }, toDisplayString(__props.sales && __props.sales.length > 0 ? formatRupiah(totalOmzet.value / __props.sales.length) : formatRupiah(0)), 1)
                      ]),
                      createVNode("div", { class: "bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8 text-yellow-600 dark:text-yellow-400",
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
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-gray-600 dark:text-gray-400 text-sm font-medium" }, "Total Transaksi"),
                        createVNode("p", { class: "text-3xl font-bold text-gray-900 dark:text-white mt-2" }, toDisplayString(__props.sales ? __props.sales.length : 0), 1)
                      ]),
                      createVNode("div", { class: "bg-teal-100 dark:bg-teal-900 rounded-lg p-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-8 h-8 text-teal-600 dark:text-teal-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          })
                        ]))
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Omzet vs Pengeluaran"),
                      createVNode("span", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Periode terpilih")
                    ]),
                    revenueExpenseChart.value.series[0].data.length > 0 ? (openBlock(), createBlock(unref(VueApexCharts), {
                      key: 0,
                      type: "area",
                      height: "350",
                      options: revenueExpenseChart.value.chartOptions,
                      series: revenueExpenseChart.value.series
                    }, null, 8, ["options", "series"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex items-center justify-center h-64 text-gray-400"
                    }, [
                      createVNode("p", null, "Tidak ada data untuk ditampilkan")
                    ]))
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Komposisi Keuangan"),
                      createVNode("span", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Omzet & Pengeluaran")
                    ]),
                    totalOmzet.value > 0 || totalPengeluaran.value > 0 ? (openBlock(), createBlock(unref(VueApexCharts), {
                      key: 0,
                      type: "donut",
                      height: "350",
                      options: profitChart.value.chartOptions,
                      series: profitChart.value.series
                    }, null, 8, ["options", "series"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex items-center justify-center h-64 text-gray-400"
                    }, [
                      createVNode("p", null, "Tidak ada data untuk ditampilkan")
                    ]))
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "p-6 border-b border-gray-200 dark:border-gray-700" }, [
                      createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Penjualan Terbaru")
                    ]),
                    createVNode("div", { class: "p-6" }, [
                      __props.recentSales && __props.recentSales.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.recentSales.slice(0, 5), (sale, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
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
                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  })
                                ]))
                              ]),
                              createVNode("div", null, [
                                createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(sale.invoice_number || "N/A"), 1),
                                createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(sale.date || "N/A"), 1)
                              ])
                            ]),
                            createVNode("span", { class: "font-semibold text-green-600 dark:text-green-400" }, toDisplayString(formatRupiah(sale.total_price || 0)), 1)
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-8 text-gray-400"
                      }, [
                        createVNode("p", null, "Tidak ada penjualan terbaru")
                      ]))
                    ])
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" }, [
                    createVNode("div", { class: "p-6 border-b border-gray-200 dark:border-gray-700" }, [
                      createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Permintaan Pesanan Terbaru")
                    ]),
                    createVNode("div", { class: "p-6" }, [
                      __props.recentOrders && __props.recentOrders.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.recentOrders.slice(0, 5), (order, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
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
                                    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  })
                                ]))
                              ]),
                              createVNode("div", null, [
                                createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(order.ro_number || "N/A"), 1),
                                createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(order.status || "N/A"), 1)
                              ])
                            ]),
                            createVNode("span", {
                              class: ["px-3 py-1 text-xs font-semibold rounded-full", {
                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300": order.status === "Sedang diverifikasi",
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300": order.status === "Selesai",
                                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300": order.status === "Disetujui",
                                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300": !order.status
                              }]
                            }, toDisplayString(order.status || "Pending"), 3)
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-8 text-gray-400"
                      }, [
                        createVNode("p", null, "Tidak ada permintaan pesanan terbaru")
                      ]))
                    ])
                  ])
                ]),
                __props.profile != null ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800"
                }, [
                  createVNode("div", { class: "flex items-start gap-4" }, [
                    createVNode("div", { class: "bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-6 h-6 text-yellow-600 dark:text-yellow-400",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-2" }, "Profil Cabang"),
                      createVNode("p", { class: "text-gray-700 dark:text-gray-300 leading-relaxed" }, toDisplayString(__props.profile.description || "Tidak ada deskripsi"), 1)
                    ])
                  ])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboards/IndexDashboardFull.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
