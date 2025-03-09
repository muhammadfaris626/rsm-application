import { watch, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$3 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$4 } from "./TextInput-CNvSDFvn.js";
import { _ as _sfc_main$5 } from "./Textarea-CO9y0V9s.js";
import VueMultiselect from "vue-multiselect";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "CreateMutation",
  __ssrInlineRender: true,
  props: {
    employees: {
      type: Array
    },
    branches: {
      type: Array
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      employee_id: "",
      from_branch_id: "",
      to_branch_id: "",
      transfer_date: "",
      reason: ""
    });
    watch(() => form.employee_id, (selectedEmployee) => {
      if (selectedEmployee) {
        form.from_branch_id = selectedEmployee.branch_id || "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Mutasi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"${_scopeId}></path></svg> Karyawan </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("mutations.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Data Mutasi`);
                } else {
                  return [
                    createTextVNode("Data Mutasi")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Tambah Mutasi</span></div></li></ol></nav></div><div class="pt-4"${_scopeId}><h1 class="text-xl font-semibold text-blue-600"${_scopeId}>TAMBAH MUTASI</h1><form${_scopeId}><div class="grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "employee_id",
              value: "Karyawan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).employee_id,
              "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
              options: props.employees,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-2",
              message: unref(form).errors.employee_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "from_branch_id",
              value: "Asal Cabang"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).from_branch_id,
              "onUpdate:modelValue": ($event) => unref(form).from_branch_id = $event,
              options: props.branches,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "branch_name",
              "track-by": "id",
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-2",
              message: unref(form).errors.from_branch_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "to_branch_id",
              value: "Tujuan Cabang"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VueMultiselect), {
              modelValue: unref(form).to_branch_id,
              "onUpdate:modelValue": ($event) => unref(form).to_branch_id = $event,
              options: props.branches,
              "close-on-select": true,
              placeholder: "Pilih",
              label: "branch_name",
              "track-by": "id"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-2",
              message: unref(form).errors.to_branch_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "transfer_date",
              value: "Tanggal Mutasi"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "transfer_date",
              type: "date",
              class: "mt-1 block w-full",
              modelValue: unref(form).transfer_date,
              "onUpdate:modelValue": ($event) => unref(form).transfer_date = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-2",
              message: unref(form).errors.transfer_date
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-span-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "reason",
              value: "Keterangan Mutasi"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              row: 9,
              modelValue: unref(form).reason,
              "onUpdate:modelValue": ($event) => unref(form).reason = $event,
              placeholder: "Silahkan masukkan keterangan mutasi disini..."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-2",
              message: unref(form).errors.reason
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="mt-6"${_scopeId}><button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${_scopeId}>SIMPAN</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("mutations.index"),
              class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`KEMBALI`);
                } else {
                  return [
                    createTextVNode("KEMBALI")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div>`);
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
                            href: _ctx.route("mutations.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Data Mutasi")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Tambah Mutasi")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "pt-4" }, [
                  createVNode("h1", { class: "text-xl font-semibold text-blue-600" }, "TAMBAH MUTASI"),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => unref(form).post(_ctx.route("mutations.store")), ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl" }, [
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "employee_id",
                          value: "Karyawan"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).employee_id,
                          "onUpdate:modelValue": ($event) => unref(form).employee_id = $event,
                          options: props.employees,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$3, {
                          class: "mt-2",
                          message: unref(form).errors.employee_id
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "from_branch_id",
                          value: "Asal Cabang"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).from_branch_id,
                          "onUpdate:modelValue": ($event) => unref(form).from_branch_id = $event,
                          options: props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "branch_name",
                          "track-by": "id",
                          disabled: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$3, {
                          class: "mt-2",
                          message: unref(form).errors.from_branch_id
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "to_branch_id",
                          value: "Tujuan Cabang"
                        }),
                        createVNode(unref(VueMultiselect), {
                          modelValue: unref(form).to_branch_id,
                          "onUpdate:modelValue": ($event) => unref(form).to_branch_id = $event,
                          options: props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih",
                          label: "branch_name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                        createVNode(_sfc_main$3, {
                          class: "mt-2",
                          message: unref(form).errors.to_branch_id
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_sfc_main$2, {
                          for: "transfer_date",
                          value: "Tanggal Mutasi"
                        }),
                        createVNode(_sfc_main$4, {
                          id: "transfer_date",
                          type: "date",
                          class: "mt-1 block w-full",
                          modelValue: unref(form).transfer_date,
                          "onUpdate:modelValue": ($event) => unref(form).transfer_date = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$3, {
                          class: "mt-2",
                          message: unref(form).errors.transfer_date
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", { class: "col-span-2" }, [
                        createVNode(_sfc_main$2, {
                          for: "reason",
                          value: "Keterangan Mutasi"
                        }),
                        createVNode(_sfc_main$5, {
                          row: 9,
                          modelValue: unref(form).reason,
                          "onUpdate:modelValue": ($event) => unref(form).reason = $event,
                          placeholder: "Silahkan masukkan keterangan mutasi disini..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$3, {
                          class: "mt-2",
                          message: unref(form).errors.reason
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("button", {
                        type: "submit",
                        class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      }, "SIMPAN"),
                      createVNode(unref(Link), {
                        href: _ctx.route("mutations.index"),
                        class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("KEMBALI")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Employees/Mutations/CreateMutation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
