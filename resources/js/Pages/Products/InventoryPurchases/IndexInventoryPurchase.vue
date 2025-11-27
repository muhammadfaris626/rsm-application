<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch } from 'vue';
    import { usePage, useForm, router, Head, Link } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputError from '@/Components/InputError.vue';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    const props = defineProps(["fetchData"]);
    const form = useForm({
        id: "",
        invoice_number: "",
        date: "",
        supplier_id: "",
        listData: "",
        last_update: "",
        created_at: "",
        updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    const showFilters = ref(false);
    
    let searchUrl = computed(() => {
        let url = new URL(route('inventoryPurchases.index'));
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
            replace: true,
            onSuccess: () => {
                pageNumber.value = 1;
            }
        });
    });
    
    const hasActiveFilters = computed(() => {
        return search.value;
    });
    
    const clearFilters = () => {
        search.value = '';
    };

    const showModalCreate = ref(false);
    const showModalRead = ref(false);
    const showModalUpdate = ref(false);
    const showModalDelete = ref(false);

    const closeModalCreate = () => {
        showModalCreate.value = false;
    }
    const closeModalRead = () => {
        showModalRead.value = false;
        form.reset();
        form.clearErrors();
    }
    const closeModalUpdate = () => {
        showModalUpdate.value = false;
        form.reset();
        form.clearErrors();
    }
    const closeModalDelete = () => {
        showModalDelete.value = false;
        form.reset();
        form.clearErrors();
    }

    const modalTambahData = () => { showModalCreate.value = true; }
    const modalLiatData = (data) => {
        showModalRead.value = true;
        form.id = data.id;
        form.invoice_number = data.invoice_number;
        form.date = data.date;
        form.supplier_id = data.supplier_id;
        form.listData = data.listData;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
    const modalUbahData = (data) => {
        showModalUpdate.value = true;
        form.id = data.id;
    }
    const modalHapusData = (data) => {
        showModalDelete.value = true;
        form.id = data.id;
    }

    const tambahData = () => {
        form.post(route('inventoryPurchases.store'), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalCreate.value = false;
            }
        });
    }
    const lihatData = (id) => {

    }
    const ubahData = () => {
        form.put(route('inventoryPurchases.update', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalUpdate.value = false;
            }
        });
    }
    const hapusData = () => {
        form.delete(route('inventoryPurchases.destroy', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalDelete.value = false;
            }
        });
    }
    const formatTanggal = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };
    const calculateTotalPrice = (listData) => {
        if (!listData || listData.length === 0) return 'Rp 0';
        return listData.reduce((accumulator, item) => {
            return accumulator + parseInt(item.total_price || 0, 10);
        }, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };
    
    const totalPembelian = computed(() => {
        return props.fetchData?.data?.length || 0;
    });
    
    const totalHarga = computed(() => {
        if (!props.fetchData?.data) return 0;
        return props.fetchData.data.reduce((sum, purchase) => {
            return sum + (purchase.listData?.reduce((s, item) => s + parseInt(item.total_price || 0), 0) || 0);
        }, 0);
    });
    
    const rataRataTransaksi = computed(() => {
        if (totalPembelian.value === 0) return 0;
        return totalHarga.value / totalPembelian.value;
    });

    function formatRupiah(value) {
        if (!value) return "Rp 0";
        return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
</script>

<template>
    <Head title="Pembelian Persediaan" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Data Pembelian Persediaan</h1>
                        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Kelola data pembelian persediaan produk</p>
                    </div>
                    <div>
                        <template v-if="hasPermission('inventory-purchase: create')">
                            <Link :href="route('inventoryPurchases.create')" class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Pembelian
                            </Link>
                        </template>
                    </div>
                </div>

                <!-- Filter & Search Section -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div class="flex flex-col gap-4">
                        <!-- Search & Filter Toggle Row -->
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Search -->
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pencarian</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div>
                                    <input v-model="search" type="text" 
                                           class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                           placeholder="Cari nomor faktur, tanggal, atau supplier...">
                                </div>
                            </div>
                            
                            <!-- Filter Toggle Button -->
                            <div class="flex items-end">
                                <button @click="showFilters = !showFilters" 
                                        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter
                                    <span v-if="hasActiveFilters" class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">1</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-medium mb-1">Total Pembelian</p>
                            <p class="text-3xl font-bold">{{ fetchData?.meta?.total || 0 }}</p>
                        </div>
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-blue-100 text-sm font-medium mb-1">Total Harga</p>
                            <p class="text-2xl font-bold">
                                {{ totalHarga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }}
                            </p>
                        </div>
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-purple-100 text-sm font-medium mb-1">Rata-rata per Transaksi</p>
                            <p class="text-2xl font-bold">
                                {{ rataRataTransaksi.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }}
                            </p>
                        </div>
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Data Table -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="overflow-x-auto -mx-4 sm:mx-0">
                    <div class="inline-block min-w-full align-middle">
                        <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700">
                            <tr>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold">NO</th>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold">NOMOR FAKTUR</th>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden sm:table-cell">TANGGAL</th>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden md:table-cell">SUPPLIER</th>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold">TOTAL HARGA</th>
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(data, index) in fetchData.data" :key="data.id" 
                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td class="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white">
                                    {{ (fetchData.meta.current_page - 1) * fetchData.meta.per_page + index + 1 }}
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4">
                                    <div class="flex flex-col">
                                        <Link :href="route('inventoryPurchases.show', data.id)" class="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                            {{ data.invoice_number }}
                                        </Link>
                                        <span class="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                                            {{ formatTanggal(data.date) }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {{ formatTanggal(data.date) }}
                                    </div>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                    <span>{{ data.supplier_id?.[0]?.['name'] || 'N/A' }}</span>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4">
                                    <span class="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base">
                                        {{ calculateTotalPrice(data.listData) }}
                                    </span>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4">
                                    <div class="flex items-center justify-center gap-1 sm:gap-2">
                                        <template v-if="hasPermission('inventory-purchase: read')">
                                            <button @click="modalLiatData(data)" 
                                                    class="p-1.5 sm:p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30" 
                                                    type="button"
                                                    title="Lihat Detail">
                                                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </button>
                                        </template>
                                        <template v-if="hasPermission('inventory-purchase: update')">
                                            <Link :href="route('inventoryPurchases.edit', data.id)" 
                                                  class="p-1.5 sm:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                  title="Edit">
                                                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </Link>
                                        </template>
                                        <template v-if="hasPermission('inventory-purchase: delete')">
                                            <button @click="modalHapusData(data)" 
                                                    type="button" 
                                                    class="p-1.5 sm:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                    title="Hapus">
                                                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!fetchData.data || fetchData.data.length === 0">
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p class="text-lg font-medium">Tidak ada data pembelian persediaan</p>
                                        <p class="text-sm">Mulai dengan menambahkan pembelian persediaan baru</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div v-if="fetchData.meta && fetchData.meta.last_page > 1" 
                     class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                            Menampilkan <span class="font-semibold">{{ fetchData.meta.from }}</span> sampai 
                            <span class="font-semibold">{{ fetchData.meta.to }}</span> dari 
                            <span class="font-semibold">{{ fetchData.meta.total }}</span> data
                        </div>
                        <div class="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                            <button @click="pageNumber = Math.max(1, fetchData.meta.current_page - 1)" 
                                    :disabled="fetchData.meta.current_page === 1"
                                    class="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                <span class="hidden sm:inline">Sebelumnya</span>
                                <span class="sm:hidden">‹</span>
                            </button>
                            <template v-for="page in Math.min(5, fetchData.meta.last_page)" :key="page">
                                <button @click="pageNumber = page"
                                        :class="[
                                            'px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg',
                                            page === fetchData.meta.current_page
                                                ? 'text-white bg-blue-600 hover:bg-blue-700'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                        ]">
                                    {{ page }}
                                </button>
                            </template>
                            <button @click="pageNumber = Math.min(fetchData.meta.last_page, fetchData.meta.current_page + 1)" 
                                    :disabled="fetchData.meta.current_page === fetchData.meta.last_page"
                                    class="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                <span class="hidden sm:inline">Selanjutnya</span>
                                <span class="sm:hidden">›</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Lihat Data  -->
            <Modal :show="showModalRead" @close="closeModalRead">
                    <div class="relative w-full max-w-5xl max-h-full bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold text-white">
                                    Detail Pembelian Persediaan
                                </h3>
                                <button @click="closeModalRead" class="text-white hover:text-gray-200 transition-colors">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="p-6 max-h-[70vh] overflow-y-auto">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">ID</label>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ form.id }}</p>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nomor Faktur</label>
                                    <p class="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">{{ form.invoice_number }}</p>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal</label>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ formatTanggal(form.date) }}</p>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Supplier</label>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ form.supplier_id?.[0]?.['name'] || 'N/A' }}</p>
                                </div>
                            </div>
                            
                            <div class="mb-6">
                                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daftar Barang</h4>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-700">
                                            <tr>
                                                <th scope="col" class="px-4 py-3">No</th>
                                                <th scope="col" class="px-4 py-3">Nama Barang</th>
                                                <th scope="col" class="px-4 py-3">Harga</th>
                                                <th scope="col" class="px-4 py-3 text-center">Jumlah</th>
                                                <th scope="col" class="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(list, index) in form.listData" :key="list.id" 
                                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ index + 1 }}</td>
                                                <td class="px-4 py-3">{{ list.product?.product_name || 'N/A' }}</td>
                                                <td class="px-4 py-3">{{ formatRupiah(list.price) }}</td>
                                                <td class="px-4 py-3 text-center">{{ list.quantity }}</td>
                                                <td class="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">{{ formatRupiah(list.total_price) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                <div class="flex items-center justify-between">
                                    <span class="text-lg font-semibold">Total Harga</span>
                                    <span class="text-2xl font-bold">{{ calculateTotalPrice(form.listData) }}</span>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Diubah Oleh</label>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ form.last_update?.user?.name || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal Dibuat</label>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ form.created_at || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal Diubah</label>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ form.updated_at || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <!-- Modal Hapus Data  -->
                <Modal :show="showModalDelete" @close="closeModalDelete">
                    <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Apakah anda yakin ingin menghapus persediaan pembelian ini ?
                            </h3>
                            <button @click="hapusData" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Ya, saya yakin
                            </button>
                            <button @click="closeModalDelete" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Tidak, batalkan
                            </button>
                        </div>
                    </div>
                </Modal>
        </div>
    </AuthenticatedLayout>
</template>
