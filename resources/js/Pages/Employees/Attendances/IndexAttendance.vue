<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, onMounted, watch } from 'vue';
    import { Head, Link } from '@inertiajs/vue3';
    import axios from "axios";
    import Modal from '@/Components/Modal.vue';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import ApiTablePagination from '@/Components/Custom/ApiTablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    const { hasPermission } = usePermission();
    const firstItem = (value) => Array.isArray(value) ? value[0] : value;
    const branchName = (value) => firstItem(value)?.branch_name ?? '-';

    const search = ref("");
    const fetchData = ref([]);
    const paginationMeta = ref({});
    const currentPage = ref(1);

    // Fetch Data
    const fetch = async () => {
        try {
            const { data } = await axios.get(`/api/employee-attendances`, {
                params: {
                    page: currentPage.value,
                    search: search.value
                }
            });
            fetchData.value = data.data.data;
            paginationMeta.value = data.data.meta;
        } catch (error) {
            console.error("Gagal mengambil data : ", error);
        }
    }

    watch(currentPage, fetch);
    watch(search, () => {
        currentPage.value = 1;
        fetch();
    });
    onMounted(fetch);
    const changePage = (page) => {
        if (page !== currentPage.value) {
            currentPage.value = page;
        }
    };


</script>

<template>
    <Head title="Absensi" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Absensi</h1>
                        <p class="text-sky-100 mt-1">Kelola data kehadiran karyawan</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search and Action Bar -->
            <div class="bg-white rounded-xl shadow-md p-4">
                <div class="flex flex-col md:flex-row justify-between gap-4">
                    <div class="w-full md:w-1/3">
                        <div class="relative group">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input 
                                v-model="search" 
                                type="text" 
                                class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" 
                                placeholder="Cari nomor karyawan, nama, atau cabang..."
                            >
                        </div>
                    </div>
                    <div>
                        <template v-if="hasPermission('attendance: create')">
                            <Link 
                                :href="route('attendances.create')" 
                                class="px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Data
                            </Link>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow class="bg-sky-500">
                            <TableHeaderCell class="text-white">NO</TableHeaderCell>
                            <TableHeaderCell class="text-white">NOMOR KARYAWAN</TableHeaderCell>
                            <TableHeaderCell class="text-white">NAMA</TableHeaderCell>
                            <TableHeaderCell class="text-white">CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">AKSI</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in fetchData" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'">{{ index + 1 + (paginationMeta.per_page * (paginationMeta.current_page - 1)) }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.employee_number }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.name }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ branchName(data.branch_id) }}</TableDataCell>
                            <TableDataCell :status="'action'">
                                <template v-if="hasPermission('attendance: read')">
                                    <Link 
                                        :href="route('attendances.show', data.id)" 
                                        class="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md transform transition-all duration-200 hover:scale-105"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </Link>
                                </template>
                            </TableDataCell>
                        </TableRow>
                    </template>
                    <template #pagination>
                        <div class="bg-gray-50 px-4 py-3">
                            <ApiTablePagination
                                :pagination="paginationMeta"
                                @page-change="changePage"
                            />
                        </div>
                    </template>
                </Table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
