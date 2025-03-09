import { mergeProps, unref, withCtx, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "TablePagination",
  __ssrInlineRender: true,
  props: {
    pagination: Object
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "flex items-center flex-column flex-wrap md:flex-row justify-between p-4",
        "aria-label": "Table navigation"
      }, _attrs))}><span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"> Menampilkan <span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(__props.pagination.from)} - ${ssrInterpolate(__props.pagination.to)}</span> dari <span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(__props.pagination.total)}</span></span><ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8"><!--[-->`);
      ssrRenderList(__props.pagination.links, (link, index) => {
        _push(`<li class="text-white">`);
        if (index == 0) {
          _push(`<div>`);
          _push(ssrRenderComponent(unref(Link), {
            "preserve-scroll": "",
            href: link.url ?? "",
            class: "flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"${_scopeId}></path></svg>`);
              } else {
                return [
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
                      d: "M15.75 19.5 8.25 12l7.5-7.5"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else if (index == __props.pagination.links.length - 1) {
          _push(`<div>`);
          _push(ssrRenderComponent(unref(Link), {
            "preserve-scroll": "",
            href: link.url ?? "",
            class: "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"${_scopeId}></path></svg>`);
              } else {
                return [
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
                      d: "m8.25 4.5 7.5 7.5-7.5 7.5"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div>`);
          if (link.active) {
            _push(ssrRenderComponent(unref(Link), {
              "preserve-scroll": "",
              href: link.url ?? "",
              "aria-current": "page",
              class: "flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(link.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(link.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(ssrRenderComponent(unref(Link), {
              "preserve-scroll": "",
              href: link.url ?? "",
              class: "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(link.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(link.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          _push(`</div>`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/TablePagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
