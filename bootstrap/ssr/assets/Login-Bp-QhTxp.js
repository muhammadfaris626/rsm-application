import { withCtx, unref, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-DZV-bHyz.js";
import { _ as _sfc_main$2 } from "./InputError-fLcttu_2.js";
import "./InputLabel-KrFFJXFE.js";
import "./PrimaryButton-CEWebzp-.js";
import "./TextInput-CNvSDFvn.js";
import { useForm, Head } from "@inertiajs/vue3";
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
    const submit = () => {
      form.post(route("login"), {
        onFinish: () => form.reset("password")
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent2, _scopeId));
            if (__props.status) {
              _push2(`<div class="mb-4 font-medium text-sm text-green-600"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="text-3xl font-bold text-center mb-6 text-white"${_scopeId}><img${ssrRenderAttr("src", "images/rsm-merah.png")} class="h-32 mx-auto"${_scopeId}></div><form${_scopeId}><div class="mb-2"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-500 dark:text-gray-400"${_scopeId}><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(form).login)} type="text" placeholder="Username atau Email" autocomplete="username" class="bg-gray-50 border-2 border-black text-gray-900 text-md font-bold rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId}></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-2",
              message: unref(form).errors.login
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-2"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-500 dark:text-gray-400"${_scopeId}><path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd"${_scopeId}></path></svg></div><input type="password"${ssrRenderAttr("value", unref(form).password)} placeholder="Kata Sandi" autocomplete="current-password" class="bg-gray-50 border-2 border-black text-gray-900 text-md font-bold rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId}></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-2",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><button type="submit" class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "w-full border-2 border-black py-2 px-4 bg-red-500 hover:bg-red-700 text-white rounded-3xl font-bold"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>MASUK</button></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Log in" }),
              __props.status ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-4 font-medium text-sm text-green-600"
              }, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "text-3xl font-bold text-center mb-6 text-white" }, [
                createVNode("img", {
                  src: "images/rsm-merah.png",
                  class: "h-32 mx-auto"
                })
              ]),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "mb-2" }, [
                  createVNode("div", { class: "relative" }, [
                    createVNode("div", { class: "absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none" }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        class: "w-6 h-6 text-gray-500 dark:text-gray-400"
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
                      placeholder: "Username atau Email",
                      autocomplete: "username",
                      class: "bg-gray-50 border-2 border-black text-gray-900 text-md font-bold rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).login]
                    ])
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-2",
                    message: unref(form).errors.login
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "mb-2" }, [
                  createVNode("div", { class: "relative" }, [
                    createVNode("div", { class: "absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none" }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        class: "w-5 h-5 text-gray-500 dark:text-gray-400"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z",
                          "clip-rule": "evenodd"
                        })
                      ]))
                    ]),
                    withDirectives(createVNode("input", {
                      type: "password",
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      placeholder: "Kata Sandi",
                      autocomplete: "current-password",
                      class: "bg-gray-50 border-2 border-black text-gray-900 text-md font-bold rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).password]
                    ])
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-2",
                    message: unref(form).errors.password
                  }, null, 8, ["message"])
                ]),
                createVNode("button", {
                  type: "submit",
                  class: ["w-full border-2 border-black py-2 px-4 bg-red-500 hover:bg-red-700 text-white rounded-3xl font-bold", { "opacity-25": unref(form).processing }],
                  disabled: unref(form).processing
                }, "MASUK", 10, ["disabled"])
              ], 32)
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
