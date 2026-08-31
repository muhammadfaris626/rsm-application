<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed } from 'vue';
    import { usePage, useForm, Head, Link } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputError from '@/Components/InputError.vue';
    import TextInput from "@/Components/TextInput.vue";
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    import { useDebouncedTableSearch } from '@/Composables/useDebouncedTableSearch';
    defineProps(["fetchData", 'userBranch']);
    const firstItem = (value) => Array.isArray(value) ? value[0] : value;
    const requestOrderNumber = (value) => firstItem(value)?.ro_number ?? '-';
    const branchName = (value) => firstItem(value)?.branch_name ?? '-';
    const lastUpdateName = (value) => value?.user?.name ?? '-';
    const form = useForm({
        id: "",
        request_order_id: "",
        branch_id: "",
        request_number: "",
        date: "",
        status: "",
        listData: "",
        log: "",
        last_update: "",
        created_at: "",
        updated_at: "",
        approval: ""
    });
    const { hasPermission } = usePermission();
    const search = useDebouncedTableSearch('requestReturns.index', usePage().props.search);

    const formatTanggal = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const showModalRead = ref(false);
    const showModalDelete = ref(false);
    const showModalApproval = ref(false);

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
    const closeModalApproval = () => {
        showModalApproval.value = false;
        form.reset();
        form.clearErrors();
    }

    const modalRead = (data) => {
        showModalRead.value = true;
        form.id = data.id;
        form.request_order_id = data.request_order_id;
        form.branch_id = data.branch_id;
        form.request_number = data.request_number;
        form.date = data.date;
        form.status = data.status;
        form.listData = data.listData;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
    const modalDelete = (data) => {
        showModalDelete.value = true;
        form.id = data.id;
    }
    const modalApproval = (data) => {
        showModalApproval.value = true;
        form.id = data.id;
        form.request_order_id = data.request_order_id;
        form.request_number = data.request_number;
        form.branch_id = data.branch_id;
        form.date = data.date;
        form.status = data.status;
        form.listData = data.listData;
        form.log = data.log;
        form.last_update = data.last_update;
    }

    const steps = [
        "Sedang diverifikasi",
        "Pengiriman barang",
        "Tiba di lokasi",
        "Pengecekan barang",
        "Selesai"
    ];

    const page = usePage();
    const userRoles = page.props.auth.user.roles;
    const userBranchId = page.props.userBranch;
    const isCentralUser = computed(() => userRoles.includes("root") || userRoles.includes("admin-pusat"));
    const approvalOptions = computed(() => {
        const optionsMap = {
            "Sedang diverifikasi": ["Pengiriman barang"],
            "Pengiriman barang": ["Tiba di lokasi"],
            "Tiba di lokasi": ["Pengecekan barang"],
            "Pengecekan barang": ["Selesai"]
        };
        return optionsMap[form.status] || [];
    });

    const canViewSelect = computed(() => {
        const rootAdminStatuses = ["Tiba di lokasi", "Pengecekan barang", 'Pengiriman barang'];
        const branchStatuses = ['Sedang diverifikasi'];
        if (isCentralUser.value) {
            return rootAdminStatuses.includes(form.status);
        }
        if (userRoles.includes("admin-branch")) {
            return branchStatuses.includes(form.status) && userBranchId === firstItem(form.branch_id)?.id;
        }
        return false;
    });

    const submitApproval = () => {
        form.put(route('approvalReturn', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalApproval.value = false;
            }
        });
    }

    const hapusData = () => {
        form.delete(route('requestReturns.destroy', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalDelete.value = false;
            }
        });
    }

</script>

