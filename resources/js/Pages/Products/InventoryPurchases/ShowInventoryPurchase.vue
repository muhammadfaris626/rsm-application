<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed, onMounted, nextTick } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import Textarea from '@/Components/Textarea.vue';
    import VueMultiselect from "vue-multiselect";
    import JsBarcode from "jsbarcode";

    const props = defineProps({
        inventoryPurchase: {
            type: Object
        }
    });

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
            (s) =>
                s.inventory_purchase_id === item.inventory_purchase_id &&
                s.product_id === item.product_id
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
            form.selectedCheckbox = mergedList.value.map(item => item.serial_barcode);
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
                        displayValue: true,
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
        const url = route('printBarcode', form);
        window.open(url, '_blank');
    };
</script>

<template>
    <Head title="Tambah Pembeliaan Persediaan" />
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
                                <Link :href="route('inventoryPurchases.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Data Pembelian Persediaan</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Daftar Pembeliaan Persediaan</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="pt-4 grid grid-cols-1 gap-4">
                <div class="bg-white rounded-xl py-2">
                    <div class="relative overflow-x-auto">
                        <table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody>
                                <tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Nomor Faktur
                                    </th>
                                    <td>
                                        :
                                    </td>
                                    <td class="px-4 font-bold">
                                        {{ inventoryPurchase.invoice_number }}
                                    </td>
                                </tr>
                                <tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Tanggal
                                    </th>
                                    <td>
                                        :
                                    </td>
                                    <td class="px-4">
                                        {{ new Date(inventoryPurchase.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) }}
                                    </td>
                                </tr>
                                <tr class="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Supplier
                                    </th>
                                    <td>
                                        :
                                    </td>
                                    <td class="px-4">
                                        {{ inventoryPurchase.supplier_id[0].name }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="bg-white rounded-xl py-4 px-4">
                    <div class="flex justify-between mb-4">
                        <div>
                            <div class="flex justify-start">
                                <div class="flex items-center justify-start mr-2">
                                    Jumlah cetak per barcode :
                                </div>
                                <div class="w-14">
                                    <TextInput
                                        id="text"
                                        type="text"
                                        class="block w-full text-center"
                                        v-model="form.jumlahCetak"
                                    />
                                </div>
                                <div class="flex items-center justify-start mr-2 ml-2">
                                    <button @click="handlePrint" type="button" class="px-5 py-2 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center">
                                        PRINT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="p-4">
                                        <div class="flex items-center">
                                            <input v-model="selectAll" id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="checkbox-all-search" class="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        No
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Nama Barang
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Harga
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Jumlah
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Total Harga
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Sisa Stok
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Serial Barcode
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Barcode
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in mergedList" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td class="w-4 p-4">
                                        <div class="flex items-center">
                                            <input v-model="form.selectedCheckbox" :value="data.serial_barcode" id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {{ index + 1 }}
                                    </th>
                                    <td class="px-6 py-4">
                                        {{ data.product.product_name }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ formatRupiah(data.price) }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ data.quantity }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ formatRupiah(data.total_price) }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ data.stock }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ data.serial_barcode }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <svg :id="`barcode-${index}`"></svg>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
