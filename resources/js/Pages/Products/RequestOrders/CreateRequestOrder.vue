<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import Textarea from '@/Components/Textarea.vue';
    import VueMultiselect from "vue-multiselect";
    import RequestOrderProductCard from '@/Components/RequestOrderProductCard.vue';

    const props = defineProps({
        ro_number: {
            type: String
        },
        branches: {
            type: Array
        },
        products: {
            type: Array
        },
        branchProductStocks: {
            type: Array,
            default: () => []
        }
    });

    const form = useForm({
        ro_number: props.ro_number,
        date: "",
        branch_id: "",
        products: []
    });

    const addProduct = () => {
        form.products.push({
            product_id: "",
            quantity: "",
            initial_stock: "",
            used_quantity: 0,
            damaged_quantity: 0,
            final_stock: 0,
        });
    }

    const removeProduct = (index) => {
        form.products.splice(index, 1);
    }

    const products = computed(() => usePage().props.products ?? []);

    const formattedProducts = computed(() => {
        return products.value.map(product => ({
            id: product.id,
            product_id: product.product_id?.[0]?.id,
            label: product.product_id?.[0]?.product_name ?? '-',
            stock: product.stock || 0,
            serial_barcode: product.serial_barcode
        }));
    }, { deep: true });

    const selectedBranchId = computed(() => form.branch_id?.id ?? form.branch_id?.[0]?.id ?? null);
    let previousBranchId = selectedBranchId.value;
    const toNumber = (value) => {
        const number = Number(value || 0);
        return Number.isFinite(number) ? number : 0;
    };
    const branchStockMap = computed(() => {
        return new Map((props.branchProductStocks ?? []).map(item => [
            `${item.branch_id}-${item.product_id}`,
            toNumber(item.stock)
        ]));
    });
    const branchStockFor = (product) => {
        const productId = product.product_id?.product_id;
        if (!selectedBranchId.value || !productId) return 0;
        return branchStockMap.value.get(`${selectedBranchId.value}-${productId}`) ?? 0;
    };
    const usedStockFor = (product) => branchStockFor(product)
        - toNumber(product.initial_stock)
        - toNumber(product.damaged_quantity);
    const finalStockFor = (product) => branchStockFor(product)
        - usedStockFor(product)
        - toNumber(product.damaged_quantity);
    const hasInvalidStock = (product) => usedStockFor(product) < 0;
    const syncStockReport = () => {
        form.products.forEach((product) => {
            product.used_quantity = usedStockFor(product);
            product.final_stock = finalStockFor(product);
        });
    };
    const resetProductStocks = (product, selectedProduct) => {
        product.product_id = selectedProduct;
        product.initial_stock = "";
        product.damaged_quantity = 0;
        syncStockReport();
    };

    watch(
        () => [
            selectedBranchId.value,
            form.products.map(product => product.product_id?.id).join(','),
            form.products.map(product => `${product.initial_stock}|${product.damaged_quantity}`).join(',')
        ],
        syncStockReport,
        { deep: true, immediate: true }
    );

    watch(selectedBranchId, (branchId) => {
        if (previousBranchId && previousBranchId !== branchId) {
            form.products = [];
        }
        previousBranchId = branchId;
    });
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
                    <div class="mt-2 grid grid-cols-1 gap-4 rounded-xl bg-white p-4 md:grid-cols-3">
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
                    <template v-if="selectedBranchId">
                    <h1 class="my-3 text-lg font-semibold text-blue-600 sm:text-xl">TAMBAH BARANG</h1>
                    <div class="rounded-xl bg-white p-3 sm:p-4">
                        <div v-if="form.products.length > 0" class="mb-4 space-y-4">
                            <RequestOrderProductCard
                                v-for="(product, index) in form.products"
                                :key="index"
                                :product="product"
                                :index="index"
                                :options="formattedProducts"
                                :branch-stock="branchStockFor(product)"
                                :used-stock="usedStockFor(product)"
                                :final-stock="finalStockFor(product)"
                                :invalid-stock="hasInvalidStock(product)"
                                :errors="form.errors"
                                @select="selected => resetProductStocks(product, selected)"
                                @remove="removeProduct(index)"
                            />
                        </div>
                        <div v-else class="mb-4 rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center">
                            <p class="font-medium text-slate-600">Belum ada barang</p>
                            <p class="mt-1 text-sm text-slate-500">Tambahkan barang untuk mulai membuat permintaan stok.</p>
                        </div>
                        <div v-if="selectedBranchId" class="flex justify-center">
                            <button @click="addProduct" type="button" class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto">
                                + Tambah Barang
                            </button>
                        </div>
                    </div>
                    </template>
                    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                        <Link :href="route('requestOrders.index')" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200">KEMBALI</Link>
                        <button type="submit" class="min-h-11 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300">SIMPAN</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
