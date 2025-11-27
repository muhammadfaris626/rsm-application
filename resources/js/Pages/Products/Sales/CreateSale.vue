<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import VueMultiselect from "vue-multiselect";

    const props = defineProps({
        invoice: {
            type: String
        },
        branches: {
            type: Array
        },
        products: {
            type: Array
        },
        employees: {
            type: Array
        }
    });

    const form = useForm({
        branch_id: "",
        invoice_number: props.invoice,
        date: "",
        management_structure_id: "",
        products: []
    });

    const addProduct = () => {
        form.products.push({
            branch_product_id: "",
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
    
    const products = computed(() => usePage().props.products ?? []);
    const formattedProducts = computed(() => {
        return products.value.map(product => ({
            id: product.id,
            label: `${product.product_id?.[0].product_name}`,
            stock: product.quantity || 0,
            serial_barcode: product.serial_barcode,
            tanggal: product.created_at
        }));
    }, { deep: true });

    const formatTeknisi = computed(() => usePage().props.employees.map(
        employee => ({
            ...employee,
            label: `${employee.employee_id[0]?.name}`
        })
    ));
    
    const totalPrice = computed(() => {
        return form.products.reduce((sum, product) => {
            return sum + (parseInt(product.total_price || 0));
        }, 0);
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
                    decimal: ',',
                    separator: '.',
                    precision: 2,
                    masked: false,
                },
            }
        },
    }
</script>

<template>
    <Head title="Tambah Penjualan" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div>
                <nav class="flex mb-4" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2">
                        <li class="inline-flex items-center">
                            <Link :href="route('dashboard')" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                                Produk
                            </Link>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 6 10">
                                    <path d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link :href="route('sales.index')" class="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">Data Penjualan</Link>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 6 10">
                                    <path d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Tambah Penjualan</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tambah Penjualan</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Formulir untuk menambahkan data penjualan baru</p>
            </div>

            <form @submit.prevent="form.post(route('sales.store'))">
                <!-- Informasi Penjualan -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        Informasi Penjualan
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <InputLabel for="invoice_number" value="Nomor Faktur" />
                            <TextInput
                                id="invoice_number"
                                type="text"
                                class="mt-1 block w-full bg-gray-100 dark:bg-gray-700"
                                v-model="form.invoice_number"
                                disabled
                            />
                            <InputError class="mt-2" :message="form.errors.invoice_number" />
                        </div>
                        <div>
                            <InputLabel for="branch_id" value="Cabang *" />
                            <VueMultiselect
                                v-model="form.branch_id"
                                :options="props.branches"
                                :close-on-select="true"
                                placeholder="Pilih Cabang"
                                label="branch_name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.branch_id" />
                        </div>
                        <div>
                            <InputLabel for="date" value="Tanggal *" />
                            <TextInput
                                id="date"
                                type="date"
                                class="mt-1 block w-full"
                                v-model="form.date"
                            />
                            <InputError class="mt-2" :message="form.errors.date" />
                        </div>
                        <div>
                            <InputLabel for="management_structure_id" value="Teknisi *" />
                            <VueMultiselect
                                v-model="form.management_structure_id"
                                :options="formatTeknisi"
                                :close-on-select="true"
                                placeholder="Pilih Teknisi"
                                label="label"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.management_structure_id" />
                        </div>
                    </div>
                </div>

                <!-- Daftar Barang -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <div class="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            Daftar Barang
                        </h2>
                        <button @click="addProduct" type="button" 
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Barang
                        </button>
                    </div>

                    <div v-if="form.products.length > 0" class="space-y-4">
                        <div v-for="(product, index) in form.products" :key="index" 
                             class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div class="flex items-start gap-4">
                                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">{{ index + 1 }}</span>
                                </div>
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div class="md:col-span-2">
                                        <InputLabel :for="'product_' + index" value="Barang *" />
                                        <VueMultiselect
                                            v-model="product.branch_product_id"
                                            :options="formattedProducts"
                                            :close-on-select="true"
                                            placeholder="Pilih Barang"
                                            label="label"
                                            track-by="id"
                                        />
                                        <InputError class="mt-2" :message="form.errors['products.' + index + '.branch_product_id']" />
                                        <div v-if="product.branch_product_id?.stock != null" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span class="inline-flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Stok: <span class="font-semibold">{{ product.branch_product_id.stock }}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel :for="'price_' + index" value="Harga *" />
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
                                        <InputLabel :for="'quantity_' + index" value="Jumlah *" />
                                        <TextInput
                                            :id="'quantity_' + index"
                                            type="number"
                                            class="block w-full"
                                            placeholder="Jumlah"
                                            v-model="product.quantity"
                                            min="1"
                                        />
                                        <InputError class="mt-2" :message="form.errors['products.' + index + '.quantity']" />
                                    </div>
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="mb-2">
                                        <InputLabel :for="'total_' + index" value="Total" />
                                        <vue-number
                                            prefix="Rp "
                                            class="bg-gray-100 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:text-white font-semibold"
                                            v-model="product.total_price"
                                            :id="'total_' + index"
                                            v-bind="number"
                                            disabled />
                                    </div>
                                    <button @click="removeProduct(index)" 
                                            type="button"
                                            class="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-400">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p>Belum ada barang yang ditambahkan</p>
                        <p class="text-sm">Klik tombol "Tambah Barang" untuk menambahkan</p>
                    </div>
                </div>

                <!-- Total Summary -->
                <div v-if="form.products.length > 0" class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border border-green-200 dark:border-green-800 p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Total Harga</p>
                                <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {{ totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Jumlah Item</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ form.products.length }}</p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-3">
                    <Link :href="route('sales.index')" 
                          class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        Batal
                    </Link>
                    <button type="submit" 
                            class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800">
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Simpan Penjualan
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </AuthenticatedLayout>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
