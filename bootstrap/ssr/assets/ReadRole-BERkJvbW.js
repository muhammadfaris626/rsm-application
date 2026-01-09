import { unref, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, createVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BIJ2sf7b.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { T as Table, a as TableRow, _ as _sfc_main$2, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
/* empty css                                                                  */
import "flowbite";
import "axios";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ReadRole",
  __ssrInlineRender: true,
  props: ["fetchData", "namaRole"],
  setup(__props) {
    const form = useForm({});
    const updateRolePermission = (role_id, permission_id) => {
      form.post(route("updateRolePermission", [role_id, permission_id]));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Peran" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId}></path></svg> Pengaturan </a></li><li${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("roles.index"),
              class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Peran`);
                } else {
                  return [
                    createTextVNode("Peran")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Ubah Peran</span></div></li></ol></nav></div><div class="flex justify-between my-3"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("roles.index"),
              class: "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` KEMBALI `);
                } else {
                  return [
                    createTextVNode(" KEMBALI ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><div class="relative"${_scopeId}><h1 class="text-2xl font-bold dark:text-white uppercase"${_scopeId}>PERAN : ${ssrInterpolate(__props.namaRole)}</h1></div></div></div><div${_scopeId}>`);
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
                              _push5(`NAMA`);
                            } else {
                              return [
                                createTextVNode("NAMA")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`MENU`);
                            } else {
                              return [
                                createTextVNode("MENU")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`TAMBAH`);
                            } else {
                              return [
                                createTextVNode("TAMBAH")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`LIHAT`);
                            } else {
                              return [
                                createTextVNode("LIHAT")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`UBAH`);
                            } else {
                              return [
                                createTextVNode("UBAH")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`HAPUS`);
                            } else {
                              return [
                                createTextVNode("HAPUS")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
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
                              createTextVNode("NAMA")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("MENU")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("TAMBAH")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("LIHAT")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("UBAH")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("HAPUS")
                            ]),
                            _: 1
                          })
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
                            createTextVNode("NAMA")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("MENU")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("TAMBAH")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("LIHAT")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("UBAH")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("HAPUS")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.fetchData, (data, index) => {
                    _push3(ssrRenderComponent(TableRow, {
                      key: data.id,
                      class: "border-b"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$2, { status: "number" }, {
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
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            status: "record",
                            class: "font-bold"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.category)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.category), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(data[data.category], (cell) => {
                            _push4(ssrRenderComponent(_sfc_main$2, {
                              key: cell.id,
                              status: "record",
                              class: "text-center"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (cell.status == 1) {
                                    _push5(`<input checked id="purple-checkbox" type="checkbox" value="" class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId4}>`);
                                  } else {
                                    _push5(`<input id="purple-checkbox" type="checkbox" value="" class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"${_scopeId4}>`);
                                  }
                                } else {
                                  return [
                                    cell.status == 1 ? (openBlock(), createBlock("input", {
                                      key: 0,
                                      onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                      checked: "",
                                      id: "purple-checkbox",
                                      type: "checkbox",
                                      value: "",
                                      class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    }, null, 8, ["onClick"])) : (openBlock(), createBlock("input", {
                                      key: 1,
                                      onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                      id: "purple-checkbox",
                                      type: "checkbox",
                                      value: "",
                                      class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    }, null, 8, ["onClick"]))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_sfc_main$2, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$2, {
                              status: "record",
                              class: "font-bold"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.category), 1)
                              ]),
                              _: 2
                            }, 1024),
                            (openBlock(true), createBlock(Fragment, null, renderList(data[data.category], (cell) => {
                              return openBlock(), createBlock(_sfc_main$2, {
                                key: cell.id,
                                status: "record",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  cell.status == 1 ? (openBlock(), createBlock("input", {
                                    key: 0,
                                    onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                    checked: "",
                                    id: "purple-checkbox",
                                    type: "checkbox",
                                    value: "",
                                    class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  }, null, 8, ["onClick"])) : (openBlock(), createBlock("input", {
                                    key: 1,
                                    onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                    id: "purple-checkbox",
                                    type: "checkbox",
                                    value: "",
                                    class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  }, null, 8, ["onClick"]))
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "border-b"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$2, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$2, {
                            status: "record",
                            class: "font-bold"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.category), 1)
                            ]),
                            _: 2
                          }, 1024),
                          (openBlock(true), createBlock(Fragment, null, renderList(data[data.category], (cell) => {
                            return openBlock(), createBlock(_sfc_main$2, {
                              key: cell.id,
                              status: "record",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                cell.status == 1 ? (openBlock(), createBlock("input", {
                                  key: 0,
                                  onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                  checked: "",
                                  id: "purple-checkbox",
                                  type: "checkbox",
                                  value: "",
                                  class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                }, null, 8, ["onClick"])) : (openBlock(), createBlock("input", {
                                  key: 1,
                                  onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                  id: "purple-checkbox",
                                  type: "checkbox",
                                  value: "",
                                  class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                }, null, 8, ["onClick"]))
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
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
                              d: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                            }),
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            })
                          ])),
                          createTextVNode(" Pengaturan ")
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
                            href: _ctx.route("roles.index"),
                            class: "ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Peran")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Ubah Peran")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between my-3" }, [
                  createVNode("div", null, [
                    createVNode(unref(Link), {
                      href: _ctx.route("roles.index"),
                      class: "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" KEMBALI ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "relative" }, [
                      createVNode("h1", { class: "text-2xl font-bold dark:text-white uppercase" }, "PERAN : " + toDisplayString(__props.namaRole), 1)
                    ])
                  ])
                ]),
                createVNode("div", null, [
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
                              createTextVNode("NAMA")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("MENU")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("TAMBAH")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("LIHAT")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("UBAH")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("HAPUS")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData, (data, index) => {
                        return openBlock(), createBlock(TableRow, {
                          key: data.id,
                          class: "border-b"
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$2, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$2, {
                              status: "record",
                              class: "font-bold"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.category), 1)
                              ]),
                              _: 2
                            }, 1024),
                            (openBlock(true), createBlock(Fragment, null, renderList(data[data.category], (cell) => {
                              return openBlock(), createBlock(_sfc_main$2, {
                                key: cell.id,
                                status: "record",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  cell.status == 1 ? (openBlock(), createBlock("input", {
                                    key: 0,
                                    onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                    checked: "",
                                    id: "purple-checkbox",
                                    type: "checkbox",
                                    value: "",
                                    class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  }, null, 8, ["onClick"])) : (openBlock(), createBlock("input", {
                                    key: 1,
                                    onClick: ($event) => updateRolePermission(data.role_id, cell.id),
                                    id: "purple-checkbox",
                                    type: "checkbox",
                                    value: "",
                                    class: "w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  }, null, 8, ["onClick"]))
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Settings/Roles/ReadRole.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
