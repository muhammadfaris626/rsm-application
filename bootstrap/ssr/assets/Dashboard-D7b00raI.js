import { unref, withCtx, createVNode, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { Head } from "@inertiajs/vue3";
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-4 gap-4 mb-4"${_scopeId}><div class="rounded-lg p-4 border-gray-200 border-dashed border-2"${_scopeId}><h5 class="text-xl font-medium text-gray-500 dark:text-gray-400"${_scopeId}>COURSES</h5><span class="text-4xl font-bold"${_scopeId}>49</span></div><div class="rounded-lg p-4 border-gray-200 border-dashed border-2"${_scopeId}><h5 class="text-xl font-medium text-gray-500 dark:text-gray-400"${_scopeId}>LESSONS</h5><span class="text-4xl font-bold"${_scopeId}>49</span></div><div class="rounded-lg p-4 border-gray-200 border-dashed border-2"${_scopeId}><h5 class="text-xl font-medium text-gray-500 dark:text-gray-400"${_scopeId}>TESTS</h5><span class="text-4xl font-bold"${_scopeId}>49</span></div><div class="rounded-lg p-4 border-gray-200 border-dashed border-2"${_scopeId}><h5 class="text-xl font-medium text-gray-500 dark:text-gray-400"${_scopeId}>QUESTIONS</h5><span class="text-4xl font-bold"${_scopeId}>49</span></div></div><div class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="grid grid-cols-2 gap-4 mb-4"${_scopeId}><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div></div><div class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div><div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"${_scopeId}><p class="text-2xl text-gray-400 dark:text-gray-500"${_scopeId}><svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"${_scopeId}></path></svg></p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-4 gap-4 mb-4" }, [
                createVNode("div", { class: "rounded-lg p-4 border-gray-200 border-dashed border-2" }, [
                  createVNode("h5", { class: "text-xl font-medium text-gray-500 dark:text-gray-400" }, "COURSES"),
                  createVNode("span", { class: "text-4xl font-bold" }, "49")
                ]),
                createVNode("div", { class: "rounded-lg p-4 border-gray-200 border-dashed border-2" }, [
                  createVNode("h5", { class: "text-xl font-medium text-gray-500 dark:text-gray-400" }, "LESSONS"),
                  createVNode("span", { class: "text-4xl font-bold" }, "49")
                ]),
                createVNode("div", { class: "rounded-lg p-4 border-gray-200 border-dashed border-2" }, [
                  createVNode("h5", { class: "text-xl font-medium text-gray-500 dark:text-gray-400" }, "TESTS"),
                  createVNode("span", { class: "text-4xl font-bold" }, "49")
                ]),
                createVNode("div", { class: "rounded-lg p-4 border-gray-200 border-dashed border-2" }, [
                  createVNode("h5", { class: "text-xl font-medium text-gray-500 dark:text-gray-400" }, "QUESTIONS"),
                  createVNode("span", { class: "text-4xl font-bold" }, "49")
                ])
              ]),
              createVNode("div", { class: "flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800" }, [
                createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-3.5 h-3.5",
                    "aria-hidden": "true",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 18 18"
                  }, [
                    createVNode("path", {
                      stroke: "currentColor",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 1v16M1 9h16"
                    })
                  ]))
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-2 gap-4 mb-4" }, [
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ])
              ]),
              createVNode("div", { class: "flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800" }, [
                createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-3.5 h-3.5",
                    "aria-hidden": "true",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 18 18"
                  }, [
                    createVNode("path", {
                      stroke: "currentColor",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 1v16M1 9h16"
                    })
                  ]))
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800" }, [
                  createVNode("p", { class: "text-2xl text-gray-400 dark:text-gray-500" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      "aria-hidden": "true",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 18 18"
                    }, [
                      createVNode("path", {
                        stroke: "currentColor",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9 1v16M1 9h16"
                      })
                    ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
