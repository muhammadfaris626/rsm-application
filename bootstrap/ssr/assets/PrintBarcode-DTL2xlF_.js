import { computed, onMounted, nextTick, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import QrcodeVue from "qrcode.vue";
const _sfc_main = {
  __name: "PrintBarcode",
  __ssrInlineRender: true,
  props: {
    selectedCheckbox: {
      type: Array,
      required: true
    },
    jumlahCetak: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const repeatedBarcodes = computed(() => {
      return props.selectedCheckbox.flatMap((data) => Array(Number(props.jumlahCetak)).fill(data));
    });
    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          window.print();
        }, 1e3);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><div class="barcode-container"><!--[-->`);
      ssrRenderList(repeatedBarcodes.value, (data, index) => {
        _push(`<div class="barcode-wrapper">`);
        _push(ssrRenderComponent(QrcodeVue, {
          value: data,
          size: 99,
          level: "H",
          "render-as": "svg"
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/InventoryPurchases/PrintBarcode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
