import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderClass, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { computed, unref, mergeProps, withCtx, renderSlot, useSSRContext, ref, onMounted, createBlock, createVNode, openBlock, createTextVNode, reactive, onUnmounted } from "vue";
import { initFlowbite } from "flowbite";
import { usePage, Link, router } from "@inertiajs/vue3";
import axios from "axios";
function usePermission() {
  const hasRole = (name) => usePage().props.auth.user.roles.includes(name);
  const hasPermission = (name) => usePage().props.auth.user.permissions.includes(name);
  return { hasRole, hasPermission };
}
const _sfc_main$6 = {
  __name: "SidebarLink",
  __ssrInlineRender: true,
  props: ["href", "active"],
  setup(__props) {
    const props = __props;
    const classes = computed(
      () => props.active ? "flex items-center w-full p-1 text-blue-500 font-bold transition duration-75 rounded-lg pl-10 group bg-white hover:bg-blue-400" : "flex items-center w-full p-1 text-white transition duration-75 rounded-lg pl-10 group hover:bg-white hover:text-blue-500"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: classes.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/SidebarLink.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "NavigationLink",
  __ssrInlineRender: true,
  props: ["href", "active"],
  setup(__props) {
    const props = __props;
    const classes = computed(
      () => props.active ? "flex items-center p-2 text-blue-500 font-bold rounded-lg group bg-white hover:bg-blue-400" : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white hover:text-blue-500 group"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: classes.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/NavigationLink.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { hasPermission } = usePermission();
    const isRouteActive = (routes) => {
      return routes.some((route) => window.route().current(route));
    };
    const isRouteEnable = (routes) => {
      const routeValues = Object.values(usePage().props.auth.user.permissions);
      const routeEnableValues = Object.values(routes);
      return routeEnableValues.some((route) => routeValues.includes(route));
    };
    const orderCount = ref(0);
    const returnCount = ref(0);
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications/count");
        orderCount.value = response.data.order_count;
        returnCount.value = response.data.return_count;
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    };
    onMounted(fetchNotifications);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><button type="button" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" class="fixed top-3 left-3 z-[60] inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"><span class="sr-only">Open sidebar</span><svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path></svg></button><aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar"><div class="h-full px-3 py-4 overflow-y-auto bg-blue-500 dark:bg-gray-800"><a href="https://flowbite.com/" class="flex justify-center items-center ps-2.5 mb-5"><img${ssrRenderAttr("src", "/images/rsm-putih.svg")} class="h-16 me-3"></a><ul class="space-y-2 font-medium"><li>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        href: _ctx.route("dashboard"),
        active: isRouteActive(["dashboard", "home"])
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 group-hover:text-blue-500"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"${_scopeId}></path></svg><span class="ms-3"${_scopeId}>Beranda</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "1.5",
                stroke: "currentColor",
                class: "w-5 h-5 transition duration-75 group-hover:text-blue-500"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                })
              ])),
              createVNode("span", { class: "ms-3" }, "Beranda")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "branch-product: menu",
        "inventory-purchase: menu",
        "request-order: menu",
        "sale: menu",
        "center-stock: menu",
        "request-return: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="product" data-collapse-toggle="product"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Produk</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="product" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "branchProducts.index",
        "inventoryPurchases.index",
        "inventoryPurchases.create",
        "inventoryPurchases.edit",
        "inventoryPurchases.show",
        "requestOrders.index",
        "requestOrders.create",
        "requestOrders.edit",
        "requestReturns.index",
        "requestReturns.create",
        "requestReturns.edit",
        "sales.index",
        "sales.create",
        "sales.edit",
        "centerProducts.index"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("sale: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("sales.index"),
          active: isRouteActive(["sales.index", "sales.create", "sales.edit"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Penjualan `);
            } else {
              return [
                createTextVNode(" Penjualan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("inventory-purchase: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("inventoryPurchases.index"),
          active: isRouteActive(["inventoryPurchases.index", "inventoryPurchases.create", "inventoryPurchases.edit", "inventoryPurchases.show"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pembelian Persediaan `);
            } else {
              return [
                createTextVNode(" Pembelian Persediaan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("request-order: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("requestOrders.index"),
          active: isRouteActive(["requestOrders.index", "requestOrders.create", "requestOrders.edit"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Permintaan Stok `);
            } else {
              return [
                createTextVNode(" Permintaan Stok ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("request-return: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("requestReturns.index"),
          active: isRouteActive(["requestReturns.index", "requestReturns.create", "requestReturns.edit"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Permintaan Return `);
            } else {
              return [
                createTextVNode(" Permintaan Return ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("branch-product: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("branchProducts.index"),
          active: isRouteActive(["branchProducts.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Barang Cabang `);
            } else {
              return [
                createTextVNode(" Barang Cabang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("center-stock: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("centerProducts.index"),
          active: isRouteActive(["centerProducts.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Barang Pusat `);
            } else {
              return [
                createTextVNode(" Barang Pusat ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "operational-center: menu",
        "operational-branch: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="operational" data-collapse-toggle="operational"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Operasional</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="operational" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "operationalCenters.index",
        "operationalBranches.index"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("operational-center: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("operationalCenters.index"),
          active: isRouteActive(["operationalCenters.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pusat `);
            } else {
              return [
                createTextVNode(" Pusat ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("operational-branch: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("operationalBranches.index"),
          active: isRouteActive(["operationalBranches.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Cabang `);
            } else {
              return [
                createTextVNode(" Cabang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "management-structure: menu",
        "report: menu",
        "report-branch: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="management" data-collapse-toggle="management"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Manajemen</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="management" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "managementStructures.index",
        "reports.index",
        "reportBranches.index"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("report-branch: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("reportBranches.index"),
          active: isRouteActive(["reportBranches.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Laporan Cabang `);
            } else {
              return [
                createTextVNode(" Laporan Cabang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("report: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("reports.index"),
          active: isRouteActive(["reports.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Laporan `);
            } else {
              return [
                createTextVNode(" Laporan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("management-structure: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("managementStructures.index"),
          active: isRouteActive(["managementStructures.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Struktur Manajemen `);
            } else {
              return [
                createTextVNode(" Struktur Manajemen ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "performance: menu",
        "attendance: menu",
        "mutation: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="karyawan" data-collapse-toggle="karyawan"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Karyawan</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="karyawan" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "performances.index",
        "attendances.index",
        "mutations.index",
        "mutations.create",
        "mutations.edit",
        "mutations.show",
        "terminations.index",
        "terminations.create",
        "terminations.edit",
        "terminations.show"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("attendance: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("attendances.index"),
          active: isRouteActive(["attendances.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Absensi `);
            } else {
              return [
                createTextVNode(" Absensi ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("mutation: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("mutations.index"),
          active: isRouteActive(["mutations.index", "mutations.create", "mutations.edit", "mutations.show"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Mutasi `);
            } else {
              return [
                createTextVNode(" Mutasi ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("termination: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("terminations.index"),
          active: isRouteActive(["terminations.index", "terminations.create", "terminations.edit", "terminations.show"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pemberhentian `);
            } else {
              return [
                createTextVNode(" Pemberhentian ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "product-category: menu",
        "product: menu",
        "employee: menu",
        "branch: menu",
        "expenditure: menu",
        "position: menu",
        "supplier: menu",
        "location: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="database" data-collapse-toggle="database"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Database</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="database" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "productCategories.index",
        "products.index",
        "employees.index",
        "branches.index",
        "expenditures.index",
        "positions.index",
        "suppliers.index",
        "locations.index"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("product-category: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("productCategories.index"),
          active: isRouteActive(["productCategories.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Kategori Barang `);
            } else {
              return [
                createTextVNode(" Kategori Barang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("product: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("products.index"),
          active: isRouteActive(["products.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Barang `);
            } else {
              return [
                createTextVNode(" Barang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("employee: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("employees.index"),
          active: isRouteActive(["employees.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Karyawan `);
            } else {
              return [
                createTextVNode(" Karyawan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("branch: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("branches.index"),
          active: isRouteActive(["branches.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Cabang `);
            } else {
              return [
                createTextVNode(" Cabang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("expenditure: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("expenditures.index"),
          active: isRouteActive(["expenditures.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pengeluaran `);
            } else {
              return [
                createTextVNode(" Pengeluaran ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("position: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("positions.index"),
          active: isRouteActive(["positions.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Jabatan `);
            } else {
              return [
                createTextVNode(" Jabatan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("supplier: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("suppliers.index"),
          active: isRouteActive(["suppliers.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Supplier `);
            } else {
              return [
                createTextVNode(" Supplier ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("location: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("locations.index"),
          active: isRouteActive(["locations.index"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Lokasi `);
            } else {
              return [
                createTextVNode(" Lokasi ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li class="${ssrRenderClass({ hidden: !isRouteEnable([
        "user: menu",
        "role: menu",
        "permission: menu",
        "approval-type: menu"
      ]) })}"><button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="pengaturan" data-collapse-toggle="pengaturan"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-bluee-500"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg><span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Pengaturan</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg></button><ul id="pengaturan" class="${ssrRenderClass([{ hidden: !isRouteActive([
        "users.index",
        "users.edit",
        "users.create",
        "roles.index",
        "roles.edit",
        "roles.create",
        "roles.show",
        "permissions.index",
        "permissions.edit",
        "permissions.create",
        "approvalTypes.index",
        "approvalTypes.edit",
        "approvalTypes.create"
      ]) }, "py-2"])}">`);
      if (unref(hasPermission)("user: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("users.index"),
          active: isRouteActive(["users.index", "users.edit", "users.create"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Akun `);
            } else {
              return [
                createTextVNode(" Akun ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("role: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("roles.index"),
          active: isRouteActive(["roles.index", "roles.edit", "roles.create", "roles.show"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Peran `);
            } else {
              return [
                createTextVNode(" Peran ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("permission: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("permissions.index"),
          active: isRouteActive(["permissions.index", "permissions.edit", "permissions.create"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Perizinan `);
            } else {
              return [
                createTextVNode(" Perizinan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasPermission)("approval-type: menu")) {
        _push(`<li>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          href: _ctx.route("approvalTypes.index"),
          active: isRouteActive(["approvalTypes.index", "approvalTypes.edit", "approvalTypes.create"])
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Jenis Persetujuan `);
            } else {
              return [
                createTextVNode(" Jenis Persetujuan ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("logout"),
        method: "post",
        as: "button",
        class: "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white hover:text-blue-800 group w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 group-hover:text-blue-500"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"${_scopeId}></path></svg><span class="ms-3"${_scopeId}>Keluar</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "1.5",
                stroke: "currentColor",
                class: "w-5 h-5 transition duration-75 group-hover:text-blue-500"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                })
              ])),
              createVNode("span", { class: "ms-3" }, "Keluar")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></aside><!--]-->`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Partials/Sidebar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const toast = reactive({
  items: [],
  add(toast2) {
    this.items.unshift({
      key: Symbol(),
      ...toast2
    });
  },
  remove(index) {
    this.items.splice(index, 1);
  }
});
const _sfc_main$3 = {
  __name: "ToastItem",
  __ssrInlineRender: true,
  props: {
    message: String,
    type: {
      type: String,
      default: "success"
    },
    duration: {
      type: Number,
      default: 2e3
    }
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    onMounted(() => {
      setTimeout(() => emit("remove"), props.duration);
    });
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "toast-success",
        class: "flex items-center border-2 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-md dark:text-gray-800 dark:bg-gray-200",
        role: "alert"
      }, _attrs))}><div class="${ssrRenderClass([{
        "bg-green-100 text-green-500 dark:bg-green-500 dark:text-green-200": __props.type === "success",
        "bg-red-100 text-red-500 dark:bg-red-500 dark:text-red-200": __props.type === "error"
      }, "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"])}">`);
      if (__props.type === "success") {
        _push(`<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path></svg>`);
      } else {
        _push(`<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l12 12M13 1L1 13"></path></svg>`);
      }
      _push(`</div><div class="ms-3 text-sm font-normal">${ssrInterpolate(props.message)}</div><button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-200 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close"><span class="sr-only">Close</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/ToastItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Toast",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    let removeFinishEventListener = router.on("finish", () => {
      if (page.props.toast) {
        toast.add({
          message: page.props.toast
        });
      }
    });
    onUnmounted(() => removeFinishEventListener());
    function remove(index) {
      toast.remove(index);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "enter-from-class": "translate-x-full opacity-0",
        "enter-active-class": "duration-500",
        "leave-active-class": "duration-500",
        "leave-to-class": "translate-x-full opacity-0",
        class: "fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs"
      }, _attrs))}>`);
      ssrRenderList(unref(toast).items, (item, index) => {
        _push(ssrRenderComponent(_sfc_main$3, {
          key: item,
          message: item.message.message,
          type: item.message.type,
          duration: 3e3,
          onRemove: ($event) => remove(index)
        }, null, _parent));
      });
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/Toast.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "LoadingPopup",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.loading) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="p-6 rounded-lg"><div role="status"><svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Custom/LoadingPopup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "AuthenticatedLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(false);
    onMounted(() => {
      initFlowbite();
      router.on("start", () => {
        isLoading.value = true;
      });
      router.on("finish", () => {
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { loading: isLoading.value }, null, _parent));
      _push(`<div class="sm:ml-64"><div class="p-4"><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AuthenticatedLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  usePermission as u
};
