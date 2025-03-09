import { ref, computed, onMounted, nextTick, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import JsBarcode from "jsbarcode";
const _sfc_main = {
  __name: "PrintBarcode",
  __ssrInlineRender: true,
  props: {
    selectedCheckbox: {
      type: Array
    },
    jumlahCetak: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    ref(null);
    const repeatedBarcodes = computed(() => {
      return props.selectedCheckbox.flatMap((data) => Array(Number(props.jumlahCetak)).fill(data));
    });
    onMounted(() => {
      nextTick(() => {
        repeatedBarcodes.value.forEach((data, index) => {
          const barcodeElement = document.getElementById(`barcode-${index}`);
          if (barcodeElement) {
            JsBarcode(barcodeElement, data, {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 50,
              displayValue: true
            });
          }
        });
        document.body.style.backgroundColor = "white";
        window.print();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Cetak Barcode" }, null, _parent));
      _push(`<div class="grid grid-cols-3 gap-4 m-5"><!--[-->`);
      ssrRenderList(repeatedBarcodes.value, (data, index) => {
        _push(`<div class="flex justify-center items-center"><svg${ssrRenderAttr("id", `barcode-${index}`)} class="w-full h-20"></svg></div>`);
      });
      _push(`<!--]--></div><!--]-->`);
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
