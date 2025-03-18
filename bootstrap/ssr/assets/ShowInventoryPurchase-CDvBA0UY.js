import { ref, computed, watch, onMounted, nextTick, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, toDisplayString, withDirectives, vModelCheckbox, Fragment, renderList, useSSRContext } from "vue";
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
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Pembeliaan Persediaan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"${_scopeId}></path></svg> Produk </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("inventoryPurchases.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Data Pembelian Persediaan`);
                } else {
                  return [
                    createTextVNode("Data Pembelian Persediaan")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Daftar Pembeliaan Persediaan</span></div></li></ol></nav></div><div class="pt-4 grid grid-cols-1 gap-4"${_scopeId}><div class="bg-white rounded-xl py-2"${_scopeId}><div class="relative overflow-x-auto"${_scopeId}><table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId}><tbody${_scopeId}><tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200"${_scopeId}><th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId}> Nomor Faktur </th><td${_scopeId}> : </td><td class="px-4 font-bold"${_scopeId}>${ssrInterpolate(__props.inventoryPurchase.invoice_number)}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200"${_scopeId}><th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId}> Tanggal </th><td${_scopeId}> : </td><td class="px-4"${_scopeId}>${ssrInterpolate(new Date(__props.inventoryPurchase.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }))}</td></tr><tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200"${_scopeId}><th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId}> Supplier </th><td${_scopeId}> : </td><td class="px-4"${_scopeId}>${ssrInterpolate(__props.inventoryPurchase.supplier_id[0].name)}</td></tr></tbody></table></div></div><div class="bg-white rounded-xl py-4 px-4"${_scopeId}><div class="flex justify-between mb-4"${_scopeId}><div${_scopeId}><div class="flex justify-start"${_scopeId}><div class="flex items-center justify-start mr-2"${_scopeId}> Jumlah cetak per barcode : </div><div class="w-14"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "text",
              type: "text",
              class: "block w-full text-center",
              modelValue: unref(form).jumlahCetak,
              "onUpdate:modelValue": ($event) => unref(form).jumlahCetak = $event
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-start mr-2 ml-2"${_scopeId}><button type="button" class="px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"${_scopeId}> PRINT </button></div></div></div></div><div class="relative overflow-x-auto shadow-md sm:rounded-lg"${_scopeId}><table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId}><thead class="text-xs text-gray-700 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400"${_scopeId}><tr${_scopeId}><th scope="col" class="p-4"${_scopeId}><div class="flex items-center"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(selectAll.value) ? ssrLooseContain(selectAll.value, null) : selectAll.value) ? " checked" : ""} id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId}><label for="checkbox-all-search" class="sr-only"${_scopeId}>checkbox</label></div></th><th scope="col" class="px-6 py-3"${_scopeId}> No </th><th scope="col" class="px-6 py-3"${_scopeId}> Nama Barang </th><th scope="col" class="px-6 py-3"${_scopeId}> Harga </th><th scope="col" class="px-6 py-3"${_scopeId}> Jumlah </th><th scope="col" class="px-6 py-3"${_scopeId}> Total Harga </th><th scope="col" class="px-6 py-3"${_scopeId}> Sisa Stok </th><th scope="col" class="px-6 py-3"${_scopeId}> Serial Barcode </th><th scope="col" class="px-6 py-3"${_scopeId}> QrCode </th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(mergedList.value, (data, index) => {
              _push2(`<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"${_scopeId}><td class="w-4 p-4"${_scopeId}><div class="flex items-center"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).selectedCheckbox) ? ssrLooseContain(unref(form).selectedCheckbox, data.serial_barcode) : unref(form).selectedCheckbox) ? " checked" : ""}${ssrRenderAttr("value", data.serial_barcode)} id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId}><label for="checkbox-table-search-1" class="sr-only"${_scopeId}>checkbox</label></div></td><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId}>${ssrInterpolate(index + 1)}</th><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.product.product_name)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(formatRupiah(data.price))}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.quantity)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(formatRupiah(data.total_price))}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.stock)}</td><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(data.serial_barcode)}</td><td class="px-6 py-4"${_scopeId}>`);
              _push2(ssrRenderComponent(QrcodeVue, {
                value: data.serial_barcode,
                size: 50,
                level: "H",
                "render-as": "svg"
              }, null, _parent2, _scopeId));
              _push2(`</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div></div></div></div>`);
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
                              d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                            })
                          ])),
                          createTextVNode(" Produk ")
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
                            href: _ctx.route("inventoryPurchases.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Data Pembelian Persediaan")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Daftar Pembeliaan Persediaan")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "pt-4 grid grid-cols-1 gap-4" }, [
                  createVNode("div", { class: "bg-white rounded-xl py-2" }, [
                    createVNode("div", { class: "relative overflow-x-auto" }, [
                      createVNode("table", { class: "text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                        createVNode("tbody", null, [
                          createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200" }, [
                            createVNode("th", {
                              scope: "row",
                              class: "px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            }, " Nomor Faktur "),
                            createVNode("td", null, " : "),
                            createVNode("td", { class: "px-4 font-bold" }, toDisplayString(__props.inventoryPurchase.invoice_number), 1)
                          ]),
                          createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200" }, [
                            createVNode("th", {
                              scope: "row",
                              class: "px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            }, " Tanggal "),
                            createVNode("td", null, " : "),
                            createVNode("td", { class: "px-4" }, toDisplayString(new Date(__props.inventoryPurchase.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })), 1)
                          ]),
                          createVNode("tr", { class: "bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200" }, [
                            createVNode("th", {
                              scope: "row",
                              class: "px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            }, " Supplier "),
                            createVNode("td", null, " : "),
                            createVNode("td", { class: "px-4" }, toDisplayString(__props.inventoryPurchase.supplier_id[0].name), 1)
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-xl py-4 px-4" }, [
                    createVNode("div", { class: "flex justify-between mb-4" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "flex justify-start" }, [
                          createVNode("div", { class: "flex items-center justify-start mr-2" }, " Jumlah cetak per barcode : "),
                          createVNode("div", { class: "w-14" }, [
                            createVNode(_sfc_main$2, {
                              id: "text",
                              type: "text",
                              class: "block w-full text-center",
                              modelValue: unref(form).jumlahCetak,
                              "onUpdate:modelValue": ($event) => unref(form).jumlahCetak = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "flex items-center justify-start mr-2 ml-2" }, [
                            createVNode("button", {
                              onClick: handlePrint,
                              type: "button",
                              class: "px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"
                            }, " PRINT ")
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "relative overflow-x-auto shadow-md sm:rounded-lg" }, [
                      createVNode("table", { class: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                        createVNode("thead", { class: "text-xs text-gray-700 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400" }, [
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
                              class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
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
