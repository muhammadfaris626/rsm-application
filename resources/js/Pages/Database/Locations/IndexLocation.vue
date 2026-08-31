<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, onBeforeUnmount, onMounted, watch } from 'vue';
    import { Head, Link, useForm } from '@inertiajs/vue3';
    import axios from "axios";
    import Modal from '@/Components/Modal.vue';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import ApiTablePagination from '@/Components/Custom/ApiTablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    const { hasPermission } = usePermission();

    const form = useForm({
        id: ""
    });

    const search = ref("");
    const locations = ref([]);
    const paginationMeta = ref({});
    const currentPage = ref(1);
    let searchTimer;
    let requestSequence = 0;

    // Fetch Data Location
    const fetchLocations = async () => {
        const currentRequest = ++requestSequence;

        try {
            const { data } = await axios.get(`/api/locations`, {
                params: {
                    page: currentPage.value,
                    search: search.value
                }
            });

            if (currentRequest !== requestSequence) return;

            locations.value = data.data.data; // Data utama
            paginationMeta.value = data.data.meta; // Simpan meta pagination
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    watch(search, () => {
        clearTimeout(searchTimer);
        currentPage.value = 1;
        searchTimer = setTimeout(fetchLocations, 350);
    });

    // Panggil fetch saat komponen dimount
    onMounted(fetchLocations);
    onBeforeUnmount(() => clearTimeout(searchTimer));

    // Fungsi untuk mengganti halaman
    const changePage = (page) => {
        if (page !== currentPage.value) {
            currentPage.value = page; // Ubah nomor halaman
            fetchLocations();
        }
    };

    const showModalDelete = ref(false);

    const closeModalDelete = () => {
        showModalDelete.value = false;
    }

    const modalHapusData = (data) => {
        showModalDelete.value = true;
        form.id = data.id;
    }

    const hapusData = () => {
        form.delete(route('locations.destroy', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalDelete.value = false;
                fetchLocations();
            }
        });
    }
</script>

<template>
    <Head title="Lokasi" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Lokasi</h1>
                        <p class="text-teal-100 mt-1">Kelola koordinat dan lokasi cabang</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input 
                                v-model="search" 
                                type="text" 
                                class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" 
                                placeholder="Cari nama cabang atau koordinat..."
                            >
                        </div>
                    </div>
                    <div>
                        <template v-if="hasPermission('location: create')">
                            <Link 
                                :href="route('locations.create')" 
                                class="px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
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
                        <TableRow class="bg-teal-500">
                            <TableHeaderCell class="text-white">NO</TableHeaderCell>
                            <TableHeaderCell class="text-white">NAMA CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">KORDINAT</TableHeaderCell>
                            <TableHeaderCell class="text-white">AKSI</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in locations" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch?.name ?? '-' }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.coordinates }}</TableDataCell>
                            <TableDataCell :status="'action'">
                                <template v-if="hasPermission('location: delete')">
                                    <button 
                                        @click="modalHapusData(data)" 
                                        type="button" 
                                        class="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md transform transition-all duration-200 hover:scale-105"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
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
            <Modal :show="showModalDelete" @close="closeModalDelete">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah anda yakin ingin menghapus lokasi ini ?
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