<template>
    <Head title="Permintaan Return" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Permintaan Return</h1>
                        <p class="text-purple-100 mt-1">Kelola permintaan return dari berbagai cabang</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input 
                                v-model="search" 
                                type="text" 
                                class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" 
                                placeholder="Cari nomor return, cabang, atau status..."
                            >
                        </div>
                    </div>
                    <div>
                        <template v-if="hasPermission('request-return: create')">
                            <Link 
                                :href="route('requestReturns.create')" 
                                class="px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
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
            <!-- Table Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow>
                            <TableHeaderCell>NO</TableHeaderCell>
                            <TableHeaderCell>NOMOR RO</TableHeaderCell>
                            <TableHeaderCell>NOMOR RETURN</TableHeaderCell>
                            <TableHeaderCell>CABANG</TableHeaderCell>
                            <TableHeaderCell>TANGGAL</TableHeaderCell>
                            <TableHeaderCell>STATUS</TableHeaderCell>
                            <TableHeaderCell>AKSI</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in fetchData.data" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'" class="font-semibold text-gray-600">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'" class="font-bold text-gray-900">{{ requestOrderNumber(data.request_order_id) }}</TableDataCell>
                            <TableDataCell :status="'record'" class="font-bold text-purple-700">{{ data.request_number }}</TableDataCell>
                            <TableDataCell :status="'record'" class="text-gray-700">{{ branchName(data.branch_id) }}</TableDataCell>
                            <TableDataCell :status="'record'" class="text-gray-600">{{ formatTanggal(data.date) }}</TableDataCell>
                            <TableDataCell :status="'record'">
                                <button 
                                    @click="modalApproval(data)" 
                                    class="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105" 
                                    type="button"
                                >
                                    {{ data.status }}
                                </button>
                            </TableDataCell>
                            <TableDataCell :status="'action'">
                                <div class="flex items-center gap-2">
                                    <!-- Lihat Data  -->
                                    <template v-if="hasPermission('request-return: read')">
                                        <button 
                                            @click="modalRead(data)" 
                                            class="text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110" 
                                            type="button"
                                            title="Lihat Detail"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </button>
                                    </template>
                                    <!-- Ubah Data  -->
                                    <template v-if="hasPermission('request-return: update') && data.status === 'Sedang diverifikasi'">
                                        <Link
                                            :href="route('requestReturns.edit', data.id)"
                                            class="text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                                            title="Ubah"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                            </svg>
                                        </Link>
                                    </template>
                                    <!-- Hapus Data  -->
                                    <template v-if="hasPermission('request-return: delete') && data.status === 'Sedang diverifikasi'">
                                        <button 
                                            @click="modalDelete(data)" 
                                            type="button" 
                                            class="text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                                            title="Hapus"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </template>
                                </div>
                            </TableDataCell>
                        </TableRow>
                    </template>
                    <template #pagination>
                        <div class="bg-gray-50 px-4 py-3">
                            <TablePagination :pagination="fetchData.meta" />
                        </div>
                    </template>
                </Table>
            </div>
            <!-- Modal Read -->
            <Modal :show="showModalRead" @close="closeModalRead">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            TAMPILKAN PERMINTAAN RETURN
                        </h3>
                    </div>
                    <div class="py-2">
                        <div class="relative overflow-x-auto">
                            <table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            ID
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.id }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            NOMOR RO
                                        </th>
                                        <td class="px-6 py-4 font-bold">
                                            {{ requestOrderNumber(form.request_order_id) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            NOMOR RETURN
                                        </th>
                                        <td class="px-6 py-4 font-bold">
                                            {{ form.request_number }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            CABANG
                                        </th>
                                        <td class="px-6 py-4 font-bold">
                                            {{ branchName(form.branch_id) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            TANGGAL
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ formatTanggal(form.date) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            STATUS
                                        </th>
                                        <td class="px-6 py-4">
                                            <p class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button">
                                                {{ form.status }}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            BARANG
                                        </th>
                                        <td class="px-6 py-4">
                                            <table class="border-collapse border border-gray-400">
                                                <thead>
                                                    <tr>
                                                        <th class="border border-gray-300 px-2">No</th>
                                                        <th class="border border-gray-300 px-2">Nama Barang</th>
                                                        <th class="border border-gray-300 px-2">Jumlah Barang</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(list, index) in form.listData" :key="list.id">
                                                        <td class="border border-gray-300 px-2 text-center">{{ index + 1 }}</td>
                                                        <td class="border border-gray-300 px-2">{{ list.branch_product.product.product_name }}</td>
                                                        <td class="border border-gray-300 px-2 text-center">{{ list.quantity }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            DIUBAH OLEH
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ lastUpdateName(form.last_update) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            TANGGAL DIBUAT
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.created_at }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            TANGGAL DIUBAH
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.updated_at }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
            <!-- Modal Approval -->
            <Modal :show="showModalApproval" @close="closeModalApproval">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white text-center">
                            {{ form.request_number }}
                        </h3>
                    </div>
                    <div class="py-2">
                        <div class="grid grid-cols-2">
                            <div class="px-5 relative overflow-x-auto">
                                <table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <tbody>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                NOMOR RO
                                            </th>
                                            <td class="">
                                                : {{ requestOrderNumber(form.request_order_id) }}
                                            </td>
                                        </tr>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                TANGGAL PERMINTAAN
                                            </th>
                                            <td class="">
                                                : {{ formatTanggal(form.date) }}
                                            </td>
                                        </tr>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                PERMINTAAN DARI
                                            </th>
                                            <td class="">
                                                : {{ branchName(form.branch_id) }}
                                            </td>
                                        </tr>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                ATAS NAMA
                                            </th>
                                            <td class="">
                                                : {{ lastUpdateName(form.last_update) }}
                                            </td>
                                        </tr>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                STATUS PERMINTAAN
                                            </th>
                                            <td class="">
                                                : <p class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                    {{ form.status }}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center dark:border-gray-600">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white text-center">
                            BARANG
                        </h3>
                    </div>
                    <div class="grid grid-cols-1 py-4 px-5">
                        <div class="table-fixed">
                            <table class="border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr>
                                        <th class="border border-gray-300">No</th>
                                        <th class="border border-gray-300">Nama Barang</th>
                                        <th class="border border-gray-300">Jumlah Barang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(list, index) in form.listData" :key="list.id">
                                        <td class="border border-gray-300 py-1 px-2 text-center">{{ index + 1 }}</td>
                                        <td class="border border-gray-300 py-1 px-2">{{ list.branch_product.product.product_name }}</td>
                                        <td class="border border-gray-300 py-1 px-2 text-center">{{ list.quantity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="flex items-center justify-center dark:border-gray-600">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white text-center">
                            PROSES PERMINTAAN
                        </h3>
                    </div>
                    <div class="pb-14 grid grid-cols-1">
                        <div class="mx-4 p-4">
                            <div class="flex items-center">
                                <template v-for="(step, index) in steps" :key="index">
                                    <div
                                        class="flex items-center relative"
                                        :class="{
                                            'text-gray-500': index + 1 > form.log.length + 1,
                                            'text-white bg-blue-500 rounded-full border-blue-500': index + 1 === form.log.length + 1,
                                            'text-blue-500': index + 1 < form.log.length + 1
                                        }"
                                    >
                                        <div
                                            class="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 flex items-center justify-center font-bold text-xl"
                                            :class="{
                                                'border-2 border-gray-300': index + 1 > form.log.length + 1,
                                                'border-2 border-blue-500': index + 1 === form.log.length + 1,
                                                'border-4 border-blue-500': index + 1 < form.log.length + 1
                                            }"
                                        >
                                            <span v-if="index + 1 <= form.log.length">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </span>
                                            <span v-else>{{ index + 1 }}</span>
                                        </div>
                                        <div
                                            class="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase"
                                            :class="{
                                                'text-gray-500': index + 1 > form.log.length + 1,
                                                'text-blue-500': index + 1 <= form.log.length + 1,
                                            }"
                                        >
                                            {{ step }}
                                        </div>
                                    </div>
                                    <div
                                        v-if="index < steps.length - 1"
                                        class="flex-auto transition duration-500 ease-in-out"
                                        :class="{
                                            'border-t-2 border-gray-300': index + 1 >= form.log.length + 1,
                                            'border-t-4 border-blue-500': index + 1 < form.log.length + 1
                                        }"
                                    >
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-if="canViewSelect" class="flex items-center justify-center dark:border-gray-600">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white text-center">
                            PERSETUJUAN
                        </h3>
                    </div>
                    <div v-if="canViewSelect" class="grid grid-cols-3 gap-4 pb-5">
                        <div class="col-start-2">
                            <form @submit.prevent="submitApproval" class="max-w-sm mx-auto">
                                <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <select v-model="form.approval" id="approval-select"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="" selected disabled>Pilih</option>
                                        <option v-for="option in approvalOptions" :key="option" :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                    <InputError class="mt-2" :message="form.errors.approval" />
                                </div>
                                <div>
                                    <button type="submit" class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        SIMPAN
                                    </button>
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
            <!-- Modal Delete -->
            <Modal :show="showModalDelete" @close="closeModalDelete">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah anda yakin ingin menghapus permintaan return ini ?
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
