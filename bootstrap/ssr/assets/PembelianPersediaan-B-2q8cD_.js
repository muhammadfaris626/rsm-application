import { computed, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { T as Table, a as TableRow, _ as _sfc_main$1, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import "./TablePagination-A5nS3meM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "PembelianPersediaan",
  __ssrInlineRender: true,
  props: ["fetchData", "branch", "tanggalMulai", "tanggalSelesai"],
  setup(__props) {
    function formatRupiah(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(value);
    }
    const totalOmzet = computed(() => {
      return usePage().props.fetchData.reduce((sum, item) => sum + parseFloat(item.total_harga), 0);
    });
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(date);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Cetak" }, null, _parent));
      _push(`<div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10" data-v-9c9a9916><div class="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700" data-v-9c9a9916><div data-v-9c9a9916><img${ssrRenderAttr("src", "/images/rsm-merah.png")} class="h-20" data-v-9c9a9916><h2 class="text-2xl font-semibold text-gray-800 dark:text-neutral-200" data-v-9c9a9916>Laporan Pembelian Persediaan</h2></div><div class="inline-flex gap-x-2" data-v-9c9a9916><button class="print:hidden py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#" data-v-9c9a9916><svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-9c9a9916><polyline points="6 9 6 2 18 2 18 9" data-v-9c9a9916></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" data-v-9c9a9916></path><rect width="12" height="8" x="6" y="14" data-v-9c9a9916></rect></svg> Cetak </button></div></div><div class="grid md:grid-cols-2" data-v-9c9a9916><div data-v-9c9a9916><div class="grid" data-v-9c9a9916><dl class="flex flex-col sm:flex-row gap-x-3 text-sm" data-v-9c9a9916><dt class="min-w-36 max-w-[200px] text-gray-500 dark:text-neutral-500" data-v-9c9a9916> Dari Tanggal </dt><dd class="font-medium text-gray-800 dark:text-neutral-200" data-v-9c9a9916><span class="block font-semibold" data-v-9c9a9916>: ${ssrInterpolate(formatDate(__props.tanggalMulai))}</span></dd></dl><dl class="flex flex-col sm:flex-row gap-x-3 text-sm" data-v-9c9a9916><dt class="min-w-36 max-w-[200px] text-gray-500 dark:text-neutral-500" data-v-9c9a9916> Sampai Tanggal </dt><dd class="font-medium text-gray-800 dark:text-neutral-200" data-v-9c9a9916><span class="block font-semibold" data-v-9c9a9916>: ${ssrInterpolate(formatDate(__props.tanggalSelesai))}</span></dd></dl></div></div></div><div class="mt-6 border border-gray-200 rounded-lg dark:border-neutral-700 bg-white" data-v-9c9a9916>`);
      _push(ssrRenderComponent(Table, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`No`);
                } else {
                  return [
                    createTextVNode("No")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`NOMOR FAKTUR`);
                } else {
                  return [
                    createTextVNode("NOMOR FAKTUR")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`TANGGAL`);
                } else {
                  return [
                    createTextVNode("TANGGAL")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`SUPPLIER`);
                } else {
                  return [
                    createTextVNode("SUPPLIER")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`BARANG`);
                } else {
                  return [
                    createTextVNode("BARANG")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`HARGA`);
                } else {
                  return [
                    createTextVNode("HARGA")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`JUMLAH`);
                } else {
                  return [
                    createTextVNode("JUMLAH")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TableHeaderCell, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`TOTAL HARGA`);
                } else {
                  return [
                    createTextVNode("TOTAL HARGA")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
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
                  createTextVNode("NOMOR FAKTUR")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("TANGGAL")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("SUPPLIER")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("BARANG")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("HARGA")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("JUMLAH")
                ]),
                _: 1
              }),
              createVNode(TableHeaderCell, null, {
                default: withCtx(() => [
                  createTextVNode("TOTAL HARGA")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.fetchData, (data, index) => {
              _push2(ssrRenderComponent(TableRow, {
                key: data.id,
                class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "number" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(index + 1)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(index + 1), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(data.invoice_number)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(data.invoice_number), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(formatDate(data.tanggal))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(formatDate(data.tanggal)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(data.supplier)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(data.supplier), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(data.barang)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(data.barang), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(formatRupiah(data.harga))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(formatRupiah(data.harga)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(data.jumlah)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(data.jumlah), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, { status: "record" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(formatRupiah(data.total_harga))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(formatRupiah(data.total_harga)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$1, { status: "number" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(index + 1), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(data.invoice_number), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(formatDate(data.tanggal)), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(data.supplier), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(data.barang), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(formatRupiah(data.harga)), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(data.jumlah), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, { status: "record" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(formatRupiah(data.total_harga)), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData, (data, index) => {
                return openBlock(), createBlock(TableRow, {
                  key: data.id,
                  class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$1, { status: "number" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(index + 1), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(data.invoice_number), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(formatDate(data.tanggal)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(data.supplier), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(data.barang), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(formatRupiah(data.harga)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(data.jumlah), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_sfc_main$1, { status: "record" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(formatRupiah(data.total_harga)), 1)
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
      }, _parent));
      _push(`</div><div class="mt-8 flex sm:justify-end" data-v-9c9a9916><div class="w-full max-w-2xl sm:text-end space-y-2" data-v-9c9a9916><div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2" data-v-9c9a9916><dl class="grid sm:grid-cols-5 gap-x-3 text-sm" data-v-9c9a9916><dt class="col-span-3 text-gray-500 text-xl" data-v-9c9a9916>TOTAL PEMBELIAN :</dt><dd class="col-span-2 font-bold text-gray-800 text-2xl" data-v-9c9a9916>${ssrInterpolate(formatRupiah(totalOmzet.value))}</dd></dl></div></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Managements/Reports/PembelianPersediaan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PembelianPersediaan = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9c9a9916"]]);
export {
  PembelianPersediaan as default
};
