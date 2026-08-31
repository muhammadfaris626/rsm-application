<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref } from 'vue';
    import { usePage, useForm, Head } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputLabel from '@/Components/InputLabel.vue';
    import InputError from '@/Components/InputError.vue';
    import TextInput from "@/Components/TextInput.vue";
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import VueMultiselect from "vue-multiselect";
    import Textarea from '@/Components/Textarea.vue';
    import { usePermission } from '@/Composables/permissions';
    import { useDebouncedTableSearch } from '@/Composables/useDebouncedTableSearch';
    defineProps(["fetchData", 'expenditures', 'branches']);
    const form = useForm({
        id: "",
        branch_id: "",
        product_id: "",
        quantity: "",
        serial_barcode: "",
        last_update: "",
        created_at: "",
        updated_at: "",
    });
    const { hasPermission } = usePermission();
    const search = useDebouncedTableSearch('branchProducts.index', usePage().props.search);

    const showModalCreate = ref(false);
    const showModalRead = ref(false);

    const closeModalRead = () => {
        showModalRead.value = false;
        form.reset();
        form.clearErrors();
    }

    const modalTambahData = () => { showModalCreate.value = true; }
    const modalLiatData = (data) => {
        showModalRead.value = true;
        form.id = data.id;
        form.branch_id = data.branch.branch_name;
        form.product_id = data.product.product_name;
        form.quantity = data.total_stock;
        form.serial_barcode = data.serial_barcode;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
</script>

<template>
    <Head title="Barang" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Barang Cabang</h1>
                        <p class="text-orange-100 mt-1">Kelola stok barang di setiap cabang</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.75 7.5h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V9.75a2.25 2.25 0 0 0-2.25-2.25Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="bg-white rounded-xl shadow-md p-4">
                <div class="w-full md:w-1/3">
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                        </div>
                        <input 
                            v-model="search" 
                            type="text" 
                            class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" 
                            placeholder="Cari cabang, barang, atau jumlah..."
                        >
                    </div>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow>
                            <TableHeaderCell>NO</TableHeaderCell>
                            <TableHeaderCell>CABANG</TableHeaderCell>
                            <TableHeaderCell>BARANG</TableHeaderCell>
                            <TableHeaderCell>JUMLAH BARANG</TableHeaderCell>
                            <TableHeaderCell>TANGGAL</TableHeaderCell>
                            <TableHeaderCell>AKSI</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in fetchData.data" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'" class="font-semibold text-gray-600">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'" class="font-semibold text-gray-900">{{ data.branch.branch_name }}</TableDataCell>
                            <TableDataCell :status="'record'" class="text-gray-700">{{ data.product.product_name }}</TableDataCell>
                            <TableDataCell :status="'record'">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                                    {{ data.total_stock }}
                                </span>
                            </TableDataCell>
                            <TableDataCell :status="'record'" class="text-gray-600">{{ data.latest_created_at }}</TableDataCell>
                            <TableDataCell :status="'action'">
                                <template v-if="hasPermission('branch-product: read')">
                                    <button 
                                        @click="modalLiatData(data)" 
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
            <!-- Modal Lihat Data  -->
            <Modal :show="showModalRead" @close="closeModalRead">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            TAMPILKAN BARANG
                        </h3>
                    </div>
                    <div class="py-2">
                        <div class="relative overflow-x-auto">
                            <table class="table-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.branch_id }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            BARANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.product_id }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            JUMLAH BARANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.quantity }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
