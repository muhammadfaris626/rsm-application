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
    import QrcodeVue, { QrcodeCanvas, QrcodeSvg } from 'qrcode.vue';

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
    <Head title="Detail Pembelian Persediaan" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Detail Pembelian Persediaan</h1>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Lihat detail dan cetak barcode</p>
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

            <!-- Informasi Pembelian -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nomor Faktur</label>
                        <p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{{ inventoryPurchase.invoice_number }}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal</label>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ new Date(inventoryPurchase.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) }}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Supplier</label>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ inventoryPurchase.supplier_id?.[0]?.name || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Print Barcode Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div class="flex items-center gap-3">
                        <div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Cetak Barcode</h2>
                    </div>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah cetak per barcode:</label>
                            <div class="w-20">
                                <TextInput
                                    id="jumlahCetak"
                                    type="text"
                                    class="block w-full text-center"
                                    v-model="form.jumlahCetak"
                                />
                            </div>
                        </div>
                        <button @click="handlePrint" type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700">
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
                                        QrCode
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(data, index) in mergedList" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                                        <QrcodeVue :value="data.serial_barcode" :size="50" level="H" render-as="svg" />
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
