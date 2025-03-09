import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
const _sfc_main = {
  __name: "ApiTablePagination",
  __ssrInlineRender: true,
  props: {
    pagination: Object
  },
  emits: ["page-change"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "flex items-center flex-column flex-wrap md:flex-row justify-between p-4",
        "aria-label": "Table navigation"
      }, _attrs))}><span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"> Menampilkan <span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(__props.pagination.from)} - ${ssrInterpolate(__props.pagination.to)}</span> dari <span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(__props.pagination.total)}</span></span><ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8"><!--[-->`);
      ssrRenderList(__props.pagination.links, (link, index) => {
        _push(`<li class="text-white"><button${ssrIncludeBooleanAttr(!link.url) ? " disabled" : ""} class="${ssrRenderClass({
          "flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white": link.label == "pagination.previous",
          "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white": link.label == "pagination.next",
          "flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white": link.active,
          "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white": link.url && !link.active
        })}">`);
        if (link.label == "pagination.previous") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>`);
        } else if (link.label == "pagination.next") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>`);
        } else {
          _push(`<!--[-->${ssrInterpolate(link.label)}<!--]-->`);
        }
        _push(`</button></li>`);
      });
      _push(`<!--]--></ul></nav>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/ApiTablePagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
