import { ref, computed, watch, onMounted, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BIJ2sf7b.js";
import { router, usePage, useForm, Head } from "@inertiajs/vue3";
import VueMultiselect from "vue-multiselect";
import "./InputLabel-KrFFJXFE.js";
import "./InputError-fLcttu_2.js";
import { _ as _sfc_main$2 } from "./TextInput-CNvSDFvn.js";
import VueApexCharts from "vue3-apexcharts";
import { T as Table, a as TableRow, _ as _sfc_main$3, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import "./TablePagination-A5nS3meM.js";
/* empty css                                                                  */
import "flowbite";
import "axios";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IndexReport",
  __ssrInlineRender: true,
  props: ["branches", "sales", "expenditures", "purchases", "orders", "returns", "penjualanTahunan", "topPenjualan", "allData"],
  setup(__props) {
    const selectBranch = ref(""), selectStartDate = ref(""), selectEndDate = ref("");
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
    const filterUrl = computed(() => {
      let url = new URL(route("reports.index"));
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
        router.visit(route("reports.index"), {
          replace: true
        });
      }
    });
    function formatRupiah(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(value);
    }
    const computedPengeluaran = computed(() => usePage().props.expenditures || []);
    const chart1 = computed(() => ({
      chart: {
        height: "100%",
        type: "area",
        zoom: { enabled: false },
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      colors: ["#0E9F6E", "#F05252"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        type: "datetime",
        categories: usePage().props.sales.map((sale) => sale.date),
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      },
      tooltip: { x: { format: "dd/MM/yy HH:mm" } },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px"
              }
            }
          }
        }
      }]
    }));
    const series1 = computed(() => [
      { name: "Omzet", data: usePage().props.sales.map((sale) => sale.total_price) },
      { name: "Pengeluaran", data: computedPengeluaran.value.map((expenditure) => expenditure.total_cost) }
    ]);
    const chart2 = computed(() => ({
      chart: {
        id: "vuechart-example",
        toolbar: {
          show: false
        },
        fontFamily: "inherit",
        spacing: [15, 25, 15, 25],
        // top, right, bottom, left - lebih banyak spacing
        height: "auto"
      },
      colors: ["#6366f1"],
      // Indigo color
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "45%",
          // Kurangi barHeight lebih banyak untuk spacing lebih besar
          borderRadius: 6,
          distributed: false,
          columnWidth: "60%",
          dataLabels: {
            position: "center"
            // Posisi label di tengah bar
          }
        }
      },
      xaxis: {
        categories: usePage().props.topPenjualan.map((item) => item.branch_name),
        labels: {
          style: {
            fontSize: "13px",
            fontWeight: 500,
            colors: "#374151"
          },
          offsetY: 5,
          maxHeight: 120
        },
        axisBorder: {
          show: true,
          color: "#e5e7eb",
          height: 1,
          width: "100%",
          offsetX: 0,
          offsetY: 0
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "13px",
            fontWeight: 600,
            colors: "#1f2937"
          },
          maxWidth: 200,
          offsetX: -5,
          offsetY: 0
        },
        axisBorder: {
          show: true,
          color: "#e5e7eb",
          width: 1
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: "middle",
        style: {
          fontSize: "12px",
          fontWeight: 700,
          colors: ["#ffffff"]
        },
        offsetX: 0,
        offsetY: 0,
        formatter: function(val) {
          return "Rp " + new Intl.NumberFormat("id-ID").format(val);
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.35
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "Rp " + new Intl.NumberFormat("id-ID").format(val);
          }
        }
      },
      responsive: [{
        breakpoint: 1024,
        options: {
          chart: {
            height: 700,
            spacing: [15, 20, 15, 20]
          },
          plotOptions: {
            bar: {
              barHeight: "40%"
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "12px"
              },
              maxWidth: 180
            }
          },
          dataLabels: {
            style: {
              fontSize: "11px"
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "12px"
              }
            }
          }
        }
      }, {
        breakpoint: 768,
        options: {
          chart: {
            height: 600,
            spacing: [15, 15, 15, 15]
          },
          plotOptions: {
            bar: {
              barHeight: "35%"
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "11px"
              },
              maxWidth: 150
            }
          },
          dataLabels: {
            style: {
              fontSize: "10px"
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "11px"
              }
            }
          }
        }
      }]
    }));
    const series2 = computed(() => [{
      name: "Total Penjualan",
      data: usePage().props.topPenjualan.map((item) => item.total_sales ?? 0)
    }]);
    const penjualanTahunan = computed(() => usePage().props.penjualanTahunan || {});
    computed(() => ({
      chart: {
        id: "vuechart-example",
        toolbar: { show: false }
      },
      xaxis: {
        categories: Object.keys(penjualanTahunan.value)
      }
    }));
    computed(() => [{
      name: "Penjualan",
      data: Object.values(penjualanTahunan.value)
    }]);
    const chartOptions = computed(() => ({
      series: [
        {
          name: "Penjualan",
          data: Object.values(penjualanTahunan.value)
        }
      ],
      chart: {
        height: "100%",
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `Rp ${val}`,
        offsetY: -20,
        style: {
          fontSize: "11px",
          colors: ["#304758"],
          fontWeight: 600
        }
      },
      xaxis: {
        categories: Object.keys(penjualanTahunan.value),
        position: "top",
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: "12px"
          }
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: { enabled: true }
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          show: true,
          style: {
            fontSize: "12px"
          },
          formatter: (val) => `Rp ${val}`
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          dataLabels: {
            style: {
              fontSize: "9px"
            },
            offsetY: -15
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px"
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px"
              }
            }
          }
        }
      }]
    }));
    const selectCetak = ref("");
    const pilihanCetak = ref([
      { id: 1, pilihan: "Omzet" },
      { id: 2, pilihan: "Pengeluaran" },
      { id: 3, pilihan: "Pembelian Persediaan" },
      { id: 4, pilihan: "Permintaan Stok" },
      { id: 5, pilihan: "Permintaan Return" }
    ]);
    const form = useForm({
      pilihan: "",
      branch_id: "",
      tanggal_mulai: "",
      tanggal_selesai: ""
    });
    watch(selectCetak, (newValue) => {
      form.pilihan = newValue.pilihan;
      form.branch_id = optionBranch.value.id;
      form.tanggal_mulai = optionStartDate;
      form.tanggal_selesai = optionEndDate;
      const url = route("cetak", form);
      window.open(url, "_blank");
    });
    const selectExport = ref("");
    watch(selectExport, (newValue) => {
      form.pilihan = newValue.pilihan;
      form.branch_id = optionBranch.value.id;
      form.tanggal_mulai = optionStartDate;
      form.tanggal_selesai = optionEndDate;
      const url = route("export", form);
      window.open(url);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Laporan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full space-y-6"${_scopeId}><div class="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}>Laporan</h1><p class="text-cyan-100 mt-1"${_scopeId}>Analisis dan ringkasan data operasional</p></div><div class="hidden md:block"${_scopeId}><div class="bg-white/20 backdrop-blur-sm rounded-lg p-4"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"${_scopeId}></path></svg></div></div></div></div><div class="bg-white rounded-xl shadow-md p-4"${_scopeId}><div class="flex flex-col lg:flex-row justify-between gap-4"${_scopeId}><div class="flex flex-col sm:flex-row gap-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-gray-700 whitespace-nowrap"${_scopeId}>Cetak:</span><div class="w-56"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectCetak.value,
              "onUpdate:modelValue": ($event) => selectCetak.value = $event,
              options: pilihanCetak.value,
              "close-on-select": true,
              placeholder: "Pilih cetak",
              label: "pilihan",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-gray-700 whitespace-nowrap"${_scopeId}>Export:</span><div class="w-56"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectExport.value,
              "onUpdate:modelValue": ($event) => selectExport.value = $event,
              options: pilihanCetak.value,
              "close-on-select": true,
              placeholder: "Pilih export",
              label: "pilihan",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="flex flex-col sm:flex-row items-end sm:items-center gap-2"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-gray-700 whitespace-nowrap"${_scopeId}>Cabang:</span><div class="w-56"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectBranch.value,
              "onUpdate:modelValue": ($event) => selectBranch.value = $event,
              options: __props.branches,
              "close-on-select": true,
              placeholder: "Pilih cabang",
              label: "branch_name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-gray-700 whitespace-nowrap"${_scopeId}>Dari:</span><div class="w-40"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "startDate",
              type: "date",
              class: "bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200",
              modelValue: selectStartDate.value,
              "onUpdate:modelValue": ($event) => selectStartDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-gray-700 whitespace-nowrap"${_scopeId}>Sampai:</span><div class="w-40"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "endDate",
              type: "date",
              class: "bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200",
              modelValue: selectEndDate.value,
              "onUpdate:modelValue": ($event) => selectEndDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"${_scopeId}><div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"${_scopeId}><div class="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2"${_scopeId}><p class="text-center text-white font-semibold text-sm uppercase"${_scopeId}>Omzet</p></div><p class="text-center text-2xl p-4 text-green-600 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah((__props.sales || []).reduce((sum, item) => sum + Number(item.total_price), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"${_scopeId}><div class="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2"${_scopeId}><p class="text-center text-white font-semibold text-sm uppercase"${_scopeId}>Pengeluaran</p></div><p class="text-center text-2xl p-4 text-red-600 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"${_scopeId}><div class="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2"${_scopeId}><p class="text-center text-white font-semibold text-sm uppercase"${_scopeId}>Permintaan Stok</p></div><p class="text-center text-2xl p-4 text-yellow-600 font-bold"${_scopeId}>${ssrInterpolate(__props.orders.length)}</p></div><div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"${_scopeId}><div class="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2"${_scopeId}><p class="text-center text-white font-semibold text-sm uppercase"${_scopeId}>Permintaan Return</p></div><p class="text-center text-2xl p-4 text-purple-600 font-bold"${_scopeId}>${ssrInterpolate(__props.returns.length)}</p></div><div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"${_scopeId}><div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2"${_scopeId}><p class="text-center text-white font-semibold text-sm uppercase"${_scopeId}>Pembelian Persediaan</p></div><p class="text-center text-2xl p-4 text-blue-600 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah(__props.purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0))}</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4"${_scopeId}><div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px]"${_scopeId}><div class="grid grid-cols-2 gap-4 px-4 pt-4 text-center bg-gradient-to-r from-green-50 to-red-50"${_scopeId}><div${_scopeId}><p class="text-green-600 font-medium"${_scopeId}>Omzet</p><p class="text-xl font-bold text-green-600"${_scopeId}>${ssrInterpolate(formatRupiah(__props.sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0))}</p></div><div${_scopeId}><p class="text-red-600 font-medium"${_scopeId}>Pengeluaran</p><p class="text-xl font-bold text-red-600"${_scopeId}>${ssrInterpolate(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)))}</p></div></div><div class="w-full" style="${ssrRenderStyle({ "min-height": "350px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "area",
              options: chart1.value,
              series: series1.value
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px] flex flex-col"${_scopeId}><div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3"${_scopeId}><p class="text-center text-white font-semibold uppercase"${_scopeId}> Penjualan ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</p></div><div class="flex-grow w-full" style="${ssrRenderStyle({ "min-height": "350px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "bar",
              height: "100%",
              options: chartOptions.value,
              series: chartOptions.value.series
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="bg-white rounded-xl shadow-md overflow-hidden"${_scopeId}>`);
            _push2(ssrRenderComponent(Table, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(TableRow, { class: "bg-cyan-500" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`NO`);
                            } else {
                              return [
                                createTextVNode("NO")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`CABANG`);
                            } else {
                              return [
                                createTextVNode("CABANG")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`OMZET`);
                            } else {
                              return [
                                createTextVNode("OMZET")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`PENGELUARAN`);
                            } else {
                              return [
                                createTextVNode("PENGELUARAN")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-white text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`PERMINTAAN STOK`);
                            } else {
                              return [
                                createTextVNode("PERMINTAAN STOK")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("NO")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("OMZET")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("PENGELUARAN")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("PERMINTAAN STOK")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(TableRow, { class: "bg-cyan-500" }, {
                      default: withCtx(() => [
                        createVNode(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx(() => [
                            createTextVNode("NO")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx(() => [
                            createTextVNode("CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx(() => [
                            createTextVNode("OMZET")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-white" }, {
                          default: withCtx(() => [
                            createTextVNode("PENGELUARAN")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-white text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("PERMINTAAN STOK")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.allData, (data, index) => {
                    _push3(ssrRenderComponent(TableRow, {
                      key: data.id,
                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-600 transition-colors duration-150"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "number" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(index + 1)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(index + 1), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatRupiah(data.omzet))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatRupiah(data.omzet)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatRupiah(data.pengeluaran))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatRupiah(data.pengeluaran)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, {
                            status: "record",
                            class: "text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.permintaan_pesanan.length)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.permintaan_pesanan.length), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$3, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatRupiah(data.omzet)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatRupiah(data.pengeluaran)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.permintaan_pesanan.length), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.allData, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-600 transition-colors duration-150"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$3, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatRupiah(data.omzet)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatRupiah(data.pengeluaran)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, {
                            status: "record",
                            class: "text-center"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.permintaan_pesanan.length), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden w-full"${_scopeId}><div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4"${_scopeId}><p class="text-center text-white font-bold text-lg uppercase tracking-wide"${_scopeId}> Top #10 Penjualan Cabang </p></div><div class="w-full px-6 py-6" style="${ssrRenderStyle({ "min-height": "600px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "bar",
              height: "100%",
              options: chart2.value,
              series: series2.value
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 h-full space-y-6" }, [
                createVNode("div", { class: "bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl shadow-lg p-6 text-white" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold" }, "Laporan"),
                      createVNode("p", { class: "text-cyan-100 mt-1" }, "Analisis dan ringkasan data operasional")
                    ]),
                    createVNode("div", { class: "hidden md:block" }, [
                      createVNode("div", { class: "bg-white/20 backdrop-blur-sm rounded-lg p-4" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "w-12 h-12 text-white"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          })
                        ]))
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-md p-4" }, [
                  createVNode("div", { class: "flex flex-col lg:flex-row justify-between gap-4" }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-4" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-medium text-gray-700 whitespace-nowrap" }, "Cetak:"),
                        createVNode("div", { class: "w-56" }, [
                          createVNode(unref(VueMultiselect), {
                            modelValue: selectCetak.value,
                            "onUpdate:modelValue": ($event) => selectCetak.value = $event,
                            options: pilihanCetak.value,
                            "close-on-select": true,
                            placeholder: "Pilih cetak",
                            label: "pilihan",
                            "track-by": "id"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-medium text-gray-700 whitespace-nowrap" }, "Export:"),
                        createVNode("div", { class: "w-56" }, [
                          createVNode(unref(VueMultiselect), {
                            modelValue: selectExport.value,
                            "onUpdate:modelValue": ($event) => selectExport.value = $event,
                            options: pilihanCetak.value,
                            "close-on-select": true,
                            placeholder: "Pilih export",
                            label: "pilihan",
                            "track-by": "id"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row items-end sm:items-center gap-2" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-medium text-gray-700 whitespace-nowrap" }, "Cabang:"),
                        createVNode("div", { class: "w-56" }, [
                          createVNode(unref(VueMultiselect), {
                            modelValue: selectBranch.value,
                            "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                            options: __props.branches,
                            "close-on-select": true,
                            placeholder: "Pilih cabang",
                            label: "branch_name",
                            "track-by": "id"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-medium text-gray-700 whitespace-nowrap" }, "Dari:"),
                        createVNode("div", { class: "w-40" }, [
                          createVNode(_sfc_main$2, {
                            id: "startDate",
                            type: "date",
                            class: "bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200",
                            modelValue: selectStartDate.value,
                            "onUpdate:modelValue": ($event) => selectStartDate.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-medium text-gray-700 whitespace-nowrap" }, "Sampai:"),
                        createVNode("div", { class: "w-40" }, [
                          createVNode(_sfc_main$2, {
                            id: "endDate",
                            type: "date",
                            class: "bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200",
                            modelValue: selectEndDate.value,
                            "onUpdate:modelValue": ($event) => selectEndDate.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" }, [
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-green-500 to-green-600 px-4 py-2" }, [
                      createVNode("p", { class: "text-center text-white font-semibold text-sm uppercase" }, "Omzet")
                    ]),
                    createVNode("p", { class: "text-center text-2xl p-4 text-green-600 font-bold" }, toDisplayString(formatRupiah((__props.sales || []).reduce((sum, item) => sum + Number(item.total_price), 0))), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-red-500 to-red-600 px-4 py-2" }, [
                      createVNode("p", { class: "text-center text-white font-semibold text-sm uppercase" }, "Pengeluaran")
                    ]),
                    createVNode("p", { class: "text-center text-2xl p-4 text-red-600 font-bold" }, toDisplayString(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0))), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2" }, [
                      createVNode("p", { class: "text-center text-white font-semibold text-sm uppercase" }, "Permintaan Stok")
                    ]),
                    createVNode("p", { class: "text-center text-2xl p-4 text-yellow-600 font-bold" }, toDisplayString(__props.orders.length), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2" }, [
                      createVNode("p", { class: "text-center text-white font-semibold text-sm uppercase" }, "Permintaan Return")
                    ]),
                    createVNode("p", { class: "text-center text-2xl p-4 text-purple-600 font-bold" }, toDisplayString(__props.returns.length), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2" }, [
                      createVNode("p", { class: "text-center text-white font-semibold text-sm uppercase" }, "Pembelian Persediaan")
                    ]),
                    createVNode("p", { class: "text-center text-2xl p-4 text-blue-600 font-bold" }, toDisplayString(formatRupiah(__props.purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0)), 1)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-4" }, [
                  createVNode("div", { class: "bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px]" }, [
                    createVNode("div", { class: "grid grid-cols-2 gap-4 px-4 pt-4 text-center bg-gradient-to-r from-green-50 to-red-50" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-600 font-medium" }, "Omzet"),
                        createVNode("p", { class: "text-xl font-bold text-green-600" }, toDisplayString(formatRupiah(__props.sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-red-600 font-medium" }, "Pengeluaran"),
                        createVNode("p", { class: "text-xl font-bold text-red-600" }, toDisplayString(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0))), 1)
                      ])
                    ]),
                    createVNode("div", {
                      class: "w-full",
                      style: { "min-height": "350px" }
                    }, [
                      createVNode(unref(VueApexCharts), {
                        type: "area",
                        options: chart1.value,
                        series: series1.value
                      }, null, 8, ["options", "series"])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px] flex flex-col" }, [
                    createVNode("div", { class: "bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3" }, [
                      createVNode("p", { class: "text-center text-white font-semibold uppercase" }, " Penjualan " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()), 1)
                    ]),
                    createVNode("div", {
                      class: "flex-grow w-full",
                      style: { "min-height": "350px" }
                    }, [
                      createVNode(unref(VueApexCharts), {
                        type: "bar",
                        height: "100%",
                        options: chartOptions.value,
                        series: chartOptions.value.series
                      }, null, 8, ["options", "series"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-md overflow-hidden" }, [
                  createVNode(Table, null, {
                    header: withCtx(() => [
                      createVNode(TableRow, { class: "bg-cyan-500" }, {
                        default: withCtx(() => [
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("NO")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("OMZET")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white" }, {
                            default: withCtx(() => [
                              createTextVNode("PENGELUARAN")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-white text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("PERMINTAAN STOK")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.allData, (data, index) => {
                        return openBlock(), createBlock(TableRow, {
                          key: data.id,
                          class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-600 transition-colors duration-150"
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$3, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatRupiah(data.omzet)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatRupiah(data.pengeluaran)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.permintaan_pesanan.length), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden w-full" }, [
                  createVNode("div", { class: "bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4" }, [
                    createVNode("p", { class: "text-center text-white font-bold text-lg uppercase tracking-wide" }, " Top #10 Penjualan Cabang ")
                  ]),
                  createVNode("div", {
                    class: "w-full px-6 py-6",
                    style: { "min-height": "600px" }
                  }, [
                    createVNode(unref(VueApexCharts), {
                      type: "bar",
                      height: "100%",
                      options: chart2.value,
                      series: series2.value
                    }, null, 8, ["options", "series"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Managements/Reports/IndexReport.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
