<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch } from 'vue';
    import { usePage, useForm, Head, Link } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputError from '@/Components/InputError.vue';
    import TextInput from '@/Components/TextInput.vue';
    import VueMultiselect from "vue-multiselect";
    import { usePermission } from '@/Composables/permissions';
    import { useDebouncedTableFilters } from '@/Composables/useDebouncedTableSearch';
    
    const props = defineProps(["fetchData", "branches", "technicians", "selectedBranch", "selectedStartDate", "selectedEndDate", "selectedTechnician"]);
    
    const form = useForm({
        id: "",
        invoice_number: "",
        date: "",
        management_structure_id: "",
        listData: "",
        last_update: "",
        created_at: "",
        updated_at: ""
    });
    
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search || '');
    let pageNumber = ref(1);
    let selectBranch = ref(props.selectedBranch ? { id: props.selectedBranch } : null);
    let selectStartDate = ref(props.selectedStartDate || '');
    let selectEndDate = ref(props.selectedEndDate || '');
    let selectTechnician = ref(props.selectedTechnician ? { id: props.selectedTechnician } : null);
    let showFilters = ref(false);
    
    useDebouncedTableFilters(
        'sales.index',
        [search, pageNumber, selectBranch, selectStartDate, selectEndDate, selectTechnician],
        () => ({
            page: pageNumber.value,
            search: search.value,
            branch: selectBranch.value?.id,
            start_date: selectStartDate.value,
            end_date: selectEndDate.value,
            technician: selectTechnician.value?.id,
        }),
        [
            'fetchData',
            'search',
            'selectedBranch',
            'selectedStartDate',
            'selectedEndDate',
            'selectedTechnician',
        ],
    );
    
    watch(() => usePage().props.fetchData?.meta?.current_page, (newPage) => {
        if (newPage) {
            pageNumber.value = newPage;
        }
    });

    watch([search, selectBranch, selectStartDate, selectEndDate, selectTechnician], () => {
        pageNumber.value = 1;
    });
    
    const clearFilters = () => {
        selectBranch.value = null;
        selectStartDate.value = '';
        selectEndDate.value = '';
        selectTechnician.value = null;
        search.value = '';
        pageNumber.value = 1;
    };
    
    const showModalRead = ref(false);
    const showModalDelete = ref(false);
    
    const closeModalRead = () => {
        showModalRead.value = false;
        form.reset();
        form.clearErrors();
    }
    
    const closeModalDelete = () => {
        showModalDelete.value = false;
        form.reset();
        form.clearErrors();
    }
    
    const modalLiatData = (data) => {
        showModalRead.value = true;
        form.id = data.id;
        form.invoice_number = data.invoice_number;
        form.date = data.date;
        form.management_structure_id = data.management_structure_id;
        form.listData = data.listData;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
    
    const modalHapusData = (data) => {
        showModalDelete.value = true;
        form.id = data.id;
    }
    
    const hapusData = () => {
        form.delete(route("sales.destroy", form.id), {
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
    
    function formatRupiah(value) {
        if (!value) return 'Rp 0';
        return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const hasActiveFilters = computed(() => {
        return selectBranch.value || selectStartDate.value || selectEndDate.value || selectTechnician.value;
    });
</script>

<template>
    <Head title="Penjualan" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex flex-col gap-4">
                <div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Data Penjualan</h1>
                            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Kelola data penjualan produk</p>
                        </div>
                        <div>
                            <template v-if="hasPermission('sale: create')">
                                <Link :href="route('sales.create')" class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 dark:focus:ring-blue-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span class="hidden sm:inline">Tambah Penjualan</span>
                                    <span class="sm:hidden">Tambah</span>
                                </Link>
                            </template>
                        </div>
                    </div>
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
                                       placeholder="Cari nomor faktur, tanggal, atau teknisi...">
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
                                <span v-if="hasActiveFilters" class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">{{ 
                                    [selectBranch, selectStartDate, selectEndDate, selectTechnician].filter(f => f).length 
                                }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Advanced Filters -->
                    <div v-show="showFilters" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex flex-wrap gap-4">
                            <!-- Branch Filter -->
                            <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Cabang</label>
                                <div class="flex-shrink-0">
                                    <VueMultiselect
                                        v-model="selectBranch"
                                        :options="branches"
                                        :close-on-select="true"
                                        placeholder="Semua Cabang"
                                        label="branch_name"
                                        track-by="id"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                            
                            <!-- Start Date Filter -->
                            <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Dari Tanggal</label>
                                <div class="flex-shrink-0">
                                    <TextInput
                                        id="startDate"
                                        type="date"
                                        class="block w-full"
                                        v-model="selectStartDate"
                                    />
                                </div>
                            </div>
                            
                            <!-- End Date Filter -->
                            <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Sampai Tanggal</label>
                                <div class="flex-shrink-0">
                                    <TextInput
                                        id="endDate"
                                        type="date"
                                        class="block w-full"
                                        v-model="selectEndDate"
                                    />
                                </div>
                            </div>
                            
                            <!-- Technician Filter -->
                            <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Teknisi</label>
                                <div class="flex-shrink-0">
                                    <VueMultiselect
                                        v-model="selectTechnician"
                                        :options="technicians"
                                        :close-on-select="true"
                                        placeholder="Semua Teknisi"
                                        label="label"
                                        track-by="id"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <!-- Clear Filters Button -->
                        <div v-if="hasActiveFilters" class="mt-4 flex justify-end">
                            <button @click="clearFilters" 
                                    class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Hapus Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-medium mb-1">Total Penjualan</p>
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
                            <p class="text-blue-100 text-sm font-medium mb-1">Total Omzet</p>
                            <p class="text-2xl font-bold">
                                {{ fetchData?.data?.reduce((sum, sale) => sum + (sale.listData?.reduce((s, item) => s + parseInt(item.total_price || 0), 0) || 0), 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) || 'Rp 0' }}
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
                                {{ fetchData?.data?.length > 0 ? (fetchData.data.reduce((sum, sale) => sum + (sale.listData?.reduce((s, item) => s + parseInt(item.total_price || 0), 0) || 0), 0) / fetchData.data.length).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) : 'Rp 0' }}
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
                                <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 font-semibold hidden md:table-cell">TEKNISI</th>
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
                                        <span class="font-bold text-blue-600 dark:text-blue-400">{{ data.invoice_number }}</span>
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
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                {{ data.management_structure_id?.[0]?.employee_id?.[0]?.name?.charAt(0) || 'T' }}
                                            </span>
                                        </div>
                                        <span>{{ data.management_structure_id?.[0]?.employee_id?.[0]?.name || 'N/A' }}</span>
                                    </div>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4">
                                    <span class="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base">
                                        {{ calculateTotalPrice(data.listData) }}
                                    </span>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-4">
                                    <div class="flex items-center justify-center gap-1 sm:gap-2">
                                        <template v-if="hasPermission('sale: read')">
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
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!fetchData.data || fetchData.data.length === 0">
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p class="text-lg font-medium">Tidak ada data penjualan</p>
                                        <p class="text-sm">Mulai dengan menambahkan penjualan baru</p>
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

            <!-- Modal Lihat Data -->
            <Modal :show="showModalRead" @close="closeModalRead">
                <div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden">
                    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
                        <h3 class="text-xl font-bold text-white">
                            Detail Penjualan
                        </h3>
                        <button @click="closeModalRead" class="text-white hover:text-gray-200 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div class="space-y-6">
                            <!-- Invoice Info -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Nomor Faktur</p>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ form.invoice_number }}</p>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tanggal</p>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatTanggal(form.date) }}</p>
                                </div>
                            </div>
                            
                            <!-- Technician Info -->
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Teknisi</p>
                                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ form.management_structure_id?.[0]?.employee_id?.[0]?.name || 'N/A' }}
                                </p>
                            </div>
                            
                            <!-- Products List -->
                            <div>
                                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Daftar Barang</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr class="bg-blue-50 dark:bg-blue-900/20">
                                                <th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">No</th>
                                                <th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">Nama Barang</th>
                                                <th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right">Harga</th>
                                                <th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-center">Jumlah</th>
                                                <th class="px-4 py-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(list, index) in form.listData" :key="list.id" 
                                                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-center">{{ index + 1 }}</td>
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700">
                                                    {{ list.branch_product?.product?.product_name || 'N/A' }}
                                                </td>
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right">
                                                    {{ formatRupiah(list.price) }}
                                                </td>
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-center">
                                                    {{ list.quantity }}
                                                </td>
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-semibold">
                                                    {{ formatRupiah(list.total_price) }}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr class="bg-green-50 dark:bg-green-900/20">
                                                <td colspan="4" class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-gray-900 dark:text-white">
                                                    TOTAL HARGA
                                                </td>
                                                <td class="px-4 py-3 border border-gray-200 dark:border-gray-700 text-right font-bold text-green-600 dark:text-green-400 text-lg">
                                                    {{ calculateTotalPrice(form.listData) }}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Metadata -->
                            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Dibuat</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ form.created_at }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Diubah oleh</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                                        {{ form.last_update?.user?.name || 'N/A' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <!-- Modal Hapus Data -->
            <Modal :show="showModalDelete" @close="closeModalDelete">
                <div class="relative w-full max-w-md bg-white rounded-xl shadow-xl dark:bg-gray-800">
                    <div class="p-6 text-center">
                        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                            <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Konfirmasi Hapus
                        </h3>
                        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div class="flex items-center justify-center gap-3">
                            <button @click="closeModalDelete" 
                                    class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                Batal
                            </button>
                            <button @click="hapusData" 
                                    class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </AuthenticatedLayout>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
