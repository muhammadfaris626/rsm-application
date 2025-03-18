<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed, onMounted, nextTick } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import Textarea from '@/Components/Textarea.vue';
    import VueMultiselect from "vue-multiselect";

    const props = defineProps({
        requestNumber: {
            type: String,
            required: true
        },
        requestOrders: {
            type: Array,
            required: true
        },
        branches: {
            type: Array,
            required: true
        }
    });

    const form = useForm({
        request_order_id: "",
        branch_id: "",
        request_number: props.requestNumber,
        date: "",
    });

    const branchProducts = ref([]);

    watch(() => form.request_order_id, (newVal) => {
        if (newVal?.branch_product) {
            branchProducts.value = newVal.branch_product.map(product => ({
                ...product,
                total_return: product.total_return ?? "",
            }));
        } else {
            branchProducts.value = [];
        }
    }, { deep: true, immediate: true });

    const submitRequest = () => {
        let valid = true;
        branchProducts.value.forEach((product) => {
            if (!product.total_return) {
                alert(`Jumlah return untuk ${product.product.product_name} harus diisi!. Jika tidak ingin return silahkan isi angka 0.`);
                valid = false;
            } else if (product.total_return > product.quantity) {
                alert(`Jumlah return untuk ${product.product.product_name} tidak boleh lebih dari sisa stok!`);
                valid = false;
            }
        });
        if (valid) {
            form.post(route('requestReturns.store'), {
                onSuccess: () => {
                    form.reset();
                    form.clearErrors();
                }
            });
        }
    }
</script>
<template>
    <Head title="Tambah Permintaan Pesanan" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                                Produk
                            </a>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link :href="route('requestReturns.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Permintaan Return</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Tambah Permintaan Return</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="pt-4">
                <h1 class="text-xl font-semibold text-blue-600">TAMBAH PERMINTAAN RETURN</h1>
                <form @submit.prevent="submitRequest">
                    <div class="grid grid-cols-4 gap-2 mt-2 bg-white pt-4 pb-6 px-4 rounded-xl">
                        <div>
                            <InputLabel for="request_number" value="Nomor Permintaan" />
                            <TextInput
                                id="request_number"
                                type="text"
                                class="mt-1 block w-full bg-slate-300"
                                v-model="form.request_number"
                                disabled
                            />
                            <InputError class="mt-2" :message="form.errors.request_number" />
                        </div>
                        <div>
                            <InputLabel for="request_order_id" value="Nomor RO" />
                            <VueMultiselect
                                v-model="form.request_order_id"
                                :options="props.requestOrders"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="ro_number"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.request_order_id" />
                        </div>
                        <div>
                            <InputLabel for="branch_id" value="Cabang" />
                            <VueMultiselect
                                v-model="form.branch_id"
                                :options="props.branches"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="branch_name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.branch_id" />
                        </div>
                        <div>
                            <InputLabel for="date" value="Tanggal" />
                            <TextInput
                                id="date"
                                type="date"
                                class="mt-1 block w-full"
                                v-model="form.date"
                            />
                            <InputError class="mt-2" :message="form.errors.date" />
                        </div>
                    </div>
                    <h1 v-if="form.request_order_id != ''" class="text-xl font-semibold text-blue-600 my-2">BARANG</h1>
                    <div v-if="form.request_order_id != ''" class="bg-white pt-4 pb-6 px-4 rounded-xl">
                        <div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all">
                            <h1 class="mr-10 text-md font-semibold text-center">NO</h1>
                            <div class="grid grid-cols-5 gap-2 w-full text-center">
                                <div class="col-span-2">
                                    <h1 class="mr-5 text-md font-semibold text-center">NAMA BARANG</h1>
                                </div>
                                <div>
                                    <h1 class="mr-5 text-md font-semibold text-center">SISA STOK</h1>
                                </div>
                                <div>
                                    <h1 class="mr-5 text-md font-semibold text-center">JUMLAH RETURN</h1>
                                </div>
                            </div>
                        </div>
                        <div v-for="(product, index) in branchProducts" :key="index">
                            <div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all">
                                <h1 class="mr-10 text-lg font-semibold text-center">{{ index+1 }}.</h1>
                                <div class="grid grid-cols-5 gap-2 w-full">
                                    <div class="col-span-2">
                                        <TextInput
                                            type="text"
                                            class="block w-full bg-slate-300"
                                            placeholder="Jumlah Barang"
                                            v-model="product.product.product_name"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            type="text"
                                            class="block w-full bg-slate-300 text-center"
                                            placeholder="Jumlah Barang"
                                            v-model="product.quantity"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            type="text"
                                            class="block w-full bg-white text-center"
                                            placeholder="Jumlah Barang"
                                            v-model="form.request_order_id.branch_product[index].total_return"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">SIMPAN</button>
                        <Link :href="route('requestReturns.index')" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">KEMBALI</Link>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
