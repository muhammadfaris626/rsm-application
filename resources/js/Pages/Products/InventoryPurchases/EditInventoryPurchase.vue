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
        inventoryPurchase: {
            type: Object,
            required: true
        },
        suppliers: {
            type: Array
        },
        products: {
            type: Array
        }
    });

    const selectedSupplier = Array.isArray(props.inventoryPurchase?.supplier_id)
        ? props.inventoryPurchase.supplier_id[0]
        : props.inventoryPurchase?.supplier_id;

    const productLabel = (product) => {
        const productOption = props.products.find(option => option.id === product?.id) ?? product;
        const category = Array.isArray(productOption?.product_category_id)
            ? productOption.product_category_id[0]
            : null;
        const categoryName = category?.product_category_name ?? 'Tanpa Kategori';

        return `[ ${categoryName} ] ${product?.product_name ?? '-'}`;
    };

    const form = useForm({
        id: props.inventoryPurchase?.id,
        invoice_number: props.inventoryPurchase?.invoice_number,
        date: props.inventoryPurchase?.date,
        supplier_id: selectedSupplier ?? "",
        // products: props.inventoryPurchase?.listData,
        products: (props.inventoryPurchase?.listData ?? []).map(item => ({
            product_id: item.product,
            price: item.price || "",
            quantity: item.quantity || "",
            total_price: item.total_price || ""
        }))
    });


    const addProduct = () => {
        form.products.push({
            product_id: "",
            price: "",
            quantity: "",
            total_price: ""
        });
    }

    const removeProduct = (index) => {
        form.products.splice(index, 1);
    }

    watch(
        () => form.products.map(product => ({ price: product.price, quantity: product.quantity })),
        (newValues) => {
            newValues.forEach((value, index) => {
                form.products[index].total_price = ((value.price || 0) * (value.quantity || 0)).toString();
            });
        },
        { deep: true }
    );
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
    <Head title="Ubah Pembelian Persediaan" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Ubah Pembelian Persediaan</h1>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Edit data pembelian persediaan</p>
                </div>
                <div>
                    <Link :href="route('inventoryPurchases.index')" class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </Link>
                </div>
            </div>

            <form @submit.prevent="form.put(route('inventoryPurchases.update', form.id))">
                <!-- Informasi Pembelian -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Informasi Pembelian</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <InputLabel for="invoice_number" value="Nomor Faktur" />
                            <TextInput
                                id="invoice_number"
                                type="text"
                                class="mt-1 block w-full"
                                v-model="form.invoice_number"
                            />
                            <InputError class="mt-2" :message="form.errors.invoice_number" />
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
                        <div>
                            <InputLabel for="supplier_id" value="Supplier" />
                            <VueMultiselect
                                v-model="form.supplier_id"
                                :options="props.suppliers"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.supplier_id" />
                        </div>
                    </div>
                </div>

                <!-- Daftar Barang -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Daftar Barang</h2>
                    </div>
                    <div>
                        <div v-if="form.products.length > 0" class="space-y-4 mb-4">
                            <div v-for="(product, index) in form.products" :key="index" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                                <div class="flex flex-col sm:flex-row items-start gap-3">
                                    <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                        {{ index+1 }}
                                    </div>
                                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div class="sm:col-span-2 lg:col-span-1">
                                            <InputLabel :for="'product_id_' + index" value="Nama Barang" />
                                            <VueMultiselect
                                                class="bg-white dark:bg-gray-700"
                                                v-model="product.product_id"
                                                :options="props.products"
                                                :close-on-select="true"
                                                placeholder="Pilih Barang"
                                                :custom-label="productLabel"
                                                track-by="id"
                                                :id="'product_id_' + index"
                                            />
                                            <InputError class="mt-2" :message="form.errors['products.' + index + '.product_id']" />
                                        </div>
                                        <div>
                                            <InputLabel :for="'price_' + index" value="Harga Barang" />
                                            <vue-number
                                                prefix="Rp "
                                                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                v-model="product.price"
                                                :id="'price_' + index"
                                                placeholder="Harga Barang"
                                                v-bind="number" />
                                            <InputError class="mt-2" :message="form.errors['products.' + index + '.price']" />
                                        </div>
                                        <div>
                                            <InputLabel :for="'quantity_' + index" value="Jumlah Barang" />
                                            <TextInput
                                                :id="'quantity_' + index"
                                                type="text"
                                                class="block w-full bg-white dark:bg-gray-700"
                                                placeholder="Jumlah Barang"
                                                v-model="product.quantity"
                                            />
                                            <InputError class="mt-2" :message="form.errors['products.' + index + '.quantity']" />
                                        </div>
                                        <div>
                                            <InputLabel :for="'total_price_' + index" value="Total Harga" />
                                            <vue-number
                                                prefix="Rp "
                                                class="bg-gray-200 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                v-model="product.total_price"
                                                :id="'total_price_' + index"
                                                placeholder="Rp 0"
                                                v-bind="number"
                                                disabled />
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 flex justify-end sm:justify-start">
                                        <button @click="removeProduct(index)" class="p-2.5 text-center text-sm transition-all bg-red-500 text-white hover:bg-red-600 rounded-lg disabled:pointer-events-none disabled:opacity-50" type="button" title="Hapus Barang">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                                <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p class="text-gray-500 dark:text-gray-400 mb-4">Belum ada barang yang ditambahkan</p>
                        </div>
                        <div class="flex justify-center mt-4">
                            <button @click="addProduct" type="button" class="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Barang
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Total Summary -->
                <div v-if="form.products.length > 0" class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p class="text-green-100 text-sm font-medium mb-1">Total Item</p>
                            <p class="text-xl sm:text-2xl font-bold">{{ form.products.length }} Barang</p>
                        </div>
                        <div>
                            <p class="text-green-100 text-sm font-medium mb-1">Total Harga</p>
                            <p class="text-xl sm:text-2xl font-bold">
                                {{ form.products.reduce((sum, p) => sum + (parseFloat(p.total_price || 0)), 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 justify-end">
                    <Link :href="route('inventoryPurchases.index')" class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        Batal
                    </Link>
                    <button type="submit" class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Update Data
                    </button>
                </div>
            </form>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
