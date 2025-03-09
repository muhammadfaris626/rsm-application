import { ref, computed, watch, unref, withCtx, createVNode, withModifiers, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, isRef, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1, u as usePermission } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, usePage, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./Modal-BsYluhuH.js";
import { _ as _sfc_main$3 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$4 } from "./InputError-fLcttu_2.js";
import "./TextInput-CNvSDFvn.js";
import { T as Table, a as TableRow, _ as _sfc_main$6, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import { _ as _sfc_main$5 } from "./TablePagination-A5nS3meM.js";
import VueMultiselect from "vue-multiselect";
/* empty css                                                                  */
import "flowbite";
import "axios";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IndexManagementStructure",
  __ssrInlineRender: true,
  props: ["fetchData", "employees", "positions", "branches"],
  setup(__props) {
    const form = useForm({
      id: "",
      employee_id: "",
      position_id: "",
      branch_id: "",
      last_update: "",
      created_at: "",
      updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    let searchUrl = computed(() => {
      let url = new URL(route("managementStructures.index"));
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
    const showModalCreate = ref(false);
    const showModalRead = ref(false);
    const showModalUpdate = ref(false);
    const showModalDelete = ref(false);
    const closeModalCreate = () => {
      showModalCreate.value = false;
    };
    const closeModalRead = () => {
      showModalRead.value = false;
      form.reset();
      form.clearErrors();
    };
    const closeModalUpdate = () => {
      showModalUpdate.value = false;
      form.reset();
      form.clearErrors();
    };
    const closeModalDelete = () => {
      showModalDelete.value = false;
      form.reset();
      form.clearErrors();
    };
    const modalTambahData = () => {
      showModalCreate.value = true;
    };
    const modalLiatData = (data) => {
      showModalRead.value = true;
      form.id = data.id;
      form.employee_id = data.employee_id;
      form.position_id = data.position_id;
      form.branch_id = data.branch_id;
      form.last_update = data.last_update;
      form.created_at = data.created_at;
      form.updated_at = data.updated_at;
    };
    const modalUbahData = (data) => {
      showModalUpdate.value = true;
      form.id = data.id;
      form.employee_id = data.employee_id;
      form.position_id = data.position_id;
      form.branch_id = data.branch_id;
    };
    const modalHapusData = (data) => {
      showModalDelete.value = true;
      form.id = data.id;
    };
    const tambahData = () => {
      var _a, _b, _c;
      form.employee_id = (_a = form.employee_id) == null ? void 0 : _a.id;
      form.position_id = (_b = form.position_id) == null ? void 0 : _b.id;
      form.branch_id = (_c = form.branch_id) == null ? void 0 : _c.id;
      form.post(route("managementStructures.store"), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalCreate.value = false;
        }
      });
    };
    const ubahData = () => {
      var _a, _b, _c, _d, _e, _f;
      const employeeId = Array.isArray(form.employee_id) ? (_a = form.employee_id[0]) == null ? void 0 : _a.id : (_b = form.employee_id) == null ? void 0 : _b.id;
      form.employee_id = employeeId;
      const positionId = Array.isArray(form.position_id) ? (_c = form.position_id[0]) == null ? void 0 : _c.id : (_d = form.position_id) == null ? void 0 : _d.id;
      form.position_id = positionId;
      const branchId = Array.isArray(form.branch_id) ? (_e = form.branch_id[0]) == null ? void 0 : _e.id : (_f = form.branch_id) == null ? void 0 : _f.id;
      form.branch_id = branchId;
      form.put(route("managementStructures.update", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalUpdate.value = false;
        }
      });
    };
    const hapusData = () => {
      form.delete(route("managementStructures.destroy", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalDelete.value = false;
        }
      });
    };
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Struktur Manajemen" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"${_scopeId}></path></svg> Manajemen </a></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Struktur Manajemen</span></div></li></ol></nav></div><div class="flex justify-between my-3"${_scopeId}><div class="w-full md:w-1/4"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500 dark:text-gray-400"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(search))} type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pencarian"${_scopeId}></div></div><div${_scopeId}>`);
            if (unref(hasPermission)("management-structure: create")) {
              _push2(`<!--[--><button class="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId}></path></svg> Tambah Data </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                show: showModalCreate.value,
                onClose: closeModalCreate
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> TAMBAH STRUKTUR MANAJEMEN </h3></div><form${_scopeId2}><div class="grid grid-cols-2 gap-2 px-4 py-2"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      for: "employee_id",
                      value: "Nama Karyawan"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(VueMultiselect), {
                      modelValue: unref(form).employee_id,
                      "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                      options: __props.employees,
                      "close-on-select": true,
                      placeholder: "Pilih",
                      label: "name",
                      "track-by": "id"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.employee_id
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      for: "position_id",
                      value: "Jabatan"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(VueMultiselect), {
                      modelValue: unref(form).position_id,
                      "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                      options: __props.positions,
                      "close-on-select": true,
                      placeholder: "Pilih",
                      label: "position_name",
                      "track-by": "id"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.position_id
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      for: "branch_id",
                      value: "Cabang"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(VueMultiselect), {
                      modelValue: unref(form).branch_id,
                      "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                      options: __props.branches,
                      "close-on-select": true,
                      placeholder: "Pilih",
                      label: "branch_name",
                      "track-by": "id"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.branch_id
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"${_scopeId2}><button class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} type="submit"${_scopeId2}>Simpan</button></div></form></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                        createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                          createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMBAH STRUKTUR MANAJEMEN ")
                        ]),
                        createVNode("form", {
                          onSubmit: withModifiers(tambahData, ["prevent"])
                        }, [
                          createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                            createVNode("div", null, [
                              createVNode(_sfc_main$3, {
                                for: "employee_id",
                                value: "Nama Karyawan"
                              }),
                              createVNode(unref(VueMultiselect), {
                                modelValue: unref(form).employee_id,
                                "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                                options: __props.employees,
                                "close-on-select": true,
                                placeholder: "Pilih",
                                label: "name",
                                "track-by": "id"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.employee_id
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", null, [
                              createVNode(_sfc_main$3, {
                                for: "position_id",
                                value: "Jabatan"
                              }),
                              createVNode(unref(VueMultiselect), {
                                modelValue: unref(form).position_id,
                                "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                                options: __props.positions,
                                "close-on-select": true,
                                placeholder: "Pilih",
                                label: "position_name",
                                "track-by": "id"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.position_id
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", null, [
                              createVNode(_sfc_main$3, {
                                for: "branch_id",
                                value: "Cabang"
                              }),
                              createVNode(unref(VueMultiselect), {
                                modelValue: unref(form).branch_id,
                                "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                                options: __props.branches,
                                "close-on-select": true,
                                placeholder: "Pilih",
                                label: "branch_name",
                                "track-by": "id"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.branch_id
                              }, null, 8, ["message"])
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                            createVNode("button", {
                              class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                              disabled: unref(form).processing,
                              type: "submit"
                            }, "Simpan", 10, ["disabled"])
                          ])
                        ], 32)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
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
                              _push5(`NAMA KARYAWAN`);
                            } else {
                              return [
                                createTextVNode("NAMA KARYAWAN")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`JABATAN`);
                            } else {
                              return [
                                createTextVNode("JABATAN")
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
                        _push4(ssrRenderComponent(TableHeaderCell, null, null, _parent4, _scopeId3));
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
                              createTextVNode("NAMA KARYAWAN")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("JABATAN")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell)
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
                            createTextVNode("NAMA KARYAWAN")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("JABATAN")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell)
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
                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$6, { status: "number" }, {
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
                          _push4(ssrRenderComponent(_sfc_main$6, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.employee_id[0].name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.employee_id[0].name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$6, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.position_id[0].position_name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.position_id[0].position_name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$6, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_id[0].branch_name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_id[0].branch_name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$6, { status: "action" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (unref(hasPermission)("management-structure: read")) {
                                  _push5(`<button class="text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"${_scopeId4}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("management-structure: update")) {
                                  _push5(`<button class="text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("management-structure: delete")) {
                                  _push5(`<button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  unref(hasPermission)("management-structure: read") ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => modalLiatData(data),
                                    class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                    type: "button"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
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
                                  unref(hasPermission)("management-structure: update") ? (openBlock(), createBlock("button", {
                                    key: 1,
                                    onClick: ($event) => modalUbahData(data),
                                    class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                    type: "button"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("management-structure: delete") ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    onClick: ($event) => modalHapusData(data),
                                    type: "button",
                                    class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$6, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$6, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.employee_id[0].name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$6, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.position_id[0].position_name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$6, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_id[0].branch_name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$6, { status: "action" }, {
                              default: withCtx(() => [
                                unref(hasPermission)("management-structure: read") ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  onClick: ($event) => modalLiatData(data),
                                  class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                  type: "button"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
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
                                unref(hasPermission)("management-structure: update") ? (openBlock(), createBlock("button", {
                                  key: 1,
                                  onClick: ($event) => modalUbahData(data),
                                  class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                  type: "button"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true),
                                unref(hasPermission)("management-structure: delete") ? (openBlock(), createBlock("button", {
                                  key: 2,
                                  onClick: ($event) => modalHapusData(data),
                                  type: "button",
                                  class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true)
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
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.employee_id[0].name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.position_id[0].position_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_id[0].branch_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "action" }, {
                            default: withCtx(() => [
                              unref(hasPermission)("management-structure: read") ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: ($event) => modalLiatData(data),
                                class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
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
                              unref(hasPermission)("management-structure: update") ? (openBlock(), createBlock("button", {
                                key: 1,
                                onClick: ($event) => modalUbahData(data),
                                class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("management-structure: delete") ? (openBlock(), createBlock("button", {
                                key: 2,
                                onClick: ($event) => modalHapusData(data),
                                type: "button",
                                class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true)
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
                  _push3(ssrRenderComponent(_sfc_main$5, {
                    pagination: __props.fetchData.meta
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$5, {
                      pagination: __props.fetchData.meta
                    }, null, 8, ["pagination"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalRead.value,
              onClose: closeModalRead
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> TAMPILKAN STRUKTUR MANAJEMEN </h3></div><div class="py-2"${_scopeId2}><div class="relative overflow-x-auto"${_scopeId2}><table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId2}><tbody${_scopeId2}><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> ID </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).id)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> NAMA KARYAWAN </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).employee_id[0].name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> JABATAN </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).position_id[0].position_name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> CABANG </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).branch_id[0].branch_name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> DIUBAH OLEH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).last_update.user.name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIBUAT </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).created_at)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIUBAH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).updated_at)}</td></tr></tbody></table></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN STRUKTUR MANAJEMEN ")
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
                                }, " NAMA KARYAWAN "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).employee_id[0].name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " JABATAN "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).position_id[0].position_name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_id[0].branch_name), 1)
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
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalUpdate.value,
              onClose: closeModalUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> UBAH STRUKTUR MANAJEMEN </h3></div><form${_scopeId2}><div class="grid grid-cols-2 gap-2 px-4 py-2"${_scopeId2}><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$3, {
                    for: "employee_id",
                    value: "Nama Karyawan"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(VueMultiselect), {
                    modelValue: unref(form).employee_id,
                    "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                    options: __props.employees,
                    "close-on-select": true,
                    placeholder: "Pilih",
                    label: "name",
                    "track-by": "id"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "mt-2",
                    message: unref(form).errors.employee_id
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$3, {
                    for: "position_id",
                    value: "Jabatan"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(VueMultiselect), {
                    modelValue: unref(form).position_id,
                    "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                    options: __props.positions,
                    "close-on-select": true,
                    placeholder: "Pilih",
                    label: "position_name",
                    "track-by": "id"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "mt-2",
                    message: unref(form).errors.position_id
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$3, {
                    for: "branch_id",
                    value: "Cabang"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(VueMultiselect), {
                    modelValue: unref(form).branch_id,
                    "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                    options: __props.branches,
                    "close-on-select": true,
                    placeholder: "Pilih",
                    label: "branch_name",
                    "track-by": "id"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "mt-2",
                    message: unref(form).errors.branch_id
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"${_scopeId2}><button class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} type="submit"${_scopeId2}>Ubah</button></div></form></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UBAH STRUKTUR MANAJEMEN ")
                      ]),
                      createVNode("form", {
                        onSubmit: withModifiers(ubahData, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "employee_id",
                              value: "Nama Karyawan"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).employee_id,
                              "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                              options: __props.employees,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.employee_id
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "position_id",
                              value: "Jabatan"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).position_id,
                              "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                              options: __props.positions,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "position_name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.position_id
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "branch_id",
                              value: "Cabang"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).branch_id,
                              "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                              options: __props.branches,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "branch_name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.branch_id
                            }, null, 8, ["message"])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                          createVNode("button", {
                            class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                            disabled: unref(form).processing,
                            type: "submit"
                          }, "Ubah", 10, ["disabled"])
                        ])
                      ], 32)
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
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="p-4 md:p-5 text-center"${_scopeId2}><svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"${_scopeId2}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg><h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"${_scopeId2}> Apakah anda yakin ingin menghapus struktur manajemen ini ? </h3><button type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"${_scopeId2}> Ya, saya yakin </button><button type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"${_scopeId2}> Tidak, batalkan </button></div></div>`);
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
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus struktur manajemen ini ? "),
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Struktur Manajemen")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between my-3" }, [
                  createVNode("div", { class: "w-full md:w-1/4" }, [
                    createVNode("div", { class: "relative" }, [
                      createVNode("div", { class: "absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "w-4 h-4 text-gray-500 dark:text-gray-400"
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
                        id: "input-group-1",
                        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        placeholder: "Pencarian"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(search)]
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    unref(hasPermission)("management-structure: create") ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("button", {
                        onClick: ($event) => modalTambahData(),
                        class: "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "size-4"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M12 4.5v15m7.5-7.5h-15"
                          })
                        ])),
                        createTextVNode(" Tambah Data ")
                      ], 8, ["onClick"]),
                      createVNode(_sfc_main$2, {
                        show: showModalCreate.value,
                        onClose: closeModalCreate
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                            createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                              createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMBAH STRUKTUR MANAJEMEN ")
                            ]),
                            createVNode("form", {
                              onSubmit: withModifiers(tambahData, ["prevent"])
                            }, [
                              createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                                createVNode("div", null, [
                                  createVNode(_sfc_main$3, {
                                    for: "employee_id",
                                    value: "Nama Karyawan"
                                  }),
                                  createVNode(unref(VueMultiselect), {
                                    modelValue: unref(form).employee_id,
                                    "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                                    options: __props.employees,
                                    "close-on-select": true,
                                    placeholder: "Pilih",
                                    label: "name",
                                    "track-by": "id"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.employee_id
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", null, [
                                  createVNode(_sfc_main$3, {
                                    for: "position_id",
                                    value: "Jabatan"
                                  }),
                                  createVNode(unref(VueMultiselect), {
                                    modelValue: unref(form).position_id,
                                    "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                                    options: __props.positions,
                                    "close-on-select": true,
                                    placeholder: "Pilih",
                                    label: "position_name",
                                    "track-by": "id"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.position_id
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", null, [
                                  createVNode(_sfc_main$3, {
                                    for: "branch_id",
                                    value: "Cabang"
                                  }),
                                  createVNode(unref(VueMultiselect), {
                                    modelValue: unref(form).branch_id,
                                    "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                                    options: __props.branches,
                                    "close-on-select": true,
                                    placeholder: "Pilih",
                                    label: "branch_name",
                                    "track-by": "id"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.branch_id
                                  }, null, 8, ["message"])
                                ])
                              ]),
                              createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                                createVNode("button", {
                                  class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                                  disabled: unref(form).processing,
                                  type: "submit"
                                }, "Simpan", 10, ["disabled"])
                              ])
                            ], 32)
                          ])
                        ]),
                        _: 1
                      }, 8, ["show"])
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
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
                            createTextVNode("NAMA KARYAWAN")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("JABATAN")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell)
                      ]),
                      _: 1
                    })
                  ]),
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.employee_id[0].name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.position_id[0].position_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_id[0].branch_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$6, { status: "action" }, {
                            default: withCtx(() => [
                              unref(hasPermission)("management-structure: read") ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: ($event) => modalLiatData(data),
                                class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
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
                              unref(hasPermission)("management-structure: update") ? (openBlock(), createBlock("button", {
                                key: 1,
                                onClick: ($event) => modalUbahData(data),
                                class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("management-structure: delete") ? (openBlock(), createBlock("button", {
                                key: 2,
                                onClick: ($event) => modalHapusData(data),
                                type: "button",
                                class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  pagination: withCtx(() => [
                    createVNode(_sfc_main$5, {
                      pagination: __props.fetchData.meta
                    }, null, 8, ["pagination"])
                  ]),
                  _: 1
                }),
                createVNode(_sfc_main$2, {
                  show: showModalRead.value,
                  onClose: closeModalRead
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN STRUKTUR MANAJEMEN ")
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
                                }, " NAMA KARYAWAN "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).employee_id[0].name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " JABATAN "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).position_id[0].position_name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_id[0].branch_name), 1)
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
                createVNode(_sfc_main$2, {
                  show: showModalUpdate.value,
                  onClose: closeModalUpdate
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UBAH STRUKTUR MANAJEMEN ")
                      ]),
                      createVNode("form", {
                        onSubmit: withModifiers(ubahData, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "employee_id",
                              value: "Nama Karyawan"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).employee_id,
                              "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                              options: __props.employees,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.employee_id
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "position_id",
                              value: "Jabatan"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).position_id,
                              "onUpdate:modelValue": ($event) => unref(form).position_id = $event,
                              options: __props.positions,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "position_name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.position_id
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode(_sfc_main$3, {
                              for: "branch_id",
                              value: "Cabang"
                            }),
                            createVNode(unref(VueMultiselect), {
                              modelValue: unref(form).branch_id,
                              "onUpdate:modelValue": ($event) => unref(form).branch_id = $event,
                              options: __props.branches,
                              "close-on-select": true,
                              placeholder: "Pilih",
                              label: "branch_name",
                              "track-by": "id"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.branch_id
                            }, null, 8, ["message"])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                          createVNode("button", {
                            class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                            disabled: unref(form).processing,
                            type: "submit"
                          }, "Ubah", 10, ["disabled"])
                        ])
                      ], 32)
                    ])
                  ]),
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
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus struktur manajemen ini ? "),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Managements/ManagementStructures/IndexManagementStructure.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
