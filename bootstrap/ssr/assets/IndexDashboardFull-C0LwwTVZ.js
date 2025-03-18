import { ref, computed, watch, onMounted, unref, withCtx, createVNode, createBlock, createTextVNode, openBlock, createCommentVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { router, Head } from "@inertiajs/vue3";
import VueMultiselect from "vue-multiselect";
import { _ as _sfc_main$2 } from "./TextInput-CNvSDFvn.js";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "IndexDashboardFull",
  __ssrInlineRender: true,
  props: ["branches", "sales", "employeeActive", "branchActive", "expenditures", "profile", "userRoleVisitor"],
  setup(__props) {
    const selectBranch = ref(""), selectStartDate = ref(""), selectEndDate = ref("");
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Beranda" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full gap-4"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"${_scopeId}></path></svg> Beranda </a></li></ol></nav></div><div class="flex justify-between"${_scopeId}><div${_scopeId}></div><div${_scopeId}><div class="flex justify-end"${_scopeId}>`);
            if (__props.userRoleVisitor != "admin-branch") {
              _push2(`<div class="flex items-center justify-start mx-2"${_scopeId}> Cabang : </div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.userRoleVisitor != "admin-branch") {
              _push2(`<div class="w-64"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(VueMultiselect), {
                modelValue: selectBranch.value,
                "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                options: __props.branches,
                "close-on-select": true,
                placeholder: "Pilih cabang",
                label: "branch_name",
                "track-by": "id"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-start mx-2"${_scopeId}> Dari : </div><div class="w-30"${_scopeId}>`);
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
            _push2(`</div></div></div></div><div class="grid grid-cols-4 gap-4"${_scopeId}><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-green-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Omzet</strong></p><p class="uppercase text-center text-3xl p-4 text-green-500 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah((__props.sales || []).reduce((sum, item) => sum + Number(item.total_price), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-red-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Pengeluaran</strong></p><p class="uppercase text-center text-3xl p-4 text-red-500 font-bold"${_scopeId}>${ssrInterpolate(formatRupiah(__props.expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)))}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Karyawan Aktif</strong></p><p class="uppercase text-center text-3xl p-4 text-blue-500 font-bold"${_scopeId}>${ssrInterpolate(__props.employeeActive)}</p></div><div class="bg-white rounded-xl shadow-lg"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Cabang Aktif</strong></p><p class="uppercase text-center text-3xl p-4 text-purple-500 font-bold"${_scopeId}>${ssrInterpolate(__props.branchActive)}</p></div>`);
            if (__props.profile != null) {
              _push2(`<div class="bg-white rounded-xl shadow-lg col-span-4"${_scopeId}><p class="font-thin uppercase text-center py-1 bg-yellow-700 rounded-t-xl text-white"${_scopeId}><strong${_scopeId}>Profil Cabang</strong></p><p class="text-justify text-xl p-4 text-gray-500"${_scopeId}>${ssrInterpolate(__props.profile.description)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
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
                              d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            })
                          ])),
                          createTextVNode(" Beranda ")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between" }, [
                  createVNode("div"),
                  createVNode("div", null, [
                    createVNode("div", { class: "flex justify-end" }, [
                      __props.userRoleVisitor != "admin-branch" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-start mx-2"
                      }, " Cabang : ")) : createCommentVNode("", true),
                      __props.userRoleVisitor != "admin-branch" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-64"
                      }, [
                        createVNode(unref(VueMultiselect), {
                          modelValue: selectBranch.value,
                          "onUpdate:modelValue": ($event) => selectBranch.value = $event,
                          options: __props.branches,
                          "close-on-select": true,
                          placeholder: "Pilih cabang",
                          label: "branch_name",
                          "track-by": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ])) : createCommentVNode("", true),
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
                createVNode("div", { class: "grid grid-cols-4 gap-4" }, [
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
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Karyawan Aktif")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-blue-500 font-bold" }, toDisplayString(__props.employeeActive), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl shadow-lg" }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Cabang Aktif")
                    ]),
                    createVNode("p", { class: "uppercase text-center text-3xl p-4 text-purple-500 font-bold" }, toDisplayString(__props.branchActive), 1)
                  ]),
                  __props.profile != null ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-white rounded-xl shadow-lg col-span-4"
                  }, [
                    createVNode("p", { class: "font-thin uppercase text-center py-1 bg-yellow-700 rounded-t-xl text-white" }, [
                      createVNode("strong", null, "Profil Cabang")
                    ]),
                    createVNode("p", { class: "text-justify text-xl p-4 text-gray-500" }, toDisplayString(__props.profile.description), 1)
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboards/IndexDashboardFull.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
