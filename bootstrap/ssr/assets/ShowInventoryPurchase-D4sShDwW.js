import { ref, computed, watch, onMounted, nextTick, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, withDirectives, vModelCheckbox, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./InputLabel-KrFFJXFE.js";
import "./InputError-fLcttu_2.js";
import { _ as _sfc_main$2 } from "./TextInput-CNvSDFvn.js";
import "./Textarea-CO9y0V9s.js";
import "vue-multiselect";
import JsBarcode from "jsbarcode";
import QrcodeVue from "qrcode.vue";
/* empty css                                                                  */
import "flowbite";
import "axios";
const _sfc_main = {
  __name: "ShowInventoryPurchase",
  __ssrInlineRender: true,
  props: {
    inventoryPurchase: {
      type: Object
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      selectedCheckbox: [],
      jumlahCetak: ""
    });
    const selectAll = ref(false);
    function formatRupiah(value) {
      return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const mergedList = computed(() => {
      return props.inventoryPurchase.listData.map((item) => {
        const stockItem = props.inventoryPurchase.stock.find(
          (s) => s.inventory_purchase_id === item.inventory_purchase_id && s.product_id === item.product_id
        );
        return {
          ...item,
          stock: stockItem ? stockItem.stock : "0",
          serial_barcode: stockItem ? stockItem.serial_barcode : "N/A"
        };
      });
    });
    watch(selectAll, (newValue) => {
      if (newValue) {
        form.selectedCheckbox = mergedList.value.map((item) => item.serial_barcode);
      } else {
        form.selectedCheckbox = [];
      }
    });
    onMounted(() => {
      nextTick(() => {
        mergedList.value.forEach((data, index) => {
          const barcodeElement = document.getElementById(`barcode-${index}`);
          if (barcodeElement) {
            JsBarcode(barcodeElement, data.serial_barcode, {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 50,
              displayValue: true
            });
          }
        });
      });
    });
    const handlePrint = () => {
      if (form.jumlahCetak === "") {
        alert("Jumlah cetak per barcode tidak boleh kosong");
        return;
      }
      if (form.selectedCheckbox.length === 0) {
        alert("Pilih minimal satu barcode");
        return;
      }
      const url = route("printBarcode", form);
      window.open(url, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Detail Pembelian Persediaan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Detail Pembelian Persediaan</h1><p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>Lihat detail dan cetak barcode</p></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
              class: "inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId2}></path></svg> Kembali `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                      })
                    ])),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId}>Nomor Faktur</label><p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1"${_scopeId}>${ssrInterpolate(__props.inventoryPurchase.invoice_number)}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId}>Tanggal</label><p class="text-lg font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(new Date(__props.inventoryPurchase.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }))}</p></div><div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"${_scopeId}><label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"${_scopeId}>Supplier</label><p class="text-lg font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(((_b = (_a = __props.inventoryPurchase.supplier_id) == null ? void 0 : _a[0]) == null ? void 0 : _b.name) || "N/A")}</p></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2"${_scopeId}><svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"${_scopeId}></path></svg></div><h2 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>Cetak Barcode</h2></div><div class="flex flex-col sm:flex-row items-start sm:items-center gap-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>Jumlah cetak per barcode:</label><div class="w-20"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "jumlahCetak",
              type: "text",
              class: "block w-full text-center",
              modelValue: unref(form).jumlahCetak,
              "onUpdate:modelValue": ($event) => unref(form).jumlahCetak = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div><button type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"${_scopeId}></path></svg> Print </button></div></div><div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left text-gray-500 dark:text-gray-400"${_scopeId}><thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700"${_scopeId}><tr${_scopeId}><th scope="col" class="p-4"${_scopeId}><div class="flex items-center"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(selectAll.value) ? ssrLooseContain(selectAll.value, null) : selectAll.value) ? " checked" : ""} id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId}><label for="checkbox-all-search" class="sr-only"${_scopeId}>checkbox</label></div></th><th scope="col" class="px-6 py-3"${_scopeId}> No </th><th scope="col" class="px-6 py-3"${_scopeId}> Nama Barang </th><th scope="col" class="px-6 py-3"${_scopeId}> Harga </th><th scope="col" class="px-6 py-3"${_scopeId}> Jumlah </th><th scope="col" class="px-6 py-3"${_scopeId}> Total Harga </th><th scope="col" class="px-6 py-3"${_scopeId}> Sisa Stok </th><th scope="col" class="px-6 py-3"${_scopeId}> Serial Barcode </th><th scope="col" class="px-6 py-3"${_scopeId}> QrCode </th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(mergedList.value, (data, index) => {
              _push2(`<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"${_scopeId}><td class="w-4 p-4"${_scopeId}><div class="flex items-center"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).selectedCheckbox) ? ssrLooseContain(unref(form).selectedCheckbox, data.serial_barcode) : unref(form).selectedCheckbox) ? " checked" : ""}${ssrRenderAttr("value", data.serial_barcode)} id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId}><label for="checkbox-table-search-1" class="sr-only"${_scopeId}>checkbox</label></div></td><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId}>${ssrInterpolate(index + 1)}</th><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.product.product_name)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(formatRupiah(data.price))}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.quantity)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(formatRupiah(data.total_price))}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.stock)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.serial_barcode)}</td><td class="px-6 py-4"${_scopeId}>`);
              _push2(ssrRenderComponent(QrcodeVue, {
                value: data.serial_barcode,
                size: 50,
                level: "H",
                "render-as": "svg"
              }, null, _parent2, _scopeId));
              _push2(`</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, "Detail Pembelian Persediaan"),
                    createVNode("p", { class: "text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Lihat detail dan cetak barcode")
                  ]),
                  createVNode("div", null, [
                    createVNode(unref(Link), {
                      href: _ctx.route("inventoryPurchases.index"),
                      class: "inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                          })
                        ])),
                        createTextVNode(" Kembali ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6" }, [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                    createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                      createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Nomor Faktur"),
                      createVNode("p", { class: "text-lg font-bold text-blue-600 dark:text-blue-400 mt-1" }, toDisplayString(__props.inventoryPurchase.invoice_number), 1)
                    ]),
                    createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                      createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Tanggal"),
                      createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(new Date(__props.inventoryPurchase.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })), 1)
                    ]),
                    createVNode("div", { class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" }, [
                      createVNode("label", { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase" }, "Supplier"),
                      createVNode("p", { class: "text-lg font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(((_d = (_c = __props.inventoryPurchase.supplier_id) == null ? void 0 : _c[0]) == null ? void 0 : _d.name) || "N/A"), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "bg-blue-100 dark:bg-blue-900 rounded-lg p-2" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6 text-blue-600 dark:text-blue-400",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          })
                        ]))
                      ]),
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, "Cetak Barcode")
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row items-start sm:items-center gap-3" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-300" }, "Jumlah cetak per barcode:"),
                        createVNode("div", { class: "w-20" }, [
                          createVNode(_sfc_main$2, {
                            id: "jumlahCetak",
                            type: "text",
                            class: "block w-full text-center",
                            modelValue: unref(form).jumlahCetak,
                            "onUpdate:modelValue": ($event) => unref(form).jumlahCetak = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      createVNode("button", {
                        onClick: handlePrint,
                        type: "button",
                        class: "inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          })
                        ])),
                        createTextVNode(" Print ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "w-full text-sm text-left text-gray-500 dark:text-gray-400" }, [
                      createVNode("thead", { class: "text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700" }, [
                        createVNode("tr", null, [
                          createVNode("th", {
                            scope: "col",
                            class: "p-4"
                          }, [
                            createVNode("div", { class: "flex items-center" }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => selectAll.value = $event,
                                id: "checkbox-all-search",
                                type: "checkbox",
                                class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelCheckbox, selectAll.value]
                              ]),
                              createVNode("label", {
                                for: "checkbox-all-search",
                                class: "sr-only"
                              }, "checkbox")
                            ])
                          ]),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " No "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Nama Barang "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Harga "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Jumlah "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Total Harga "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Sisa Stok "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " Serial Barcode "),
                          createVNode("th", {
                            scope: "col",
                            class: "px-6 py-3"
                          }, " QrCode ")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(mergedList.value, (data, index) => {
                          return openBlock(), createBlock("tr", {
                            key: data.id,
                            class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          }, [
                            createVNode("td", { class: "w-4 p-4" }, [
                              createVNode("div", { class: "flex items-center" }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).selectedCheckbox = $event,
                                  value: data.serial_barcode,
                                  id: "checkbox-table-search-1",
                                  type: "checkbox",
                                  class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelCheckbox, unref(form).selectedCheckbox]
                                ]),
                                createVNode("label", {
                                  for: "checkbox-table-search-1",
                                  class: "sr-only"
                                }, "checkbox")
                              ])
                            ]),
                            createVNode("th", {
                              scope: "row",
                              class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            }, toDisplayString(index + 1), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(data.product.product_name), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(formatRupiah(data.price)), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(data.quantity), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(formatRupiah(data.total_price)), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(data.stock), 1),
                            createVNode("td", { class: "px-6 py-4" }, toDisplayString(data.serial_barcode), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode(QrcodeVue, {
                                value: data.serial_barcode,
                                size: 50,
                                level: "H",
                                "render-as": "svg"
                              }, null, 8, ["value"])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Products/InventoryPurchases/ShowInventoryPurchase.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
