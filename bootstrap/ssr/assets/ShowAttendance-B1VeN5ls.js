import { ref, onMounted, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { Head, Link } from "@inertiajs/vue3";
import axios from "axios";
import "./TextInput-CNvSDFvn.js";
import { T as Table, a as TableRow, _ as _sfc_main$2, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import "flowbite";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ShowAttendance",
  __ssrInlineRender: true,
  props: {
    id: { type: String }
  },
  setup(__props) {
    const props = __props;
    const fetchData = ref([]);
    const selectStartDate = ref(null);
    const selectEndDate = ref(null);
    const getCurrentMonthDates = () => {
      let dates = [];
      let today = /* @__PURE__ */ new Date();
      let startDate = new Date(today.getFullYear(), today.getMonth(), 2);
      let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      selectStartDate.value = startDate.toISOString().split("T")[0];
      selectEndDate.value = endDate.toISOString().split("T")[0];
      while (startDate <= endDate) {
        dates.push({
          work_date: startDate.toISOString().split("T")[0],
          check_in: null,
          check_out: null
        });
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    };
    const allDates = ref(getCurrentMonthDates());
    const getData = async () => {
      try {
        const response = await axios.get(`/api/employee-attendances/${props.id}`, {
          params: {
            start_date: selectStartDate.value,
            end_date: selectEndDate.value
          }
        });
        const apiData = response.data.attendances || [];
        fetchData.value = allDates.value.map((item) => {
          const match = apiData.find((d) => d.work_date === item.work_date);
          return match ? match : item;
        });
      } catch (error) {
        console.error("Gagal mengambil data", error);
      }
    };
    onMounted(getData);
    const formatTanggal = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(date);
    };
    const formatJam = (dateString) => {
      if (!dateString) return "-- : --";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
        // Format 24 jam
      }).format(date);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Lihat Absensi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"${_scopeId}></path></svg> Karyawan </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("attendances.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Data Absensi`);
                } else {
                  return [
                    createTextVNode("Data Absensi")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Lihat Absensi</span></div></li></ol></nav></div><div class="flex justify-end my-4"${_scopeId}></div>`);
            _push2(ssrRenderComponent(Table, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(TableRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
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
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`TANGGAL`);
                            } else {
                              return [
                                createTextVNode("TANGGAL")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`JAM MASUK`);
                            } else {
                              return [
                                createTextVNode("JAM MASUK")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`JAM KELUAR`);
                            } else {
                              return [
                                createTextVNode("JAM KELUAR")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("NO")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("TANGGAL")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("JAM MASUK")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("JAM KELUAR")
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
                    createVNode(TableRow, null, {
                      default: withCtx(() => [
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("NO")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("TANGGAL")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("JAM MASUK")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("JAM KELUAR")
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
                  ssrRenderList(fetchData.value, (data, index) => {
                    _push3(ssrRenderComponent(TableRow, { key: index }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            status: "number",
                            class: "border border-b-1"
                          }, {
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
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            status: "record",
                            class: "border border-b-1"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatTanggal(data.work_date))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatTanggal(data.work_date)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatJam(data.check_in))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatJam(data.check_in)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatJam(data.check_out))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatJam(data.check_out)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$2, {
                              status: "number",
                              class: "border border-b-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$2, {
                              status: "record",
                              class: "border border-b-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatTanggal(data.work_date)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$2, {
                              status: "record",
                              class: "text-center border border-b-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatJam(data.check_in)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$2, {
                              status: "record",
                              class: "text-center border border-b-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatJam(data.check_out)), 1)
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
                    (openBlock(true), createBlock(Fragment, null, renderList(fetchData.value, (data, index) => {
                      return openBlock(), createBlock(TableRow, { key: index }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$2, {
                            status: "number",
                            class: "border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatTanggal(data.work_date)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatJam(data.check_in)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatJam(data.check_out)), 1)
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
            _push2(`</div>`);
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
                              d: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                            })
                          ])),
                          createTextVNode(" Karyawan ")
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
                            href: _ctx.route("attendances.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Data Absensi")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Lihat Absensi")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-end my-4" }),
                createVNode(Table, null, {
                  header: withCtx(() => [
                    createVNode(TableRow, null, {
                      default: withCtx(() => [
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("NO")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("TANGGAL")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("JAM MASUK")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("JAM KELUAR")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(fetchData.value, (data, index) => {
                      return openBlock(), createBlock(TableRow, { key: index }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$2, {
                            status: "number",
                            class: "border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatTanggal(data.work_date)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatJam(data.check_in)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "text-center border border-b-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatJam(data.check_out)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Employees/Attendances/ShowAttendance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
