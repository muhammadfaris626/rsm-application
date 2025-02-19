<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch } from 'vue';
    import { usePage, useForm, router, Head, Link } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputError from '@/Components/InputError.vue';
    import TextInput from "@/Components/TextInput.vue";
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    defineProps(["fetchData", 'approvalTypes', 'userBranch']);
    const form = useForm({
        id: "",
        ro_number: "",
        branch_id: "",
        date: "",
        status: "",
        listData: "",
        log: "",
        approval: "",
        last_update: "",
        created_at: "",
        updated_at: ""
    });
    const { hasPermission } = usePermission();
    let search = ref(usePage().props.search), pageNumber = ref(1);
    let searchUrl = computed(() => {
        let url = new URL(route('requestOrders.index'));
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
            replace: true
        });
    });

    const showModalCreate = ref(false);
    const showModalRead = ref(false);
    const showModalUpdate = ref(false);
    const showModalDelete = ref(false);
    const showModalApproval = ref(false);

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
    const closeModalApproval = () => {
        showModalApproval.value = false;
        form.reset();
        form.clearErrors();
    }

    const modalTambahData = () => { showModalCreate.value = true; }
    const modalLiatData = (data) => {
        showModalRead.value = true;
        form.id = data.id;
        form.ro_number = data.ro_number;
        form.branch_id = data.branch_id;
        form.date = data.date;
        form.status = data.status;
        form.listData = data.listData;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
    const modalApproval = (data) => {
        showModalApproval.value = true;
        form.id = data.id;
        form.ro_number = data.ro_number;
        form.branch_id = data.branch_id;
        form.date = data.date;
        form.status = data.status;
        form.listData = data.listData;
        form.log = data.log;
        form.last_update = data.last_update;
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
        form.post(route('requestOrders.store'), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalCreate.value = false;
            }
        });
    }

    const approvedQuantityFilled = computed(() => {
        return form.listData.every((item) => item.approved_quantity !== '' && item.approved_quantity !== null);
    });
    const submitApproval = () => {
        if (!approvedQuantityFilled.value) {
            alert("Harap isi semua jumlah barang yang disetujui!");
            return;
        }
        form.put(route('approval', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalApproval.value = false;
            }
        });
    }
    const lihatData = (id) => {

    }
    const ubahData = () => {
        form.put(route('requestOrders.update', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalUpdate.value = false;
            }
        });
    }
    const hapusData = () => {
        form.delete(route('requestOrders.destroy', form.id), {
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
        return listData.reduce((accumulator, item) => {
            return accumulator + parseInt(item.total_price, 10); // Asumsikan total_price dalam string, jadi perlu dikonversi ke integer
        }, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }); // Menggunakan toLocaleString untuk memformat angka dengan pemisah ribuan
    };

    function formatRupiah(value) {
        return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const steps = [
        "Sedang diverifikasi",
        "Disetujui",
        "Pengiriman barang",
        "Tiba di lokasi",
        "Pengecekan barang",
        "Selesai"
    ];

    const page = usePage();
    const userRoles = page.props.auth.user.roles;
    const userBranchId = page.props.userBranch;
    const approvalOptions = computed(() => {
        const optionsMap = {
            "Sedang diverifikasi": ["Disetujui"],
            "Disetujui": ["Pengiriman barang"],
            "Pengiriman barang": ["Tiba di lokasi"],
            "Tiba di lokasi": ["Pengecekan barang"],
            "Pengecekan barang": ["Selesai"]
        };
        return optionsMap[form.status] || [];
    });
    const canViewSelect = computed(() => {
        const rootAdminStatuses = ["Sedang diverifikasi", "Disetujui"];
        const branchStatuses = ["Pengiriman barang", "Tiba di lokasi", "Pengecekan barang"];
        if (userRoles.includes("root") || userRoles.includes("admin-pusat")) {
            return rootAdminStatuses.includes(form.status);
        }
        if (userRoles.includes("admin-branch")) {
            return branchStatuses.includes(form.status) && userBranchId === form.branch_id[0].id;
        }
        return false;
    });
</script>

<template>
    <Head title="Permintaan Pesanan" />
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
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Permintaan Stok</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="flex justify-between my-3">
                <div class="w-full md:w-1/4">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500 dark:text-gray-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input v-model="search" type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pencarian...">
                    </div>
                </div>
                <div>
                    <template v-if="hasPermission('request-order: create')">
                        <Link :href="route('requestOrders.create')" class="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Data
                        </Link>
                    </template>
                </div>
            </div>
            <Table>
                <template #header>
                    <TableRow>
                        <TableHeaderCell>NO</TableHeaderCell>
                        <TableHeaderCell>NOMOR PERMINTAAN</TableHeaderCell>
                        <TableHeaderCell>CABANG</TableHeaderCell>
                        <TableHeaderCell>TANGGAL</TableHeaderCell>
                        <TableHeaderCell>STATUS</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                    </TableRow>
                </template>
                <template #default>
                    <TableRow v-for="(data, index) in fetchData.data" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <TableDataCell :status="'number'">{{ index+1 }}</TableDataCell>
                        <TableDataCell :status="'record'" class="font-bold">{{ data.ro_number }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ data.branch_id[0]['branch_name'] }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ formatTanggal(data.date) }}</TableDataCell>
                        <TableDataCell :status="'record'">
                            <button @click="modalApproval(data)" class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button">
                                {{ data.status }}
                            </button>
                        </TableDataCell>
                        <TableDataCell :status="'action'">
                            <!-- Lihat Data  -->
                            <template v-if="hasPermission('request-order: read')">
                                <button @click="modalLiatData(data)" class="text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                            </template>
                            <!-- Ubah Data  -->
                            <template v-if="hasPermission('request-order: update') && data.status =='Sedang diverifikasi'">
                                <Link :href="route('requestOrders.edit', data.id)" class="text-white mr-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Link>
                            </template>
                            <!-- Hapus Data  -->
                            <template v-if="hasPermission('request-order: delete')">
                                <button @click="modalHapusData(data)" type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </template>
                        </TableDataCell>
                    </TableRow>
                </template>
                <template #pagination>
                    <TablePagination :pagination="fetchData.meta" />
                </template>
            </Table>
            <!-- Modal Approval -->
            <Modal :show="showModalApproval" @close="closeModalApproval">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white text-center">
                            {{ form.ro_number }}
                        </h3>
                    </div>
                    <div class="py-2">
                        <div class="grid grid-cols-2">
                            <div class="px-5 relative overflow-x-auto">
                                <table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <tbody>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                NOMOR PERMINTAAN PESANAN
                                            </th>
                                            <td class="">
                                                : {{ form.ro_number }}
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
                                                : {{ form.branch_id[0]['branch_name'] }}
                                            </td>
                                        </tr>
                                        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                ATAS NAMA
                                            </th>
                                            <td class="">
                                                : {{ form.last_update.user.name }}
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
                                        <th v-if="userRoles[0] == 'root' || userRoles[0] == 'admin-pusat'" class="border border-gray-300">
                                            Stok
                                        </th>
                                        <th class="border border-gray-300">Permintaan Yang Disetujui</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(list, index) in form.listData" :key="list.id">
                                        <td class="border border-gray-300 py-1 px-2 text-center">{{ index + 1 }}</td>
                                        <td class="border border-gray-300 py-1 px-2">{{ list.center_stock.product.product_name }}</td>
                                        <td class="border border-gray-300 py-1 px-2 text-center">{{ list.quantity }}</td>
                                        <td v-if="userRoles[0] == 'root' || userRoles[0] == 'admin-pusat'" class="border border-gray-300 py-1 px-2 text-center">{{ list.center_stock.stock }}</td>
                                        <td class="border border-gray-300 py-1 px-2 text-center">
                                            <div v-if="userRoles[0] == 'root' || userRoles[0] == 'admin-pusat'">
                                                <template v-if="list.status !== 0">
                                                    {{ list.approved_quantity }}
                                                </template>
                                                <template v-else>
                                                    <TextInput
                                                        v-model="list.approved_quantity"
                                                        :model-value="list.approved_quantity || ''"
                                                        @update:model-value="value => list.approved_quantity = value"
                                                        type="text"
                                                        class="block w-full bg-white text-center"
                                                        placeholder="Jumlah Barang"
                                                    />
                                                </template>
                                            </div>
                                            <div v-else>
                                                {{ list.approved_quantity }}
                                            </div>
                                        </td>
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
            <!-- Modal Lihat Data  -->
            <Modal :show="showModalRead" @close="closeModalRead">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            TAMPILKAN PERMINTAAN PESANAN
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
                                            NOMOR PERMINTAAN PESANAN
                                        </th>
                                        <td class="px-6 py-4 font-bold">
                                            {{ form.ro_number }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.branch_id[0]['branch_name'] }}
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
                                            STATUS PESANAN
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
                                                        <td class="border border-gray-300 px-2">{{ list.center_stock.product.product_name }}</td>
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
                                            {{ form.last_update.user.name }}
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
            <!-- Modal Hapus Data  -->
            <Modal :show="showModalDelete" @close="closeModalDelete">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah anda yakin ingin menghapus permintaan pesanan ini ?
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
