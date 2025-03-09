import { ref, computed, watch, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, vModelSelect, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, isRef, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$1, u as usePermission } from "./AuthenticatedLayout-Cwf2Wf13.js";
import { useForm, usePage, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./Modal-BsYluhuH.js";
import { _ as _sfc_main$3 } from "./InputLabel-KrFFJXFE.js";
import { _ as _sfc_main$4 } from "./InputError-fLcttu_2.js";
import { _ as _sfc_main$5 } from "./Textarea-CO9y0V9s.js";
import { T as Table, a as TableRow, _ as _sfc_main$7, b as TableHeaderCell } from "./TableDataCell-B8rn1BLe.js";
import { _ as _sfc_main$6 } from "./TablePagination-A5nS3meM.js";
import axios from "axios";
import "flowbite";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IndexBranch",
  __ssrInlineRender: true,
  props: ["fetchData"],
  setup(__props) {
    const form = useForm({
      id: "",
      branch_code: "",
      branch_name: "",
      branch_address: "",
      description: "",
      status: "",
      last_update: "",
      created_at: "",
      updated_at: "",
      fileUpload: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    let searchUrl = computed(() => {
      let url = new URL(route("branches.index"));
      url.searchParams.append("page", pageNumber.value);
      if (search.value) {
        url.searchParams.append("search", search.value);
      }
      return url;
    });
    watch(() => searchUrl.value, (updatedSearchUrl) => {
      router.visit(updatedSearchUrl, {
        preserveScroll: true,
        preserveState: true,
        replace: true
      });
    });
    const showModalCreate = ref(false);
    const showModalUpload = ref(false);
    const showModalRead = ref(false);
    const showModalUpdate = ref(false);
    const showModalDelete = ref(false);
    const closeModalCreate = () => {
      showModalCreate.value = false;
    };
    const closeModalUpload = () => {
      showModalUpload.value = false;
    };
    const closeModalRead = () => {
      showModalRead.value = false;
      form.reset();
      form.clearErrors();
    };
    const closeModalUpdate = () => {
      showModalUpdate.value = false;
      form.reset();
      form.clearErrors();
    };
    const closeModalDelete = () => {
      showModalDelete.value = false;
      form.reset();
      form.clearErrors();
    };
    const modalTambahData = () => {
      showModalCreate.value = true;
    };
    const modalLiatData = (data) => {
      showModalRead.value = true;
      form.id = data.id;
      form.branch_code = data.branch_code;
      form.branch_name = data.branch_name;
      form.branch_address = data.branch_address;
      form.description = data.description;
      form.status = data.status;
      form.last_update = data.last_update;
      form.created_at = data.created_at;
      form.updated_at = data.updated_at;
    };
    const modalUbahData = (data) => {
      showModalUpdate.value = true;
      form.id = data.id;
      form.branch_code = data.branch_code;
      form.branch_name = data.branch_name;
      form.branch_address = data.branch_address;
      form.description = data.description ?? "";
      form.status = data.status;
    };
    const modalHapusData = (data) => {
      showModalDelete.value = true;
      form.id = data.id;
    };
    const modalUpload = () => {
      showModalUpload.value = true;
    };
    const tambahData = () => {
      form.post(route("branches.store"), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalCreate.value = false;
        }
      });
    };
    const uploadData = () => {
      form.post(route("branch.upload"), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalUpload.value = false;
        }
      });
    };
    const ubahData = () => {
      form.put(route("branches.update", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalUpdate.value = false;
        }
      });
    };
    const hapusData = () => {
      form.delete(route("branches.destroy", form.id), {
        onSuccess: () => {
          form.reset();
          form.clearErrors();
          showModalDelete.value = false;
        }
      });
    };
    const downloadFile = async () => {
      try {
        const response = await axios.get("/api/download-format-cabang", {
          responseType: "blob"
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "format-cabang.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Gagal mengunduh file: ", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Cabang" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 h-full"${_scopeId}><div class="pb-4 border-b-2 border-dashed dark:border-gray-700"${_scopeId}><nav class="flex" aria-label="Breadcrumb"${_scopeId}><ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"${_scopeId}><li class="inline-flex items-center"${_scopeId}><a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"${_scopeId}></path></svg> Database </a></li><li aria-current="page"${_scopeId}><div class="flex items-center"${_scopeId}><svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"${_scopeId}></path></svg><span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"${_scopeId}>Cabang</span></div></li></ol></nav></div><div class="flex justify-between my-3"${_scopeId}><div class="w-full md:w-1/4"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500 dark:text-gray-400"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"${_scopeId}></path></svg></div><input${ssrRenderAttr("value", unref(search))} type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pencarian..."${_scopeId}></div></div><div${_scopeId}>`);
            if (unref(hasPermission)("branch: create")) {
              _push2(`<!--[--><button class="mr-2 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"${_scopeId}></path></svg> Unduh Format </button><button class="mr-2 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"${_scopeId}></path></svg> Upload </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                show: showModalUpload.value,
                onClose: closeModalUpload
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> UNGGAH CABANG </h3></div><form${_scopeId2}><div class="grid grid-cols-2 gap-2 px-4 py-2"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      for: "product_category_code",
                      value: "Unggah Berkas"
                    }, null, _parent3, _scopeId2));
                    _push3(`<input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.fileUpload
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"${_scopeId2}><button class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} type="submit"${_scopeId2}>Unggah</button></div></form></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                        createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                          createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UNGGAH CABANG ")
                        ]),
                        createVNode("form", {
                          onSubmit: withModifiers(uploadData, ["prevent"])
                        }, [
                          createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                            createVNode("div", null, [
                              createVNode(_sfc_main$3, {
                                for: "product_category_code",
                                value: "Unggah Berkas"
                              }),
                              createVNode("input", {
                                onInput: ($event) => unref(form).fileUpload = $event.target.files[0],
                                class: "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400",
                                "aria-describedby": "file_input_help",
                                id: "file_input",
                                type: "file"
                              }, null, 40, ["onInput"]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.fileUpload
                              }, null, 8, ["message"])
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                            createVNode("button", {
                              class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                              disabled: unref(form).processing,
                              type: "submit"
                            }, "Unggah", 10, ["disabled"])
                          ])
                        ], 32)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<button class="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId}></path></svg> Tambah Data </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                show: showModalCreate.value,
                onClose: closeModalCreate
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> TAMBAH CABANG </h3></div><form${_scopeId2}><div class="grid grid-cols-2 gap-4 mx-4"${_scopeId2}><div${_scopeId2}><label for="branch_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Nomor</label><input${ssrRenderAttr("value", unref(form).branch_code)} type="text" id="branch_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      message: unref(form).errors.branch_code
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}><label for="branch_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Nama Cabang</label><input${ssrRenderAttr("value", unref(form).branch_name)} type="text" id="branch_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      message: unref(form).errors.branch_name
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}><label for="branch_address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Alamat Cabang</label><input${ssrRenderAttr("value", unref(form).branch_address)} type="text" id="branch_address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      message: unref(form).errors.branch_address
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}><label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Status Cabang</label><select id="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}><option value="" selected disabled${_scopeId2}>Pilih</option><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}${_scopeId2}>Aktif</option><option value="Tidak Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Tidak Aktif") : ssrLooseEqual(unref(form).status, "Tidak Aktif")) ? " selected" : ""}${_scopeId2}>Tidak Aktif</option></select>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.status
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="col-span-2"${_scopeId2}><label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Profil Cabang</label>`);
                    _push3(ssrRenderComponent(_sfc_main$5, {
                      row: 9,
                      modelValue: unref(form).description,
                      "onUpdate:modelValue": ($event) => unref(form).description = $event,
                      placeholder: "Silahkan masukkan profil cabang disini..."
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: "mt-2",
                      message: unref(form).errors.description
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"${_scopeId2}><button class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} type="submit"${_scopeId2}>Simpan</button></div></form></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                        createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                          createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMBAH CABANG ")
                        ]),
                        createVNode("form", {
                          onSubmit: withModifiers(tambahData, ["prevent"])
                        }, [
                          createVNode("div", { class: "grid grid-cols-2 gap-4 mx-4" }, [
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "branch_code",
                                class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              }, "Nomor"),
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).branch_code = $event,
                                type: "text",
                                id: "branch_code",
                                class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).branch_code]
                              ]),
                              createVNode(_sfc_main$4, {
                                message: unref(form).errors.branch_code
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "branch_name",
                                class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              }, "Nama Cabang"),
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).branch_name = $event,
                                type: "text",
                                id: "branch_name",
                                class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).branch_name]
                              ]),
                              createVNode(_sfc_main$4, {
                                message: unref(form).errors.branch_name
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "branch_address",
                                class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              }, "Alamat Cabang"),
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).branch_address = $event,
                                type: "text",
                                id: "branch_address",
                                class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).branch_address]
                              ]),
                              createVNode(_sfc_main$4, {
                                message: unref(form).errors.branch_address
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "status",
                                class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              }, "Status Cabang"),
                              withDirectives(createVNode("select", {
                                id: "status",
                                "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              }, [
                                createVNode("option", {
                                  value: "",
                                  selected: "",
                                  disabled: ""
                                }, "Pilih"),
                                createVNode("option", { value: "Aktif" }, "Aktif"),
                                createVNode("option", { value: "Tidak Aktif" }, "Tidak Aktif")
                              ], 8, ["onUpdate:modelValue"]), [
                                [vModelSelect, unref(form).status]
                              ]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.status
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", { class: "col-span-2" }, [
                              createVNode("label", {
                                for: "description",
                                class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              }, "Profil Cabang"),
                              createVNode(_sfc_main$5, {
                                row: 9,
                                modelValue: unref(form).description,
                                "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                placeholder: "Silahkan masukkan profil cabang disini..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_sfc_main$4, {
                                class: "mt-2",
                                message: unref(form).errors.description
                              }, null, 8, ["message"])
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                            createVNode("button", {
                              class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                              disabled: unref(form).processing,
                              type: "submit"
                            }, "Simpan", 10, ["disabled"])
                          ])
                        ], 32)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
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
                              _push5(`KODE CABANG`);
                            } else {
                              return [
                                createTextVNode("KODE CABANG")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`NAMA CABANG`);
                            } else {
                              return [
                                createTextVNode("NAMA CABANG")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`ALAMAT CABANG`);
                            } else {
                              return [
                                createTextVNode("ALAMAT CABANG")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`STATUS CABANG`);
                            } else {
                              return [
                                createTextVNode("STATUS CABANG")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(TableHeaderCell, null, null, _parent4, _scopeId3));
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
                              createTextVNode("KODE CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("NAMA CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("ALAMAT CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell, null, {
                            default: withCtx(() => [
                              createTextVNode("STATUS CABANG")
                            ]),
                            _: 1
                          }),
                          createVNode(TableHeaderCell)
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
                            createTextVNode("KODE CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("NAMA CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("ALAMAT CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("STATUS CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.fetchData.data, (data, index) => {
                    _push3(ssrRenderComponent(TableRow, {
                      key: data.id,
                      class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "number" }, {
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
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_code)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_code), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_name), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(data.branch_address)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(data.branch_address), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "record" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<p class="${ssrRenderClass([data.status == "Aktif" ? "bg-green-500" : "bg-red-500", "text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center"])}"${_scopeId4}>${ssrInterpolate(data.status)}</p>`);
                              } else {
                                return [
                                  createVNode("p", {
                                    class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", data.status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                                  }, toDisplayString(data.status), 3)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$7, { status: "action" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (unref(hasPermission)("branch: read")) {
                                  _push5(`<button class="text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"${_scopeId4}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("branch: update")) {
                                  _push5(`<button class="text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (unref(hasPermission)("branch: delete")) {
                                  _push5(`<button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"${_scopeId4}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"${_scopeId4}></path></svg></button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  unref(hasPermission)("branch: read") ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => modalLiatData(data),
                                    class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                    type: "button"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("branch: update") ? (openBlock(), createBlock("button", {
                                    key: 1,
                                    onClick: ($event) => modalUbahData(data),
                                    class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                    type: "button"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true),
                                  unref(hasPermission)("branch: delete") ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    onClick: ($event) => modalHapusData(data),
                                    type: "button",
                                    class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      "stroke-width": "1.5",
                                      stroke: "currentColor",
                                      class: "w-3 h-3"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      })
                                    ]))
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$7, { status: "number" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(index + 1), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$7, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_code), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$7, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$7, { status: "record" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(data.branch_address), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$7, { status: "record" }, {
                              default: withCtx(() => [
                                createVNode("p", {
                                  class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", data.status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                                }, toDisplayString(data.status), 3)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_sfc_main$7, { status: "action" }, {
                              default: withCtx(() => [
                                unref(hasPermission)("branch: read") ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  onClick: ($event) => modalLiatData(data),
                                  class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                  type: "button"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    }),
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true),
                                unref(hasPermission)("branch: update") ? (openBlock(), createBlock("button", {
                                  key: 1,
                                  onClick: ($event) => modalUbahData(data),
                                  class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                  type: "button"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true),
                                unref(hasPermission)("branch: delete") ? (openBlock(), createBlock("button", {
                                  key: 2,
                                  onClick: ($event) => modalHapusData(data),
                                  type: "button",
                                  class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    "stroke-width": "1.5",
                                    stroke: "currentColor",
                                    class: "w-3 h-3"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    })
                                  ]))
                                ], 8, ["onClick"])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$7, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_code), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_address), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createVNode("p", {
                                class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", data.status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                              }, toDisplayString(data.status), 3)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "action" }, {
                            default: withCtx(() => [
                              unref(hasPermission)("branch: read") ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: ($event) => modalLiatData(data),
                                class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  }),
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("branch: update") ? (openBlock(), createBlock("button", {
                                key: 1,
                                onClick: ($event) => modalUbahData(data),
                                class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("branch: delete") ? (openBlock(), createBlock("button", {
                                key: 2,
                                onClick: ($event) => modalHapusData(data),
                                type: "button",
                                class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              pagination: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$6, {
                    pagination: __props.fetchData.meta
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$6, {
                      pagination: __props.fetchData.meta
                    }, null, 8, ["pagination"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalRead.value,
              onClose: closeModalRead
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> TAMPILKAN CABANG </h3></div><div class="py-2"${_scopeId2}><div class="relative overflow-x-auto"${_scopeId2}><table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"${_scopeId2}><tbody${_scopeId2}><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> ID </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).id)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> KODE CABANG </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).branch_code)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> NAMA CABANG </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).branch_name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> ALAMAT CABANG </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).branch_address)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> STATUS CABANG </th><td class="px-6 py-4"${_scopeId2}><p class="${ssrRenderClass([unref(form).status == "Aktif" ? "bg-green-500" : "bg-red-500", "text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center"])}"${_scopeId2}>${ssrInterpolate(unref(form).status)}</p></td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> PROFIL CABANG </th><td class="px-6 py-4"${_scopeId2}><pre style="${ssrRenderStyle({ "white-space": "pre-line", "font-size": "13px", "color": "gray", "font-family": "'Arial', sans-serif" })}"${_scopeId2}>                                                ${ssrInterpolate(unref(form).description)}
                                            </pre></td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> DIUBAH OLEH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).last_update.user.name)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIBUAT </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).created_at)}</td></tr><tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"${_scopeId2}><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"${_scopeId2}> TANGGAL DIUBAH </th><td class="px-6 py-4"${_scopeId2}>${ssrInterpolate(unref(form).updated_at)}</td></tr></tbody></table></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN CABANG ")
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "relative overflow-x-auto" }, [
                          createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                            createVNode("tbody", null, [
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ID "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).id), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " KODE CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_code), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " NAMA CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ALAMAT CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_address), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " STATUS CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("p", {
                                    class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", unref(form).status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                                  }, toDisplayString(unref(form).status), 3)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " PROFIL CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("pre", { style: { "white-space": "pre-line", "font-size": "13px", "color": "gray", "font-family": "'Arial', sans-serif" } }, "                                                " + toDisplayString(unref(form).description) + "\n                                            ", 1)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " DIUBAH OLEH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).last_update.user.name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIBUAT "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).created_at), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIUBAH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).updated_at), 1)
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalUpdate.value,
              onClose: closeModalUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"${_scopeId2}><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId2}> UBAH CABANG </h3></div><form${_scopeId2}><div class="grid grid-cols-2 gap-4 mx-4"${_scopeId2}><div${_scopeId2}><label for="branch_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Nomor</label><input${ssrRenderAttr("value", unref(form).branch_code)} type="text" id="branch_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    message: unref(form).errors.branch_code
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label for="branch_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Nama Cabang</label><input${ssrRenderAttr("value", unref(form).branch_name)} type="text" id="branch_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    message: unref(form).errors.branch_name
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label for="branch_address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Alamat Cabang</label><input${ssrRenderAttr("value", unref(form).branch_address)} type="text" id="branch_address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    message: unref(form).errors.branch_address
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Status Cabang</label><select id="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId2}><option value="" selected disabled${_scopeId2}>Pilih</option><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}${_scopeId2}>Aktif</option><option value="Tidak Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Tidak Aktif") : ssrLooseEqual(unref(form).status, "Tidak Aktif")) ? " selected" : ""}${_scopeId2}>Tidak Aktif</option></select>`);
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "mt-2",
                    message: unref(form).errors.status
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="col-span-2"${_scopeId2}><label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>Profil Cabang</label>`);
                  _push3(ssrRenderComponent(_sfc_main$5, {
                    row: 9,
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    placeholder: "Silahkan masukkan profil cabang disini..."
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "mt-2",
                    message: unref(form).errors.description
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"${_scopeId2}><button class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} type="submit"${_scopeId2}>Ubah</button></div></form></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UBAH CABANG ")
                      ]),
                      createVNode("form", {
                        onSubmit: withModifiers(ubahData, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-4 mx-4" }, [
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_code",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Nomor"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_code = $event,
                              type: "text",
                              id: "branch_code",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_code]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_code
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_name",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Nama Cabang"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_name = $event,
                              type: "text",
                              id: "branch_name",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_name]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_name
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_address",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Alamat Cabang"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_address = $event,
                              type: "text",
                              id: "branch_address",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_address]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_address
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "status",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Status Cabang"),
                            withDirectives(createVNode("select", {
                              id: "status",
                              "onUpdate:modelValue": ($event) => unref(form).status = $event,
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, [
                              createVNode("option", {
                                value: "",
                                selected: "",
                                disabled: ""
                              }, "Pilih"),
                              createVNode("option", { value: "Aktif" }, "Aktif"),
                              createVNode("option", { value: "Tidak Aktif" }, "Tidak Aktif")
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, unref(form).status]
                            ]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.status
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", { class: "col-span-2" }, [
                            createVNode("label", {
                              for: "description",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Profil Cabang"),
                            createVNode(_sfc_main$5, {
                              row: 9,
                              modelValue: unref(form).description,
                              "onUpdate:modelValue": ($event) => unref(form).description = $event,
                              placeholder: "Silahkan masukkan profil cabang disini..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.description
                            }, null, 8, ["message"])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                          createVNode("button", {
                            class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                            disabled: unref(form).processing,
                            type: "submit"
                          }, "Ubah", 10, ["disabled"])
                        ])
                      ], 32)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showModalDelete.value,
              onClose: closeModalDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700"${_scopeId2}><div class="p-4 md:p-5 text-center"${_scopeId2}><svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"${_scopeId2}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg><h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"${_scopeId2}> Apakah anda yakin ingin menghapus cabang ini ? </h3><button type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"${_scopeId2}> Ya, saya yakin </button><button type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"${_scopeId2}> Tidak, batalkan </button></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "p-4 md:p-5 text-center" }, [
                        (openBlock(), createBlock("svg", {
                          class: "mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200",
                          "aria-hidden": "true",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            stroke: "currentColor",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          })
                        ])),
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus cabang ini ? "),
                        createVNode("button", {
                          onClick: hapusData,
                          type: "button",
                          class: "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                        }, " Ya, saya yakin "),
                        createVNode("button", {
                          onClick: closeModalDelete,
                          type: "button",
                          class: "py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }, " Tidak, batalkan ")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
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
                              d: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                            })
                          ])),
                          createTextVNode(" Database ")
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
                          createVNode("span", { class: "ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400" }, "Cabang")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between my-3" }, [
                  createVNode("div", { class: "w-full md:w-1/4" }, [
                    createVNode("div", { class: "relative" }, [
                      createVNode("div", { class: "absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "w-4 h-4 text-gray-500 dark:text-gray-400"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                          })
                        ]))
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : search = $event,
                        type: "text",
                        id: "input-group-1",
                        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        placeholder: "Pencarian..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(search)]
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    unref(hasPermission)("branch: create") ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("button", {
                        onClick: downloadFile,
                        class: "mr-2 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "size-4 mr-1"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          })
                        ])),
                        createTextVNode(" Unduh Format ")
                      ]),
                      createVNode("button", {
                        onClick: ($event) => modalUpload(),
                        class: "mr-2 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          "stroke-width": "1.5",
                          stroke: "currentColor",
                          class: "size-4 mr-1"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          })
                        ])),
                        createTextVNode(" Upload ")
                      ], 8, ["onClick"]),
                      createVNode(_sfc_main$2, {
                        show: showModalUpload.value,
                        onClose: closeModalUpload
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                            createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                              createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UNGGAH CABANG ")
                            ]),
                            createVNode("form", {
                              onSubmit: withModifiers(uploadData, ["prevent"])
                            }, [
                              createVNode("div", { class: "grid grid-cols-2 gap-2 px-4 py-2" }, [
                                createVNode("div", null, [
                                  createVNode(_sfc_main$3, {
                                    for: "product_category_code",
                                    value: "Unggah Berkas"
                                  }),
                                  createVNode("input", {
                                    onInput: ($event) => unref(form).fileUpload = $event.target.files[0],
                                    class: "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400",
                                    "aria-describedby": "file_input_help",
                                    id: "file_input",
                                    type: "file"
                                  }, null, 40, ["onInput"]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.fileUpload
                                  }, null, 8, ["message"])
                                ])
                              ]),
                              createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                                createVNode("button", {
                                  class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                                  disabled: unref(form).processing,
                                  type: "submit"
                                }, "Unggah", 10, ["disabled"])
                              ])
                            ], 32)
                          ])
                        ]),
                        _: 1
                      }, 8, ["show"]),
                      createVNode("button", {
                        onClick: ($event) => modalTambahData(),
                        class: "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      }, [
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
                            d: "M12 4.5v15m7.5-7.5h-15"
                          })
                        ])),
                        createTextVNode(" Tambah Data ")
                      ], 8, ["onClick"]),
                      createVNode(_sfc_main$2, {
                        show: showModalCreate.value,
                        onClose: closeModalCreate
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                            createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                              createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMBAH CABANG ")
                            ]),
                            createVNode("form", {
                              onSubmit: withModifiers(tambahData, ["prevent"])
                            }, [
                              createVNode("div", { class: "grid grid-cols-2 gap-4 mx-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "branch_code",
                                    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  }, "Nomor"),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(form).branch_code = $event,
                                    type: "text",
                                    id: "branch_code",
                                    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(form).branch_code]
                                  ]),
                                  createVNode(_sfc_main$4, {
                                    message: unref(form).errors.branch_code
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "branch_name",
                                    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  }, "Nama Cabang"),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(form).branch_name = $event,
                                    type: "text",
                                    id: "branch_name",
                                    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(form).branch_name]
                                  ]),
                                  createVNode(_sfc_main$4, {
                                    message: unref(form).errors.branch_name
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "branch_address",
                                    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  }, "Alamat Cabang"),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(form).branch_address = $event,
                                    type: "text",
                                    id: "branch_address",
                                    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(form).branch_address]
                                  ]),
                                  createVNode(_sfc_main$4, {
                                    message: unref(form).errors.branch_address
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "status",
                                    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  }, "Status Cabang"),
                                  withDirectives(createVNode("select", {
                                    id: "status",
                                    "onUpdate:modelValue": ($event) => unref(form).status = $event,
                                    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  }, [
                                    createVNode("option", {
                                      value: "",
                                      selected: "",
                                      disabled: ""
                                    }, "Pilih"),
                                    createVNode("option", { value: "Aktif" }, "Aktif"),
                                    createVNode("option", { value: "Tidak Aktif" }, "Tidak Aktif")
                                  ], 8, ["onUpdate:modelValue"]), [
                                    [vModelSelect, unref(form).status]
                                  ]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.status
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", { class: "col-span-2" }, [
                                  createVNode("label", {
                                    for: "description",
                                    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  }, "Profil Cabang"),
                                  createVNode(_sfc_main$5, {
                                    row: 9,
                                    modelValue: unref(form).description,
                                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                    placeholder: "Silahkan masukkan profil cabang disini..."
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(_sfc_main$4, {
                                    class: "mt-2",
                                    message: unref(form).errors.description
                                  }, null, 8, ["message"])
                                ])
                              ]),
                              createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                                createVNode("button", {
                                  class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                                  disabled: unref(form).processing,
                                  type: "submit"
                                }, "Simpan", 10, ["disabled"])
                              ])
                            ], 32)
                          ])
                        ]),
                        _: 1
                      }, 8, ["show"])
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
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
                            createTextVNode("KODE CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("NAMA CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("ALAMAT CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell, null, {
                          default: withCtx(() => [
                            createTextVNode("STATUS CABANG")
                          ]),
                          _: 1
                        }),
                        createVNode(TableHeaderCell)
                      ]),
                      _: 1
                    })
                  ]),
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.fetchData.data, (data, index) => {
                      return openBlock(), createBlock(TableRow, {
                        key: data.id,
                        class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$7, { status: "number" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(index + 1), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_code), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(data.branch_address), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "record" }, {
                            default: withCtx(() => [
                              createVNode("p", {
                                class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", data.status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                              }, toDisplayString(data.status), 3)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_sfc_main$7, { status: "action" }, {
                            default: withCtx(() => [
                              unref(hasPermission)("branch: read") ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: ($event) => modalLiatData(data),
                                class: "text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  }),
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("branch: update") ? (openBlock(), createBlock("button", {
                                key: 1,
                                onClick: ($event) => modalUbahData(data),
                                class: "text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                                type: "button"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              unref(hasPermission)("branch: delete") ? (openBlock(), createBlock("button", {
                                key: 2,
                                onClick: ($event) => modalHapusData(data),
                                type: "button",
                                class: "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  "stroke-width": "1.5",
                                  stroke: "currentColor",
                                  class: "w-3 h-3"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  pagination: withCtx(() => [
                    createVNode(_sfc_main$6, {
                      pagination: __props.fetchData.meta
                    }, null, 8, ["pagination"])
                  ]),
                  _: 1
                }),
                createVNode(_sfc_main$2, {
                  show: showModalRead.value,
                  onClose: closeModalRead
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " TAMPILKAN CABANG ")
                      ]),
                      createVNode("div", { class: "py-2" }, [
                        createVNode("div", { class: "relative overflow-x-auto" }, [
                          createVNode("table", { class: "table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" }, [
                            createVNode("tbody", null, [
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ID "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).id), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " KODE CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_code), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " NAMA CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " ALAMAT CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).branch_address), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " STATUS CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("p", {
                                    class: ["text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center", unref(form).status == "Aktif" ? "bg-green-500" : "bg-red-500"]
                                  }, toDisplayString(unref(form).status), 3)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " PROFIL CABANG "),
                                createVNode("td", { class: "px-6 py-4" }, [
                                  createVNode("pre", { style: { "white-space": "pre-line", "font-size": "13px", "color": "gray", "font-family": "'Arial', sans-serif" } }, "                                                " + toDisplayString(unref(form).description) + "\n                                            ", 1)
                                ])
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " DIUBAH OLEH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).last_update.user.name), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIBUAT "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).created_at), 1)
                              ]),
                              createVNode("tr", { class: "bg-white border-b dark:bg-gray-800 dark:border-gray-700" }, [
                                createVNode("th", {
                                  scope: "row",
                                  class: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                }, " TANGGAL DIUBAH "),
                                createVNode("td", { class: "px-6 py-4" }, toDisplayString(unref(form).updated_at), 1)
                              ])
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$2, {
                  show: showModalUpdate.value,
                  onClose: closeModalUpdate
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600" }, [
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, " UBAH CABANG ")
                      ]),
                      createVNode("form", {
                        onSubmit: withModifiers(ubahData, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-4 mx-4" }, [
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_code",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Nomor"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_code = $event,
                              type: "text",
                              id: "branch_code",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_code]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_code
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_name",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Nama Cabang"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_name = $event,
                              type: "text",
                              id: "branch_name",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_name]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_name
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "branch_address",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Alamat Cabang"),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).branch_address = $event,
                              type: "text",
                              id: "branch_address",
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).branch_address]
                            ]),
                            createVNode(_sfc_main$4, {
                              message: unref(form).errors.branch_address
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "status",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Status Cabang"),
                            withDirectives(createVNode("select", {
                              id: "status",
                              "onUpdate:modelValue": ($event) => unref(form).status = $event,
                              class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            }, [
                              createVNode("option", {
                                value: "",
                                selected: "",
                                disabled: ""
                              }, "Pilih"),
                              createVNode("option", { value: "Aktif" }, "Aktif"),
                              createVNode("option", { value: "Tidak Aktif" }, "Tidak Aktif")
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, unref(form).status]
                            ]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.status
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", { class: "col-span-2" }, [
                            createVNode("label", {
                              for: "description",
                              class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            }, "Profil Cabang"),
                            createVNode(_sfc_main$5, {
                              row: 9,
                              modelValue: unref(form).description,
                              "onUpdate:modelValue": ($event) => unref(form).description = $event,
                              placeholder: "Silahkan masukkan profil cabang disini..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_sfc_main$4, {
                              class: "mt-2",
                              message: unref(form).errors.description
                            }, null, 8, ["message"])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600" }, [
                          createVNode("button", {
                            class: [{ "opacity-25": unref(form).processing }, "text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"],
                            disabled: unref(form).processing,
                            type: "submit"
                          }, "Ubah", 10, ["disabled"])
                        ])
                      ], 32)
                    ])
                  ]),
                  _: 1
                }, 8, ["show"]),
                createVNode(_sfc_main$2, {
                  show: showModalDelete.value,
                  onClose: closeModalDelete
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" }, [
                      createVNode("div", { class: "p-4 md:p-5 text-center" }, [
                        (openBlock(), createBlock("svg", {
                          class: "mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200",
                          "aria-hidden": "true",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            stroke: "currentColor",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          })
                        ])),
                        createVNode("h3", { class: "mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" }, " Apakah anda yakin ingin menghapus cabang ini ? "),
                        createVNode("button", {
                          onClick: hapusData,
                          type: "button",
                          class: "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                        }, " Ya, saya yakin "),
                        createVNode("button", {
                          onClick: closeModalDelete,
                          type: "button",
                          class: "py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }, " Tidak, batalkan ")
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["show"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Database/Branches/IndexBranch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
