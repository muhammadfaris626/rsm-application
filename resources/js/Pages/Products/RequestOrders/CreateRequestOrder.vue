<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import Textarea from '@/Components/Textarea.vue';
    import VueMultiselect from "vue-multiselect";

    const props = defineProps({
        ro_number: {
            type: String
        },
        branches: {
            type: Array
        },
        products: {
            type: Array
        }
    });

    const form = useForm({
        ro_number: props.ro_number,
        date: "",
        branch_id: "",
        date: "",
        products: []
    });

    const addProduct = () => {
        form.products.push({
            product_id: "",
            quantity: "",
        });
    }

    const removeProduct = (index) => {
        form.products.splice(index, 1);
    }

    const products = computed(() => usePage().props.products ?? []);

    const formattedProducts = computed(() => {
        return products.value.map(product => ({
            id: product.id,
            label: `${product.product_id?.[0].product_name}`,
            stock: product.stock || 0,
            serial_barcode: product.serial_barcode
        }));
    }, { deep: true });
</script>

<script>
    import { component as VueNumber } from '@coders-tm/vue-number-format'

    export default {
        components: {
            VueNumber,
        },

        data() {
            return {
                number: {
                    decimal: ',',   // Pemisah desimal
                    separator: '.', // Pemisah ribuan
                    precision: 2,   // Jumlah desimal
                    masked: false,  // Nilai sebenarnya tetap berupa angka
                },
            }
        },
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
                                <Link :href="route('requestOrders.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Permintaan Stok</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Tambah Permintaan Stok</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="pt-4">
                <h1 class="text-xl font-semibold text-blue-600">TAMBAH PERMINTAAN STOK</h1>
                <form @submit.prevent="form.post(route('requestOrders.store'))">
                    <div class="grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl">
                        <div>
                            <InputLabel for="ro_number" value="Nomor Permintaan" />
                            <TextInput
                                id="ro_number"
                                type="text"
                                class="mt-1 block w-full bg-slate-300"
                                v-model="form.ro_number"
                                disabled
                            />
                            <InputError class="mt-2" :message="form.errors.ro_number" />
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
                    <h1 class="text-xl font-semibold text-blue-600 my-2">TAMBAH BARANG</h1>
                    <div class="bg-white p-4 rounded-xl">
                        <div v-if="form.products.length > 0" class="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 mb-4">
                            <div class="flex flex-col gap-1 p-1.5">
                                <div v-for="(product, index) in form.products" :key="index">
                                    <div class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all">
                                        <h1 class="mr-2 text-lg font-semibold">{{ index+1 }}.</h1>
                                        <div class="grid grid-cols-5 gap-2 w-full">
                                            <div class="col-span-2">
                                                <VueMultiselect
                                                    class="bg-white"
                                                    v-model="product.product_id"
                                                    :options="formattedProducts"
                                                    :close-on-select="true"
                                                    placeholder="Pilih Barang"
                                                    label="label"
                                                    track-by="id"
                                                    :id="'product_id_' + index"
                                                />
                                                <InputError class="mt-2" :message="form.errors['products.' + index + '.product_id']" />
                                            </div>
                                            <div>
                                                <TextInput
                                                    :id="'quantity_' + index"
                                                    type="text"
                                                    class="block w-full bg-white"
                                                    placeholder="Jumlah Barang"
                                                    v-model="product.quantity"
                                                />
                                                <InputError class="mt-2" :message="form.errors['products.' + index + '.quantity']" />
                                            </div>
                                            <!-- <div v-if="product.product_id?.stock != null" class="flex items-center">
                                                <p>Stok Tersedia : <b>{{ product.product_id.stock }}</b></p>
                                            </div> -->
                                        </div>
                                        <div class="ml-2 grid place-items-center justify-self-end">
                                            <button @click="removeProduct(index)" class="rounded-md border border-transparent p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-flex-row-reverse space-x-4 space-x-reverse justify-center">
                            <div class="text-center">
                                <button @click="addProduct" type="button" class="px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center">
                                    Tambah Barang
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">SIMPAN</button>
                        <Link :href="route('requestOrders.index')" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">KEMBALI</Link>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
