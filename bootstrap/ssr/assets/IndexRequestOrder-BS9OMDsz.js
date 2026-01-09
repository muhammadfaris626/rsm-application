import { ref, computed, watch, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, withDirectives, vModelSelect, isRef, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1, u as usePermission } from "./AuthenticatedLayout-BIJ2sf7b.js";
import { useForm, usePage, router, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$4 } from "./Modal-BsYluhuH.js";
import { _ as _sfc_main$6 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$5 } from "./TextInput-CNvSDFvn.js";
import { T as Table, a as TableRow, _ as _sfc_main$3, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import { _ as _sfc_main$2 } from "./TablePagination-A5nS3meM.js";
import "flowbite";
import "axios";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IndexRequestOrder",
  __ssrInlineRender: true,
  props: ["fetchData", "approvalTypes", "userBranch"],
  setup(__props) {
    const form = useForm({
      id: "",
      ro_number: "",
      branch_id: "",
      date: "",
      status: "",
      listData: "",
      log: "",
      approval: "",
      last_update: "",
      created_at: "",
      updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    let searchUrl = computed(() => {
      let url = new URL(route("requestOrders.index"));
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
        replace: true
      });
    });
    ref(false);
    const showModalRead = ref(false);
    ref(false);
    const showModalDelete = ref(false);
    const showModalApproval = ref(false);
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
    const closeModalApproval = () => {
      showModalApproval.value = false;
      form.reset();
      form.clearErrors();
    };
    const modalLiatData = (data) => {
      showModalRead.value = true;
      form.id = data.id;
      form.ro_number = data.ro_number;
      form.branch_id = data.branch_id;
      form.date = data.date;
      form.status = data.status;
      form.listData = data.listData;
      form.last_update = data.last_update;
      form.created_at = data.created_at;
      form.updated_at = data.updated_at;
    };
    const modalApproval = (data) => {
      showModalApproval.value = true;
      form.id = data.id;
      form.ro_number = data.ro_number;
      form.branch_id = data.branch_id;
      form.date = data.date;
      form.status = data.status;
      form.listData = data.listData;
      form.log = data.log;
      form.last_update = data.last_update;
    };
    const modalHapusData = (data) => {
      showModalDelete.value = true;
      form.id = data.id;
    };
    const approvedQuantityFilled = computed(() => {
      return form.listData.every((item) => item.approved_quantity !== "" && item.approved_quantity !== null);
    });
    const submitApproval = () => {
      if (!approvedQuantityFilled.value) {
        alert("Harap isi semua jumlah barang yang disetujui!");
        return;
      }
      form.put(route("approval", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalApproval.value = false;
        }
      });
    };
    const hapusData = () => {
      form.delete(route("requestOrders.destroy", form.id), {
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
    const steps = [
      "Sedang diverifikasi",
      "Disetujui",
      "Pengiriman barang",
      "Tiba di lokasi",
      "Pengecekan barang",
      "Selesai"
    ];
    const page = usePage();
    const userRoles = page.props.auth.user.roles;
    const userBranchId = page.props.userBranch;
    const approvalOptions = computed(() => {
      const optionsMap = {
        "Sedang diverifikasi": ["Disetujui"],
        "Disetujui": ["Pengiriman barang"],
        "Pengiriman barang": ["Tiba di lokasi"],
        "Tiba di lokasi": ["Pengecekan barang"],
        "Pengecekan barang": ["Selesai"]
      };
      return optionsMap[form.status] || [];
    });
    const canViewSelect = computed(() => {
      const rootAdminStatuses = ["Sedang diverifikasi", "Disetujui"];
      const branchStatuses = ["Pengiriman barang", "Tiba di lokasi", "Pengecekan barang"];
      if (userRoles.includes("root") || userRoles.includes("admin-pusat")) {
        return rootAdminStatuses.includes(form.status);
      }
      if (userRoles.includes("admin-branch")) {
        return branchStatuses.includes(form.status) && userBranchId === form.branch_id[0].id;
      }
      return false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Permintaan Pesanan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full space-y-6"${_scopeId}><div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}>Permintaan Stok</h1><p class="text-blue-100 mt-1"${_scopeId}>Kelola permintaan stok dari berbagai cabang</p></div><div class="hidden md:block"${_scopeId}><div class="bg-white/20 backdrop-blur-sm rounded-lg p-4"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"${_scopeId}></path></svg></div></div></div></div><div class="bg-white rounded-xl shadow-md p-4"${_scopeId}><div class="flex flex-col md:flex-row justify-between gap-4"${_scopeId}><div class="w-full md:w-1/3"${_scopeId}><div class="relative group"${_scopeId}><div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(search))} type="text" class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" placeholder="Cari nomor permintaan, cabang, atau status..."${_scopeId}></div></div><div${_scopeId}>`);
            if (unref(hasPermission)("request-order: create")) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("requestOrders.create"),
                class: "px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId2}></path></svg> Tambah Data `);
                  } else {
                    return [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        "stroke-width": "2",
                        stroke: "currentColor",
                        class: "w-5 h-5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 4.5v15m7.5-7.5h-15"
                        })
                      ])),
                      createTextVNode(" Tambah Data ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="bg-white rounded-xl shadow-md overflow-hidden"${_scopeId}>`);
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
                              _push5(`NOMOR PERMINTAAN`);
                            } else {
                              return [
                                createTextVNode("NOMOR PERMINTAAN")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
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
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`STATUS`);
                            } else {
                              return [
                                createTextVNode("STATUS")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`AKSI`);
                            } else {
                              return [
                                createTextVNode("AKSI")
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
                              createTextVNode("NOMOR PERMINTAAN")
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
                              createTextVNode("TANGGAL")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("STATUS")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("AKSI")
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
                            createTextVNode("NOMOR PERMINTAAN")
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
                            createTextVNode("TANGGAL")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("STATUS")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("AKSI")
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
                  ssrRenderList(__props.fetchData.data, (data, index) => {
                    _push3(ssrRenderComponent(TableRow, {
                      key: data.id,
                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$3, {
                            status: "number",
                            class: "font-semibold text-gray-600"
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
                          _push4(ssrRenderComponent(_sfc_main$3, {
                            status: "record",
                            class: "font-bold text-gray-900"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.ro_number)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.ro_number), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, {
                            status: "record",
                            class: "text-gray-700"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_id[0]["branch_name"])}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_id[0]["branch_name"]), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, {
                            status: "record",
                            class: "text-gray-600"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatTanggal(data.date))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatTanggal(data.date)), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<button class="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105" type="button"${_scopeId4}>${ssrInterpolate(data.status)}</button>`);
                              } else {
                                return [
                                  createVNode("button", {
                                    onClick: ($event) => modalApproval(data),
                                    class: "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105",
                                    type: "button"
                                  }, toDisplayString(data.status), 9, ["onClick"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$3, { status: "action" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="flex items-center gap-2"${_scopeId4}>`);
                                if (unref(hasPermission)("request-order: read")) {
                                  _push5(`<button class="text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110" type="button" title="Lihat Detail"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"${_scopeId4}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("request-order: update") && data.status == "Sedang diverifikasi") {
                                  _push5(ssrRenderComponent(unref(Link), {
                                    href: _ctx.route("requestOrders.edit", data.id),
                                    class: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    title: "Edit"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"${_scopeId5}><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"${_scopeId5}></path></svg>`);
                                      } else {
                                        return [
                                          (openBlock(), createBlock("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            "stroke-width": "2",
                                            stroke: "currentColor",
                                            class: "w-4 h-4"
                                          }, [
                                            createVNode("path", {
                                              "stroke-linecap": "round",
                                              "stroke-linejoin": "round",
                                              d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                            })
                                          ]))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("request-order: delete")) {
                                  _push5(`<button type="button" class="text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110" title="Hapus"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "flex items-center gap-2" }, [
                                    unref(hasPermission)("request-order: read") ? (openBlock(), createBlock("button", {
                                      key: 0,
                                      onClick: ($event) => modalLiatData(data),
                                      class: "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                      type: "button",
                                      title: "Lihat Detail"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "2",
                                        stroke: "currentColor",
                                        class: "w-4 h-4"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                        }),
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        })
                                      ]))
                                    ], 8, ["onClick"])) : createCommentVNode("", true),
                                    unref(hasPermission)("request-order: update") && data.status == "Sedang diverifikasi" ? (openBlock(), createBlock(unref(Link), {
                                      key: 1,
                                      href: _ctx.route("requestOrders.edit", data.id),
                                      class: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                      title: "Edit"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          "stroke-width": "2",
                                          stroke: "currentColor",
                                          class: "w-4 h-4"
                                        }, [
                                          createVNode("path", {
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                            d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                          })
                                        ]))
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])) : createCommentVNode("", true),
                                    unref(hasPermission)("request-order: delete") ? (openBlock(), createBlock("button", {
                                      key: 2,
                                      onClick: ($event) => modalHapusData(data),
                                      type: "button",
                                      class: "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                      title: "Hapus"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "2",
                                        stroke: "currentColor",
                                        class: "w-4 h-4"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        })
                                      ]))
                                    ], 8, ["onClick"])) : createCommentVNode("", true)
                                  ])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$3, {
                              status: "number",
                              class: "font-semibold text-gray-600"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "font-bold text-gray-900"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.ro_number), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-gray-700"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_id[0]["branch_name"]), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-gray-600"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatTanggal(data.date)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createVNode("button", {
                                  onClick: ($event) => modalApproval(data),
                                  class: "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105",
                                  type: "button"
                                }, toDisplayString(data.status), 9, ["onClick"])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "action" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  unref(hasPermission)("request-order: read") ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => modalLiatData(data),
                                    class: "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    type: "button",
                                    title: "Lihat Detail"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "2",
                                      stroke: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("request-order: update") && data.status == "Sedang diverifikasi" ? (openBlock(), createBlock(unref(Link), {
                                    key: 1,
                                    href: _ctx.route("requestOrders.edit", data.id),
                                    class: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    title: "Edit"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "2",
                                        stroke: "currentColor",
                                        class: "w-4 h-4"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        })
                                      ]))
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])) : createCommentVNode("", true),
                                  unref(hasPermission)("request-order: delete") ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    onClick: ($event) => modalHapusData(data),
                                    type: "button",
                                    class: "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    title: "Hapus"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "2",
                                      stroke: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ])
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
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$3, {
                            status: "number",
                            class: "font-semibold text-gray-600"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, {
                            status: "record",
                            class: "font-bold text-gray-900"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.ro_number), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, {
                            status: "record",
                            class: "text-gray-700"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_id[0]["branch_name"]), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, {
                            status: "record",
                            class: "text-gray-600"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatTanggal(data.date)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, { status: "record" }, {
                            default: withCtx(() => [
                              createVNode("button", {
                                onClick: ($event) => modalApproval(data),
                                class: "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105",
                                type: "button"
                              }, toDisplayString(data.status), 9, ["onClick"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$3, { status: "action" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                unref(hasPermission)("request-order: read") ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  onClick: ($event) => modalLiatData(data),
                                  class: "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                  type: "button",
                                  title: "Lihat Detail"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "2",
                                    stroke: "currentColor",
                                    class: "w-4 h-4"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    }),
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true),
                                unref(hasPermission)("request-order: update") && data.status == "Sedang diverifikasi" ? (openBlock(), createBlock(unref(Link), {
                                  key: 1,
                                  href: _ctx.route("requestOrders.edit", data.id),
                                  class: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                  title: "Edit"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "2",
                                      stroke: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      })
                                    ]))
                                  ]),
                                  _: 2
                                }, 1032, ["href"])) : createCommentVNode("", true),
                                unref(hasPermission)("request-order: delete") ? (openBlock(), createBlock("button", {
                                  key: 2,
                                  onClick: ($event) => modalHapusData(data),
                                  type: "button",
                                  class: "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                  title: "Hapus"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "2",
                                    stroke: "currentColor",
                                    class: "w-4 h-4"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true)
                              ])
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
              pagination: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="bg-gray-50 px-4 py-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    pagination: __props.fetchData.meta
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "bg-gray-50 px-4 py-3" }, [
                      createVNode(_sfc_main$2, {
                        pagination: __props.fetchData.meta
                      }, null, 8, ["pagination"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              show: showModalApproval.value,
              onClose: closeModalApproval
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-md font-semibold text-gray-900 dark:text-white text-center"${_scopeId2}>${ssrInterpolate(unref(form).ro_number)}</h3></div><div class="py-2"${_scopeId2}><div class="grid grid-cols-2"${_scopeId2}><div class="px-5 relative overflow-x-auto"${_scopeId2}><table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId2}><tbody${_scopeId2}><tr class="bg-white dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> NOMOR PERMINTAAN PESANAN </th><td class=""${_scopeId2}> : ${ssrInterpolate(unref(form).ro_number)}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL PERMINTAAN </th><td class=""${_scopeId2}> : ${ssrInterpolate(formatTanggal(unref(form).date))}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> PERMINTAAN DARI </th><td class=""${_scopeId2}> : ${ssrInterpolate(unref(form).branch_id[0]["branch_name"])}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> ATAS NAMA </th><td class=""${_scopeId2}> : ${ssrInterpolate(unref(form).last_update.user.name)}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> STATUS PERMINTAAN </th><td class=""${_scopeId2}> : <p class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"${_scopeId2}>${ssrInterpolate(unref(form).status)}</p></td></tr></tbody></table></div></div></div><div class="flex items-center justify-center dark:border-gray-600"${_scopeId2}><h3 class="text-md font-semibold text-gray-900 dark:text-white text-center"${_scopeId2}> BARANG </h3></div><div class="grid grid-cols-1 py-4 px-5"${_scopeId2}><div class="table-fixed"${_scopeId2}><table class="border-collapse border border-gray-400 w-full"${_scopeId2}><thead${_scopeId2}><tr${_scopeId2}><th class="border border-gray-300"${_scopeId2}>No</th><th class="border border-gray-300"${_scopeId2}>Nama Barang</th><th class="border border-gray-300"${_scopeId2}>Jumlah Barang</th>`);
                  if (unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat") {
                    _push3(`<th class="border border-gray-300"${_scopeId2}> Stok </th>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<th class="border border-gray-300"${_scopeId2}>Permintaan Yang Disetujui</th></tr></thead><tbody${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(form).listData, (list, index) => {
                    _push3(`<tr${_scopeId2}><td class="border border-gray-300 py-1 px-2 text-center"${_scopeId2}>${ssrInterpolate(index + 1)}</td><td class="border border-gray-300 py-1 px-2"${_scopeId2}>${ssrInterpolate(list.center_stock.product.product_name)}</td><td class="border border-gray-300 py-1 px-2 text-center"${_scopeId2}>${ssrInterpolate(list.quantity)}</td>`);
                    if (unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat") {
                      _push3(`<td class="border border-gray-300 py-1 px-2 text-center"${_scopeId2}>${ssrInterpolate(list.center_stock.stock)}</td>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<td class="border border-gray-300 py-1 px-2 text-center"${_scopeId2}>`);
                    if (unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat") {
                      _push3(`<div${_scopeId2}>`);
                      if (list.status !== 0) {
                        _push3(`<!--[-->${ssrInterpolate(list.approved_quantity)}<!--]-->`);
                      } else {
                        _push3(ssrRenderComponent(_sfc_main$5, {
                          modelValue: list.approved_quantity,
                          "onUpdate:modelValue": [($event) => list.approved_quantity = $event, (value) => list.approved_quantity = value],
                          "model-value": list.approved_quantity || "",
                          type: "text",
                          class: "block w-full bg-white text-center",
                          placeholder: "Jumlah Barang"
                        }, null, _parent3, _scopeId2));
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<div${_scopeId2}>${ssrInterpolate(list.approved_quantity)}</div>`);
                    }
                    _push3(`</td></tr>`);
                  });
                  _push3(`<!--]--></tbody></table></div></div><div class="flex items-center justify-center dark:border-gray-600"${_scopeId2}><h3 class="text-md font-semibold text-gray-900 dark:text-white text-center"${_scopeId2}> PROSES PERMINTAAN </h3></div><div class="pb-14 grid grid-cols-1"${_scopeId2}><div class="mx-4 p-4"${_scopeId2}><div class="flex items-center"${_scopeId2}><!--[-->`);
                  ssrRenderList(steps, (step, index) => {
                    _push3(`<!--[--><div class="${ssrRenderClass([{
                      "text-gray-500": index + 1 > unref(form).log.length + 1,
                      "text-white bg-blue-500 rounded-full border-blue-500": index + 1 === unref(form).log.length + 1,
                      "text-blue-500": index + 1 < unref(form).log.length + 1
                    }, "flex items-center relative"])}"${_scopeId2}><div class="${ssrRenderClass([{
                      "border-2 border-gray-300": index + 1 > unref(form).log.length + 1,
                      "border-2 border-blue-500": index + 1 === unref(form).log.length + 1,
                      "border-4 border-blue-500": index + 1 < unref(form).log.length + 1
                    }, "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 flex items-center justify-center font-bold text-xl"])}"${_scopeId2}>`);
                    if (index + 1 <= unref(form).log.length) {
                      _push3(`<span${_scopeId2}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-6"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"${_scopeId2}></path></svg></span>`);
                    } else {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(index + 1)}</span>`);
                    }
                    _push3(`</div><div class="${ssrRenderClass([{
                      "text-gray-500": index + 1 > unref(form).log.length + 1,
                      "text-blue-500": index + 1 <= unref(form).log.length + 1
                    }, "absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase"])}"${_scopeId2}>${ssrInterpolate(step)}</div></div>`);
                    if (index < steps.length - 1) {
                      _push3(`<div class="${ssrRenderClass([{
                        "border-t-2 border-gray-300": index + 1 >= unref(form).log.length + 1,
                        "border-t-4 border-blue-500": index + 1 < unref(form).log.length + 1
                      }, "flex-auto transition duration-500 ease-in-out"])}"${_scopeId2}></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]--></div></div></div>`);
                  if (canViewSelect.value) {
                    _push3(`<div class="flex items-center justify-center dark:border-gray-600"${_scopeId2}><h3 class="text-md font-semibold text-gray-900 dark:text-white text-center"${_scopeId2}> PERSETUJUAN </h3></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (canViewSelect.value) {
                    _push3(`<div class="grid grid-cols-3 gap-4 pb-5"${_scopeId2}><div class="col-start-2"${_scopeId2}><form class="max-w-sm mx-auto"${_scopeId2}><div class="grid grid-cols-1 gap-4"${_scopeId2}><div${_scopeId2}><select id="approval-select" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}><option value="" selected disabled${_scopeId2}>Pilih</option><!--[-->`);
                    ssrRenderList(approvalOptions.value, (option) => {
                      _push3(`<option${ssrRenderAttr("value", option)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).approval) ? ssrLooseContain(unref(form).approval, option) : ssrLooseEqual(unref(form).approval, option)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(option)}</option>`);
                    });
                    _push3(`<!--]--></select>`);
                    _push3(ssrRenderComponent(_sfc_main$6, {
                      class: "mt-2",
                      message: unref(form).errors.approval
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}><button type="submit" class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${_scopeId2}> SIMPAN </button></div></div></form></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, toDisplayString(unref(form).ro_number), 1)
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "grid grid-cols-2" }, [
                          createVNode("div", { class: "px-5 relative overflow-x-auto" }, [
                            createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                              createVNode("tbody", null, [
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " NOMOR PERMINTAAN PESANAN "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).ro_number), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " TANGGAL PERMINTAAN "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(formatTanggal(unref(form).date)), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " PERMINTAAN DARI "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).branch_id[0]["branch_name"]), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " ATAS NAMA "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).last_update.user.name), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " STATUS PERMINTAAN "),
                                  createVNode("td", { class: "" }, [
                                    createTextVNode(" : "),
                                    createVNode("p", { class: "text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" }, toDisplayString(unref(form).status), 1)
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center justify-center dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " BARANG ")
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 py-4 px-5" }, [
                        createVNode("div", { class: "table-fixed" }, [
                          createVNode("table", { class: "border-collapse border border-gray-400 w-full" }, [
                            createVNode("thead", null, [
                              createVNode("tr", null, [
                                createVNode("th", { class: "border border-gray-300" }, "No"),
                                createVNode("th", { class: "border border-gray-300" }, "Nama Barang"),
                                createVNode("th", { class: "border border-gray-300" }, "Jumlah Barang"),
                                unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("th", {
                                  key: 0,
                                  class: "border border-gray-300"
                                }, " Stok ")) : createCommentVNode("", true),
                                createVNode("th", { class: "border border-gray-300" }, "Permintaan Yang Disetujui")
                              ])
                            ]),
                            createVNode("tbody", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                return openBlock(), createBlock("tr", {
                                  key: list.id
                                }, [
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, toDisplayString(index + 1), 1),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2" }, toDisplayString(list.center_stock.product.product_name), 1),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, toDisplayString(list.quantity), 1),
                                  unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("td", {
                                    key: 0,
                                    class: "border border-gray-300 py-1 px-2 text-center"
                                  }, toDisplayString(list.center_stock.stock), 1)) : createCommentVNode("", true),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, [
                                    unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("div", { key: 0 }, [
                                      list.status !== 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createTextVNode(toDisplayString(list.approved_quantity), 1)
                                      ], 64)) : (openBlock(), createBlock(_sfc_main$5, {
                                        key: 1,
                                        modelValue: list.approved_quantity,
                                        "onUpdate:modelValue": [($event) => list.approved_quantity = $event, (value) => list.approved_quantity = value],
                                        "model-value": list.approved_quantity || "",
                                        type: "text",
                                        class: "block w-full bg-white text-center",
                                        placeholder: "Jumlah Barang"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "model-value"]))
                                    ])) : (openBlock(), createBlock("div", { key: 1 }, toDisplayString(list.approved_quantity), 1))
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center justify-center dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " PROSES PERMINTAAN ")
                      ]),
                      createVNode("div", { class: "pb-14 grid grid-cols-1" }, [
                        createVNode("div", { class: "mx-4 p-4" }, [
                          createVNode("div", { class: "flex items-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(steps, (step, index) => {
                              return openBlock(), createBlock(Fragment, { key: index }, [
                                createVNode("div", {
                                  class: ["flex items-center relative", {
                                    "text-gray-500": index + 1 > unref(form).log.length + 1,
                                    "text-white bg-blue-500 rounded-full border-blue-500": index + 1 === unref(form).log.length + 1,
                                    "text-blue-500": index + 1 < unref(form).log.length + 1
                                  }]
                                }, [
                                  createVNode("div", {
                                    class: ["rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 flex items-center justify-center font-bold text-xl", {
                                      "border-2 border-gray-300": index + 1 > unref(form).log.length + 1,
                                      "border-2 border-blue-500": index + 1 === unref(form).log.length + 1,
                                      "border-4 border-blue-500": index + 1 < unref(form).log.length + 1
                                    }]
                                  }, [
                                    index + 1 <= unref(form).log.length ? (openBlock(), createBlock("span", { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "3",
                                        stroke: "currentColor",
                                        class: "size-6"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "m4.5 12.75 6 6 9-13.5"
                                        })
                                      ]))
                                    ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(index + 1), 1))
                                  ], 2),
                                  createVNode("div", {
                                    class: ["absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase", {
                                      "text-gray-500": index + 1 > unref(form).log.length + 1,
                                      "text-blue-500": index + 1 <= unref(form).log.length + 1
                                    }]
                                  }, toDisplayString(step), 3)
                                ], 2),
                                index < steps.length - 1 ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: ["flex-auto transition duration-500 ease-in-out", {
                                    "border-t-2 border-gray-300": index + 1 >= unref(form).log.length + 1,
                                    "border-t-4 border-blue-500": index + 1 < unref(form).log.length + 1
                                  }]
                                }, null, 2)) : createCommentVNode("", true)
                              ], 64);
                            }), 64))
                          ])
                        ])
                      ]),
                      canViewSelect.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center dark:border-gray-600"
                      }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " PERSETUJUAN ")
                      ])) : createCommentVNode("", true),
                      canViewSelect.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "grid grid-cols-3 gap-4 pb-5"
                      }, [
                        createVNode("div", { class: "col-start-2" }, [
                          createVNode("form", {
                            onSubmit: withModifiers(submitApproval, ["prevent"]),
                            class: "max-w-sm mx-auto"
                          }, [
                            createVNode("div", { class: "grid grid-cols-1 gap-4" }, [
                              createVNode("div", null, [
                                withDirectives(createVNode("select", {
                                  "onUpdate:modelValue": ($event) => unref(form).approval = $event,
                                  id: "approval-select",
                                  class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                }, [
                                  createVNode("option", {
                                    value: "",
                                    selected: "",
                                    disabled: ""
                                  }, "Pilih"),
                                  (openBlock(true), createBlock(Fragment, null, renderList(approvalOptions.value, (option) => {
                                    return openBlock(), createBlock("option", {
                                      key: option,
                                      value: option
                                    }, toDisplayString(option), 9, ["value"]);
                                  }), 128))
                                ], 8, ["onUpdate:modelValue"]), [
                                  [vModelSelect, unref(form).approval]
                                ]),
                                createVNode(_sfc_main$6, {
                                  class: "mt-2",
                                  message: unref(form).errors.approval
                                }, null, 8, ["message"])
                              ]),
                              createVNode("div", null, [
                                createVNode("button", {
                                  type: "submit",
                                  class: "text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                }, " SIMPAN ")
                              ])
                            ])
                          ], 32)
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              show: showModalRead.value,
              onClose: closeModalRead
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> TAMPILKAN PERMINTAAN PESANAN </h3></div><div class="py-2"${_scopeId2}><div class="relative overflow-x-auto"${_scopeId2}><table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId2}><tbody${_scopeId2}><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> ID </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).id)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> NOMOR PERMINTAAN PESANAN </th><td class="px-6 py-4 font-bold"${_scopeId2}>${ssrInterpolate(unref(form).ro_number)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> CABANG </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).branch_id[0]["branch_name"])}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(formatTanggal(unref(form).date))}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> STATUS PESANAN </th><td class="px-6 py-4"${_scopeId2}><p class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button"${_scopeId2}>${ssrInterpolate(unref(form).status)}</p></td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> BARANG </th><td class="px-6 py-4"${_scopeId2}><table class="border-collapse border border-gray-400"${_scopeId2}><thead${_scopeId2}><tr${_scopeId2}><th class="border border-gray-300 px-2"${_scopeId2}>No</th><th class="border border-gray-300 px-2"${_scopeId2}>Nama Barang</th><th class="border border-gray-300 px-2"${_scopeId2}>Jumlah Barang</th></tr></thead><tbody${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(form).listData, (list, index) => {
                    _push3(`<tr${_scopeId2}><td class="border border-gray-300 px-2 text-center"${_scopeId2}>${ssrInterpolate(index + 1)}</td><td class="border border-gray-300 px-2"${_scopeId2}>${ssrInterpolate(list.center_stock.product.product_name)}</td><td class="border border-gray-300 px-2 text-center"${_scopeId2}>${ssrInterpolate(list.quantity)}</td></tr>`);
                  });
                  _push3(`<!--]--></tbody></table></td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> DIUBAH OLEH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).last_update.user.name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIBUAT </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).created_at)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIUBAH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).updated_at)}</td></tr></tbody></table></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN PERMINTAAN PESANAN ")
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "relative overflow-x-auto" }, [
                          createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                            createVNode("tbody", null, [
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ID "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).id), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " NOMOR PERMINTAAN PESANAN "),
                                createVNode("td", { class: "px-6 py-4 font-bold" }, toDisplayString(unref(form).ro_number), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_id[0]["branch_name"]), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " STATUS PESANAN "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("p", {
                                    class: "text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                    type: "button"
                                  }, toDisplayString(unref(form).status), 1)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " BARANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("table", { class: "border-collapse border border-gray-400" }, [
                                    createVNode("thead", null, [
                                      createVNode("tr", null, [
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "No"),
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "Nama Barang"),
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "Jumlah Barang")
                                      ])
                                    ]),
                                    createVNode("tbody", null, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                        return openBlock(), createBlock("tr", {
                                          key: list.id
                                        }, [
                                          createVNode("td", { class: "border border-gray-300 px-2 text-center" }, toDisplayString(index + 1), 1),
                                          createVNode("td", { class: "border border-gray-300 px-2" }, toDisplayString(list.center_stock.product.product_name), 1),
                                          createVNode("td", { class: "border border-gray-300 px-2 text-center" }, toDisplayString(list.quantity), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ])
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " DIUBAH OLEH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).last_update.user.name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIBUAT "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).created_at), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIUBAH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).updated_at), 1)
                              ])
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
            _push2(ssrRenderComponent(_sfc_main$4, {
              show: showModalDelete.value,
              onClose: closeModalDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="p-4 md:p-5 text-center"${_scopeId2}><svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"${_scopeId2}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg><h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"${_scopeId2}> Apakah anda yakin ingin menghapus permintaan pesanan ini ? </h3><button type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"${_scopeId2}> Ya, saya yakin </button><button type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"${_scopeId2}> Tidak, batalkan </button></div></div>`);
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
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus permintaan pesanan ini ? "),
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
              createVNode("div", { class: "grid grid-cols-1 h-full space-y-6" }, [
                createVNode("div", { class: "bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold" }, "Permintaan Stok"),
                      createVNode("p", { class: "text-blue-100 mt-1" }, "Kelola permintaan stok dari berbagai cabang")
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
                            d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                          })
                        ]))
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-md p-4" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row justify-between gap-4" }, [
                    createVNode("div", { class: "w-full md:w-1/3" }, [
                      createVNode("div", { class: "relative group" }, [
                        createVNode("div", { class: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            "stroke-width": "1.5",
                            stroke: "currentColor",
                            class: "w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            })
                          ]))
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : search = $event,
                          type: "text",
                          class: "bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400",
                          placeholder: "Cari nomor permintaan, cabang, atau status..."
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(search)]
                        ])
                      ])
                    ]),
                    createVNode("div", null, [
                      unref(hasPermission)("request-order: create") ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: _ctx.route("requestOrders.create"),
                        class: "px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            "stroke-width": "2",
                            stroke: "currentColor",
                            class: "w-5 h-5"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M12 4.5v15m7.5-7.5h-15"
                            })
                          ])),
                          createTextVNode(" Tambah Data ")
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-md overflow-hidden" }, [
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
                              createTextVNode("NOMOR PERMINTAAN")
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
                              createTextVNode("TANGGAL")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("STATUS")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("AKSI")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                        return openBlock(), createBlock(TableRow, {
                          key: data.id,
                          class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$3, {
                              status: "number",
                              class: "font-semibold text-gray-600"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "font-bold text-gray-900"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.ro_number), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-gray-700"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_id[0]["branch_name"]), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, {
                              status: "record",
                              class: "text-gray-600"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatTanggal(data.date)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "record" }, {
                              default: withCtx(() => [
                                createVNode("button", {
                                  onClick: ($event) => modalApproval(data),
                                  class: "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105",
                                  type: "button"
                                }, toDisplayString(data.status), 9, ["onClick"])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$3, { status: "action" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  unref(hasPermission)("request-order: read") ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => modalLiatData(data),
                                    class: "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    type: "button",
                                    title: "Lihat Detail"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "2",
                                      stroke: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("request-order: update") && data.status == "Sedang diverifikasi" ? (openBlock(), createBlock(unref(Link), {
                                    key: 1,
                                    href: _ctx.route("requestOrders.edit", data.id),
                                    class: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    title: "Edit"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "2",
                                        stroke: "currentColor",
                                        class: "w-4 h-4"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        })
                                      ]))
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])) : createCommentVNode("", true),
                                  unref(hasPermission)("request-order: delete") ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    onClick: ($event) => modalHapusData(data),
                                    type: "button",
                                    class: "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110",
                                    title: "Hapus"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "2",
                                      stroke: "currentColor",
                                      class: "w-4 h-4"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    pagination: withCtx(() => [
                      createVNode("div", { class: "bg-gray-50 px-4 py-3" }, [
                        createVNode(_sfc_main$2, {
                          pagination: __props.fetchData.meta
                        }, null, 8, ["pagination"])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_sfc_main$4, {
                  show: showModalApproval.value,
                  onClose: closeModalApproval
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, toDisplayString(unref(form).ro_number), 1)
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "grid grid-cols-2" }, [
                          createVNode("div", { class: "px-5 relative overflow-x-auto" }, [
                            createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                              createVNode("tbody", null, [
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " NOMOR PERMINTAAN PESANAN "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).ro_number), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " TANGGAL PERMINTAAN "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(formatTanggal(unref(form).date)), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " PERMINTAAN DARI "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).branch_id[0]["branch_name"]), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " ATAS NAMA "),
                                  createVNode("td", { class: "" }, " : " + toDisplayString(unref(form).last_update.user.name), 1)
                                ]),
                                createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700" }, [
                                  createVNode("th", {
                                    scope: "row",
                                    class: "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  }, " STATUS PERMINTAAN "),
                                  createVNode("td", { class: "" }, [
                                    createTextVNode(" : "),
                                    createVNode("p", { class: "text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" }, toDisplayString(unref(form).status), 1)
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center justify-center dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " BARANG ")
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 py-4 px-5" }, [
                        createVNode("div", { class: "table-fixed" }, [
                          createVNode("table", { class: "border-collapse border border-gray-400 w-full" }, [
                            createVNode("thead", null, [
                              createVNode("tr", null, [
                                createVNode("th", { class: "border border-gray-300" }, "No"),
                                createVNode("th", { class: "border border-gray-300" }, "Nama Barang"),
                                createVNode("th", { class: "border border-gray-300" }, "Jumlah Barang"),
                                unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("th", {
                                  key: 0,
                                  class: "border border-gray-300"
                                }, " Stok ")) : createCommentVNode("", true),
                                createVNode("th", { class: "border border-gray-300" }, "Permintaan Yang Disetujui")
                              ])
                            ]),
                            createVNode("tbody", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                return openBlock(), createBlock("tr", {
                                  key: list.id
                                }, [
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, toDisplayString(index + 1), 1),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2" }, toDisplayString(list.center_stock.product.product_name), 1),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, toDisplayString(list.quantity), 1),
                                  unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("td", {
                                    key: 0,
                                    class: "border border-gray-300 py-1 px-2 text-center"
                                  }, toDisplayString(list.center_stock.stock), 1)) : createCommentVNode("", true),
                                  createVNode("td", { class: "border border-gray-300 py-1 px-2 text-center" }, [
                                    unref(userRoles)[0] == "root" || unref(userRoles)[0] == "admin-pusat" ? (openBlock(), createBlock("div", { key: 0 }, [
                                      list.status !== 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createTextVNode(toDisplayString(list.approved_quantity), 1)
                                      ], 64)) : (openBlock(), createBlock(_sfc_main$5, {
                                        key: 1,
                                        modelValue: list.approved_quantity,
                                        "onUpdate:modelValue": [($event) => list.approved_quantity = $event, (value) => list.approved_quantity = value],
                                        "model-value": list.approved_quantity || "",
                                        type: "text",
                                        class: "block w-full bg-white text-center",
                                        placeholder: "Jumlah Barang"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "model-value"]))
                                    ])) : (openBlock(), createBlock("div", { key: 1 }, toDisplayString(list.approved_quantity), 1))
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center justify-center dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " PROSES PERMINTAAN ")
                      ]),
                      createVNode("div", { class: "pb-14 grid grid-cols-1" }, [
                        createVNode("div", { class: "mx-4 p-4" }, [
                          createVNode("div", { class: "flex items-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(steps, (step, index) => {
                              return openBlock(), createBlock(Fragment, { key: index }, [
                                createVNode("div", {
                                  class: ["flex items-center relative", {
                                    "text-gray-500": index + 1 > unref(form).log.length + 1,
                                    "text-white bg-blue-500 rounded-full border-blue-500": index + 1 === unref(form).log.length + 1,
                                    "text-blue-500": index + 1 < unref(form).log.length + 1
                                  }]
                                }, [
                                  createVNode("div", {
                                    class: ["rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 flex items-center justify-center font-bold text-xl", {
                                      "border-2 border-gray-300": index + 1 > unref(form).log.length + 1,
                                      "border-2 border-blue-500": index + 1 === unref(form).log.length + 1,
                                      "border-4 border-blue-500": index + 1 < unref(form).log.length + 1
                                    }]
                                  }, [
                                    index + 1 <= unref(form).log.length ? (openBlock(), createBlock("span", { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        "stroke-width": "3",
                                        stroke: "currentColor",
                                        class: "size-6"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          d: "m4.5 12.75 6 6 9-13.5"
                                        })
                                      ]))
                                    ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(index + 1), 1))
                                  ], 2),
                                  createVNode("div", {
                                    class: ["absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase", {
                                      "text-gray-500": index + 1 > unref(form).log.length + 1,
                                      "text-blue-500": index + 1 <= unref(form).log.length + 1
                                    }]
                                  }, toDisplayString(step), 3)
                                ], 2),
                                index < steps.length - 1 ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: ["flex-auto transition duration-500 ease-in-out", {
                                    "border-t-2 border-gray-300": index + 1 >= unref(form).log.length + 1,
                                    "border-t-4 border-blue-500": index + 1 < unref(form).log.length + 1
                                  }]
                                }, null, 2)) : createCommentVNode("", true)
                              ], 64);
                            }), 64))
                          ])
                        ])
                      ]),
                      canViewSelect.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center dark:border-gray-600"
                      }, [
                        createVNode("h3", { class: "text-md font-semibold text-gray-900 dark:text-white text-center" }, " PERSETUJUAN ")
                      ])) : createCommentVNode("", true),
                      canViewSelect.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "grid grid-cols-3 gap-4 pb-5"
                      }, [
                        createVNode("div", { class: "col-start-2" }, [
                          createVNode("form", {
                            onSubmit: withModifiers(submitApproval, ["prevent"]),
                            class: "max-w-sm mx-auto"
                          }, [
                            createVNode("div", { class: "grid grid-cols-1 gap-4" }, [
                              createVNode("div", null, [
                                withDirectives(createVNode("select", {
                                  "onUpdate:modelValue": ($event) => unref(form).approval = $event,
                                  id: "approval-select",
                                  class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                }, [
                                  createVNode("option", {
                                    value: "",
                                    selected: "",
                                    disabled: ""
                                  }, "Pilih"),
                                  (openBlock(true), createBlock(Fragment, null, renderList(approvalOptions.value, (option) => {
                                    return openBlock(), createBlock("option", {
                                      key: option,
                                      value: option
                                    }, toDisplayString(option), 9, ["value"]);
                                  }), 128))
                                ], 8, ["onUpdate:modelValue"]), [
                                  [vModelSelect, unref(form).approval]
                                ]),
                                createVNode(_sfc_main$6, {
                                  class: "mt-2",
                                  message: unref(form).errors.approval
                                }, null, 8, ["message"])
                              ]),
                              createVNode("div", null, [
                                createVNode("button", {
                                  type: "submit",
                                  class: "text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                }, " SIMPAN ")
                              ])
                            ])
                          ], 32)
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$4, {
                  show: showModalRead.value,
                  onClose: closeModalRead
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN PERMINTAAN PESANAN ")
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "relative overflow-x-auto" }, [
                          createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                            createVNode("tbody", null, [
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ID "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).id), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " NOMOR PERMINTAAN PESANAN "),
                                createVNode("td", { class: "px-6 py-4 font-bold" }, toDisplayString(unref(form).ro_number), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_id[0]["branch_name"]), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(formatTanggal(unref(form).date)), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " STATUS PESANAN "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("p", {
                                    class: "text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                    type: "button"
                                  }, toDisplayString(unref(form).status), 1)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " BARANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("table", { class: "border-collapse border border-gray-400" }, [
                                    createVNode("thead", null, [
                                      createVNode("tr", null, [
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "No"),
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "Nama Barang"),
                                        createVNode("th", { class: "border border-gray-300 px-2" }, "Jumlah Barang")
                                      ])
                                    ]),
                                    createVNode("tbody", null, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).listData, (list, index) => {
                                        return openBlock(), createBlock("tr", {
                                          key: list.id
                                        }, [
                                          createVNode("td", { class: "border border-gray-300 px-2 text-center" }, toDisplayString(index + 1), 1),
                                          createVNode("td", { class: "border border-gray-300 px-2" }, toDisplayString(list.center_stock.product.product_name), 1),
                                          createVNode("td", { class: "border border-gray-300 px-2 text-center" }, toDisplayString(list.quantity), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ])
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " DIUBAH OLEH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).last_update.user.name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIBUAT "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).created_at), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIUBAH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).updated_at), 1)
                              ])
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$4, {
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
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus permintaan pesanan ini ? "),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/RequestOrders/IndexRequestOrder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
