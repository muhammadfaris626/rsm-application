import { ref, withCtx, unref, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withModifiers, withDirectives, vModelText, vModelDynamic, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass } from "vue/server-renderer";
import { G as GuestLayout } from "./GuestLayout-CnsMUZmx.js";
import { _ as _sfc_main$1 } from "./InputError-fLcttu_2.js";
import "./InputLabel-KrFFJXFE.js";
import "./PrimaryButton-CEWebzp-.js";
import "./TextInput-CNvSDFvn.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const form = useForm({
      login: "",
      password: "",
      remember: false
    });
    const showPassword = ref(false);
    const submit = () => {
      form.post(route("login"), {
        onFinish: () => form.reset("password")
      });
    };
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(GuestLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent2, _scopeId));
            _push2(`<div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl"${_scopeId}><div class="bg-gradient-to-r from-red-600 to-red-700 px-8 py-10 text-center"${_scopeId}><div class="mb-4 transform transition-transform duration-300 hover:scale-105"${_scopeId}><img${ssrRenderAttr("src", "images/rsm-merah.png")} class="h-24 mx-auto drop-shadow-lg"${_scopeId}></div><h1 class="text-2xl font-bold text-white mb-2"${_scopeId}>Selamat Datang11</h1><p class="text-red-100 text-sm"${_scopeId}>Silakan masuk ke akun Anda</p></div><div class="px-8 py-8"${_scopeId}>`);
            if (__props.status) {
              _push2(`<div class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg><p class="text-sm font-medium text-green-800"${_scopeId}>${ssrInterpolate(__props.status)}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-6"${_scopeId}><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 mb-2"${_scopeId}> Username atau Email </label><div class="relative group"${_scopeId}><div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors"${_scopeId}><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(form).login)} type="text" placeholder="Masukkan username atau email" autocomplete="username" class="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"${_scopeId}></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              class: "mt-2",
              message: unref(form).errors.login
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 mb-2"${_scopeId}> Kata Sandi </label><div class="relative group"${_scopeId}><div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors"${_scopeId}><path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd"${_scopeId}></path></svg></div><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} placeholder="Masukkan kata sandi" autocomplete="current-password" class="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"${_scopeId}><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-600 transition-colors"${_scopeId}>`);
            if (!showPassword.value) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"${_scopeId}><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"${_scopeId}></path><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"${_scopeId}><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z"${_scopeId}></path><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244A3.75 3.75 0 0 0 12.53 15.713Z"${_scopeId}></path><path d="M6.75 12a5.25 5.25 0 0 1 7.829-4.77l-3.1 3.1a3.75 3.75 0 0 0-4.729 4.729l-3.1 3.1A5.25 5.25 0 0 1 6.75 12Z"${_scopeId}></path></svg>`);
            }
            _push2(`</button></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              class: "mt-2",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between"${_scopeId}><label class="flex items-center cursor-pointer group"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"${_scopeId}><span class="ml-2 text-sm text-gray-600 group-hover:text-gray-800"${_scopeId}>Ingat saya</span></label>`);
            if (__props.canResetPassword) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("password.request"),
                class: "text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Lupa kata sandi? `);
                  } else {
                    return [
                      createTextVNode(" Lupa kata sandi? ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit" class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(form).processing }, "w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            if (!unref(form).processing) {
              _push2(`<span class="flex items-center justify-center"${_scopeId}><span${_scopeId}>MASUK</span><svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"${_scopeId}></path></svg></span>`);
            } else {
              _push2(`<span class="flex items-center justify-center"${_scopeId}><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId}></path></svg> Memproses... </span>`);
            }
            _push2(`</button></form></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Log in" }),
              createVNode("div", { class: "bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl" }, [
                createVNode("div", { class: "bg-gradient-to-r from-red-600 to-red-700 px-8 py-10 text-center" }, [
                  createVNode("div", { class: "mb-4 transform transition-transform duration-300 hover:scale-105" }, [
                    createVNode("img", {
                      src: "images/rsm-merah.png",
                      class: "h-24 mx-auto drop-shadow-lg"
                    })
                  ]),
                  createVNode("h1", { class: "text-2xl font-bold text-white mb-2" }, "Selamat Datang11"),
                  createVNode("p", { class: "text-red-100 text-sm" }, "Silakan masuk ke akun Anda")
                ]),
                createVNode("div", { class: "px-8 py-8" }, [
                  __props.status ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-5 h-5 text-green-500 mr-2",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createVNode("p", { class: "text-sm font-medium text-green-800" }, toDisplayString(__props.status), 1)
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-6"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 mb-2" }, " Username atau Email "),
                      createVNode("div", { class: "relative group" }, [
                        createVNode("div", { class: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none" }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            class: "w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
                              "clip-rule": "evenodd"
                            })
                          ]))
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).login = $event,
                          type: "text",
                          placeholder: "Masukkan username atau email",
                          autocomplete: "username",
                          class: "w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).login]
                        ])
                      ]),
                      createVNode(_sfc_main$1, {
                        class: "mt-2",
                        message: unref(form).errors.login
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 mb-2" }, " Kata Sandi "),
                      createVNode("div", { class: "relative group" }, [
                        createVNode("div", { class: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none" }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            class: "w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z",
                              "clip-rule": "evenodd"
                            })
                          ]))
                        ]),
                        withDirectives(createVNode("input", {
                          type: showPassword.value ? "text" : "password",
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          placeholder: "Masukkan kata sandi",
                          autocomplete: "current-password",
                          class: "w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
                        }, null, 8, ["type", "onUpdate:modelValue"]), [
                          [vModelDynamic, unref(form).password]
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: togglePasswordVisibility,
                          class: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-600 transition-colors"
                        }, [
                          !showPassword.value ? (openBlock(), createBlock("svg", {
                            key: 0,
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            class: "w-5 h-5"
                          }, [
                            createVNode("path", { d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }),
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z",
                              "clip-rule": "evenodd"
                            })
                          ])) : (openBlock(), createBlock("svg", {
                            key: 1,
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            class: "w-5 h-5"
                          }, [
                            createVNode("path", { d: "M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" }),
                            createVNode("path", { d: "M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244A3.75 3.75 0 0 0 12.53 15.713Z" }),
                            createVNode("path", { d: "M6.75 12a5.25 5.25 0 0 1 7.829-4.77l-3.1 3.1a3.75 3.75 0 0 0-4.729 4.729l-3.1 3.1A5.25 5.25 0 0 1 6.75 12Z" })
                          ]))
                        ])
                      ]),
                      createVNode(_sfc_main$1, {
                        class: "mt-2",
                        message: unref(form).errors.password
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("label", { class: "flex items-center cursor-pointer group" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).remember = $event,
                          type: "checkbox",
                          class: "w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).remember]
                        ]),
                        createVNode("span", { class: "ml-2 text-sm text-gray-600 group-hover:text-gray-800" }, "Ingat saya")
                      ]),
                      __props.canResetPassword ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: _ctx.route("password.request"),
                        class: "text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Lupa kata sandi? ")
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      type: "submit",
                      class: ["w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", { "opacity-50 cursor-not-allowed": unref(form).processing }],
                      disabled: unref(form).processing
                    }, [
                      !unref(form).processing ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "flex items-center justify-center"
                      }, [
                        createVNode("span", null, "MASUK"),
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 ml-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M13 7l5 5m0 0l-5 5m5-5H6"
                          })
                        ]))
                      ])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "flex items-center justify-center"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("circle", {
                            class: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            "stroke-width": "4"
                          }),
                          createVNode("path", {
                            class: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          })
                        ])),
                        createTextVNode(" Memproses... ")
                      ]))
                    ], 10, ["disabled"])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
