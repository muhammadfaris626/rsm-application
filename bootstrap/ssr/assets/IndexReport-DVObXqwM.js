import { ref, computed, watch, onMounted, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
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
      chart: { height: "100%", type: "area", zoom: { enabled: false }, toolbar: { show: false } },
      colors: ["#0E9F6E", "#F05252"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: { type: "datetime", categories: usePage().props.sales.map((sale) => sale.date) },
      tooltip: { x: { format: "dd/MM/yy HH:mm" } }
    }));
    const series1 = computed(() => [
      { name: "Omzet", data: usePage().props.sales.map((sale) => sale.total_price) },
      { name: "Pengeluaran", data: computedPengeluaran.value.map((expenditure) => expenditure.total_cost) }
    ]);
    const chart2 = ref({
      chart: {
        id: "vuechart-example",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
          // Mengubah bar chart menjadi horizontal
        }
      },
      xaxis: {
        categories: usePage().props.topPenjualan.map((item) => item.branch_name)
      }
    });
    const series2 = ref([{
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
    const chartOptions = ref({
      series: [
        {
          name: "Inflation",
          data: Object.values(penjualanTahunan.value)
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
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
          fontSize: "10px",
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: Object.keys(penjualanTahunan.value),
        position: "top",
        axisBorder: { show: false },
        axisTicks: { show: false },
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
          show: false,
          formatter: (val) => `${val}%`
        }
      },
      title: {
        text: `Penjualan Tahunan ${(/* @__PURE__ */ new Date()).getFullYear()}`,
        floating: true,
        offsetY: 330,
        align: "center",
        style: { color: "#444" }
      }
    });
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
            _push2(`<div class="grid grid-cols-1 h-full gap-4"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"${_scopeId}></path></svg> Manajemen </a></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Laporan</span></div></li></ol></nav></div><div class="flex justify-between"${_scopeId}><div${_scopeId}><div class="flex"${_scopeId}><div class="flex w-14 items-center justify-start"${_scopeId}> Cetak </div><div class="flex-initial w-64 ..."${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectCetak.value,
              "onUpdate:modelValue": ($event) => selectCetak.value = $event,
              options: pilihanCetak.value,
              "close-on-select": true,
              placeholder: "Pilih cetak",
              label: "pilihan",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex mt-2"${_scopeId}><div class="flex w-14 items-center justify-start"${_scopeId}> Export </div><div class="flex-initial w-64 ..."${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectExport.value,
              "onUpdate:modelValue": ($event) => selectExport.value = $event,
              options: pilihanCetak.value,
              "close-on-select": true,
              placeholder: "Pilih export",
              label: "pilihan",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div${_scopeId}><div class="flex justify-end"${_scopeId}><div class="flex items-center justify-start mx-2"${_scopeId}> Cabang : </div><div class="w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: selectBranch.value,
              "onUpdate:modelValue": ($event) => selectBranch.value = $event,
              options: __props.branches,
              "close-on-select": true,
              placeholder: "Pilih cabang",
              label: "branch_name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-start mx-2"${_scopeId}> Dari : </div><div class="w-30"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "name",
              type: "date",
              class: "block w-full bg-white",
              modelValue: selectStartDate.value,
              "onUpdate:modelValue": ($event) => selectStartDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-start mx-2"${_scopeId}> Sampai : </div><div class="w-30"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "name",
              type: "date",
              class: "block w-full bg-white",
              modelValue: selectEndDate.value,
              "onUpdate:modelValue": ($event) => selectEndDate.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div><div class="grid grid-cols-5 gap-4"${_scopeId}><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-green-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Omzet</strong></p><p class="uppercase text-center text-3xl p-4 text-green-500 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah((__props.sales || []).reduce((sum, item) => sum + Number(item.total_price), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-red-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Pengeluaran</strong></p><p class="uppercase text-center text-3xl p-4 text-red-500 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-yellow-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Permintaan Stok</strong></p><p class="uppercase text-center text-3xl p-4 text-yellow-500 font-bold"${_scopeId}>${ssrInterpolate(__props.orders.length)}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Permintaan Return</strong></p><p class="uppercase text-center text-3xl p-4 text-purple-500 font-bold"${_scopeId}>${ssrInterpolate(__props.returns.length)}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Pembelian Persediaan</strong></p><p class="uppercase text-center text-3xl p-4 text-blue-500 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah(__props.purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0))}</p></div></div><div class="grid grid-cols-3 gap-4"${_scopeId}><div class="grid grid-cols-1 border-2 rounded-xl bg-white"${_scopeId}><div class="grid grid-cols-2 gap-4 px-4 pt-2 text-center"${_scopeId}><div${_scopeId}><p class="text-green-500"${_scopeId}>Omzet</p><p class="text-xl font-semibold text-green-500"${_scopeId}>${ssrInterpolate(formatRupiah(__props.sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0))}</p></div><div${_scopeId}><p class="text-red-500"${_scopeId}>Pengeluaran</p><p class="text-xl font-semibold text-red-500"${_scopeId}>${ssrInterpolate(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)))}</p></div></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "area",
              options: chart1.value,
              series: series1.value
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="border-2 rounded-xl bg-white" style="${ssrRenderStyle({ "height": "400px", "display": "flex", "flex-direction": "column" })}"${_scopeId}><p class="font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3"${_scopeId}><strong${_scopeId}>Penjualan ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</strong></p><div style="${ssrRenderStyle({ "flex-grow": "1" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "bar",
              height: "95%",
              options: chartOptions.value,
              series: chartOptions.value.series
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="border-2 rounded-xl bg-white" style="${ssrRenderStyle({ "height": "400px", "display": "flex", "flex-direction": "column" })}"${_scopeId}><p class="font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3"${_scopeId}><strong${_scopeId}>Top #10 Penjualan Cabang</strong></p><div style="${ssrRenderStyle({ "flex-grow": "1" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "bar",
              height: "95%",
              options: chart2.value,
              series: series2.value
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(Table, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(TableHeaderCell, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`No`);
                      } else {
                        return [
                          createTextVNode("No")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(TableHeaderCell, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`CABANG`);
                      } else {
                        return [
                          createTextVNode("CABANG")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(TableHeaderCell, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`OMZET`);
                      } else {
                        return [
                          createTextVNode("OMZET")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(TableHeaderCell, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`PENGELUARAN`);
                      } else {
                        return [
                          createTextVNode("PENGELUARAN")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`PERMINTAAN STOK`);
                      } else {
                        return [
                          createTextVNode("PERMINTAAN STOK")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(TableHeaderCell, null, {
                      default: withCtx(() => [
                        createTextVNode("No")
                      ]),
                      _: 1
                    }),
                    createVNode(TableHeaderCell, null, {
                      default: withCtx(() => [
                        createTextVNode("CABANG")
                      ]),
                      _: 1
                    }),
                    createVNode(TableHeaderCell, null, {
                      default: withCtx(() => [
                        createTextVNode("OMZET")
                      ]),
                      _: 1
                    }),
                    createVNode(TableHeaderCell, null, {
                      default: withCtx(() => [
                        createTextVNode("PENGELUARAN")
                      ]),
                      _: 1
                    }),
                    createVNode(TableHeaderCell, { class: "text-center" }, {
                      default: withCtx(() => [
                        createTextVNode("PERMINTAAN STOK")
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
                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 h-full gap-4" }, [
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
                              d: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                            })
                          ])),
                          createTextVNode(" Manajemen ")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Laporan")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "flex" }, [
                      createVNode("div", { class: "flex w-14 items-center justify-start" }, " Cetak "),
                      createVNode("div", { class: "flex-initial w-64 ..." }, [
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
                    createVNode("div", { class: "flex mt-2" }, [
                      createVNode("div", { class: "flex w-14 items-center justify-start" }, " Export "),
                      createVNode("div", { class: "flex-initial w-64 ..." }, [
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
                  createVNode("div", null, [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode("div", { class: "flex items-center justify-start mx-2" }, " Cabang : "),
                      createVNode("div", { class: "w-64" }, [
                        createVNode(unref(VueMultiselect), {
                          modelValue: selectBranch.value,
                          "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                          options: __props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih cabang",
                          label: "branch_name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-start mx-2" }, " Dari : "),
                      createVNode("div", { class: "w-30" }, [
                        createVNode(_sfc_main$2, {
                          id: "name",
                          type: "date",
                          class: "block w-full bg-white",
                          modelValue: selectStartDate.value,
                          "onUpdate:modelValue": ($event) => selectStartDate.value = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-start mx-2" }, " Sampai : "),
                      createVNode("div", { class: "w-30" }, [
                        createVNode(_sfc_main$2, {
                          id: "name",
                          type: "date",
                          class: "block w-full bg-white",
                          modelValue: selectEndDate.value,
                          "onUpdate:modelValue": ($event) => selectEndDate.value = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-5 gap-4" }, [
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-green-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Omzet")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-green-500 font-bold" }, toDisplayString(formatRupiah((__props.sales || []).reduce((sum, item) => sum + Number(item.total_price), 0))), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-red-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Pengeluaran")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-red-500 font-bold" }, toDisplayString(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0))), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-yellow-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Permintaan Stok")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-yellow-500 font-bold" }, toDisplayString(__props.orders.length), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Permintaan Return")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-purple-500 font-bold" }, toDisplayString(__props.returns.length), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Pembelian Persediaan")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-blue-500 font-bold" }, toDisplayString(formatRupiah(__props.purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0)), 1)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
                  createVNode("div", { class: "grid grid-cols-1 border-2 rounded-xl bg-white" }, [
                    createVNode("div", { class: "grid grid-cols-2 gap-4 px-4 pt-2 text-center" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-green-500" }, "Omzet"),
                        createVNode("p", { class: "text-xl font-semibold text-green-500" }, toDisplayString(formatRupiah(__props.sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-red-500" }, "Pengeluaran"),
                        createVNode("p", { class: "text-xl font-semibold text-red-500" }, toDisplayString(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0))), 1)
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode(unref(VueApexCharts), {
                        type: "area",
                        options: chart1.value,
                        series: series1.value
                      }, null, 8, ["options", "series"])
                    ])
                  ]),
                  createVNode("div", {
                    class: "border-2 rounded-xl bg-white",
                    style: { "height": "400px", "display": "flex", "flex-direction": "column" }
                  }, [
                    createVNode("p", { class: "font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3" }, [
                      createVNode("strong", null, "Penjualan " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()), 1)
                    ]),
                    createVNode("div", { style: { "flex-grow": "1" } }, [
                      createVNode(unref(VueApexCharts), {
                        type: "bar",
                        height: "95%",
                        options: chartOptions.value,
                        series: chartOptions.value.series
                      }, null, 8, ["options", "series"])
                    ])
                  ]),
                  createVNode("div", {
                    class: "border-2 rounded-xl bg-white",
                    style: { "height": "400px", "display": "flex", "flex-direction": "column" }
                  }, [
                    createVNode("p", { class: "font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3" }, [
                      createVNode("strong", null, "Top #10 Penjualan Cabang")
                    ]),
                    createVNode("div", { style: { "flex-grow": "1" } }, [
                      createVNode(unref(VueApexCharts), {
                        type: "bar",
                        height: "95%",
                        options: chart2.value,
                        series: series2.value
                      }, null, 8, ["options", "series"])
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode(Table, null, {
                    header: withCtx(() => [
                      createVNode(TableHeaderCell, null, {
                        default: withCtx(() => [
                          createTextVNode("No")
                        ]),
                        _: 1
                      }),
                      createVNode(TableHeaderCell, null, {
                        default: withCtx(() => [
                          createTextVNode("CABANG")
                        ]),
                        _: 1
                      }),
                      createVNode(TableHeaderCell, null, {
                        default: withCtx(() => [
                          createTextVNode("OMZET")
                        ]),
                        _: 1
                      }),
                      createVNode(TableHeaderCell, null, {
                        default: withCtx(() => [
                          createTextVNode("PENGELUARAN")
                        ]),
                        _: 1
                      }),
                      createVNode(TableHeaderCell, { class: "text-center" }, {
                        default: withCtx(() => [
                          createTextVNode("PERMINTAAN STOK")
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.allData, (data, index) => {
                        return openBlock(), createBlock(TableRow, {
                          key: data.id,
                          class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
