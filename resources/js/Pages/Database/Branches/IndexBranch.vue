<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref } from 'vue';
    import { usePage, useForm, Head } from '@inertiajs/vue3';
    import Modal from '@/Components/Modal.vue';
    import InputLabel from '@/Components/InputLabel.vue';
    import InputError from '@/Components/InputError.vue';
    import Textarea from '@/Components/Textarea.vue';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import { usePermission } from '@/Composables/permissions';
    import { useDebouncedTableSearch } from '@/Composables/useDebouncedTableSearch';
    import axios from 'axios';
    defineProps(["fetchData"]);
    const form = useForm({
        id: "",
        branch_code: "",
        branch_name: "",
        branch_address: "",
        description: "",
        status: "",
        open_time: "",
        close_time: "",
        late_tolerance_minutes: 0,
        last_update: "",
        created_at: "",
        updated_at: "",
        fileUpload: "",
    });
    const { hasPermission } = usePermission();
    const search = useDebouncedTableSearch('branches.index', usePage().props.search);

    const showModalCreate = ref(false);
    const showModalUpload = ref(false);
    const showModalRead = ref(false);
    const showModalUpdate = ref(false);
    const showModalDelete = ref(false);

    const closeModalCreate = () => {
        showModalCreate.value = false;
    }
    const closeModalUpload = () => {
        showModalUpload.value = false;
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
        form.branch_code = data.branch_code;
        form.branch_name = data.branch_name;
        form.branch_address = data.branch_address;
        form.description = data.description;
        form.status = data.status;
        form.open_time = data.open_time;
        form.close_time = data.close_time;
        form.late_tolerance_minutes = data.late_tolerance_minutes ?? 0;
        form.last_update = data.last_update;
        form.created_at = data.created_at;
        form.updated_at = data.updated_at;
    }
    const modalUbahData = (data) => {
        showModalUpdate.value = true;
        form.id = data.id;
        form.branch_code = data.branch_code;
        form.branch_name = data.branch_name;
        form.branch_address = data.branch_address;
        form.description = data.description ?? '';
        form.status = data.status;
        form.open_time = data.open_time;
        form.close_time = data.close_time;
        form.late_tolerance_minutes = data.late_tolerance_minutes ?? 0;
    }
    const modalHapusData = (data) => {
        showModalDelete.value = true;
        form.id = data.id;
    }
    const modalUpload = () => { showModalUpload.value = true; }

    const tambahData = () => {
        form.post(route('branches.store'), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalCreate.value = false;
            }
        });
    }
    const uploadData = () => {
        form.post(route('branch.upload'), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalUpload.value = false;
            }
        });
    }
    const lihatData = (id) => {

    }
    const ubahData = () => {
        form.put(route('branches.update', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalUpdate.value = false;
            }
        });
    }
    const hapusData = () => {
        form.delete(route('branches.destroy', form.id), {
            onSuccess: () => {
                form.reset();
                form.clearErrors();
                showModalDelete.value = false;
            }
        });
    }
    const downloadFile = async () => {
        try {
            const response = await axios.get('/api/download-format-cabang', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'format-cabang.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Gagal mengunduh file: ', error);
        }
    }

    const formatTime = (value) => {
        if (!value) return '-';
        return value.slice(0, 5);
    }
</script>

<template>
    <Head title="Cabang" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Cabang</h1>
                        <p class="text-indigo-100 mt-1">Kelola data cabang dan lokasi</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input 
                                v-model="search" 
                                type="text" 
                                class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400" 
                                placeholder="Cari kode, nama, atau alamat cabang..."
                            >
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <template v-if="hasPermission('branch: create')">
                            <button 
                                @click="downloadFile" 
                                class="px-4 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Unduh Format
                            </button>
                            <button 
                                @click="modalUpload()" 
                                class="px-4 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                Upload
                            </button>
                            <button 
                                @click="modalTambahData()" 
                                class="px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah Data
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow class="bg-indigo-500">
                            <TableHeaderCell class="text-white">NO</TableHeaderCell>
                            <TableHeaderCell class="text-white">KODE CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">NAMA CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">ALAMAT CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">JAM OPERASIONAL</TableHeaderCell>
                            <TableHeaderCell class="text-white">STATUS CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">AKSI</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in fetchData.data" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_code }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_name }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_address }}</TableDataCell>
                            <TableDataCell :status="'record'">
                                {{ formatTime(data.open_time) }} - {{ formatTime(data.close_time) }}
                                <span class="block text-xs text-gray-500">Toleransi {{ data.late_tolerance_minutes ?? 0 }} menit</span>
                            </TableDataCell>
                            <TableDataCell :status="'record'">
                                <p
                                    class="text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center"
                                    :class="data.status == 'Aktif' ? 'bg-green-500' : 'bg-red-500'"
                                >
                                    {{ data.status }}
                                </p>
                            </TableDataCell>
                            <TableDataCell :status="'action'">
                                <template v-if="hasPermission('branch: read')">
                                    <button 
                                        @click="modalLiatData(data)" 
                                        class="text-white mr-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md transform transition-all duration-200 hover:scale-105" 
                                        type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </button>
                                </template>
                                <template v-if="hasPermission('branch: update')">
                                    <button 
                                        @click="modalUbahData(data)" 
                                        class="text-white mr-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center shadow-md transform transition-all duration-200 hover:scale-105" 
                                        type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                </template>
                                <template v-if="hasPermission('branch: delete')">
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
                            <TablePagination :pagination="fetchData.meta" />
                        </div>
                    </template>
                </Table>
            </div>

            <!-- Modal Upload -->
            <Modal :show="showModalUpload" @close="closeModalUpload">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            UNGGAH CABANG
                        </h3>
                    </div>
                    <form @submit.prevent="uploadData">
                        <div class="grid grid-cols-2 gap-2 px-4 py-2">
                            <div>
                                <InputLabel for="fileUpload" value="Unggah Berkas" />
                                <input @input="form.fileUpload = $event.target.files[0]" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file">
                                <InputError class="mt-2" :message="form.errors.fileUpload" />
                            </div>
                        </div>
                        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button :class="{ 'opacity-25': form.processing }" :disabled="form.processing" type="submit" class="text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Unggah</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <!-- Modal Tambah Data -->
            <Modal :show="showModalCreate" @close="closeModalCreate">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            TAMBAH CABANG
                        </h3>
                    </div>
                    <form @submit.prevent="tambahData">
                        <div class="grid grid-cols-2 gap-4 mx-4">
                            <div>
                                <label for="branch_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor</label>
                                <input v-model="form.branch_code" type="text" id="branch_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_code" />
                            </div>
                            <div>
                                <label for="branch_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Cabang</label>
                                <input v-model="form.branch_name" type="text" id="branch_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_name" />
                            </div>
                            <div>
                                <label for="branch_address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Cabang</label>
                                <input v-model="form.branch_address" type="text" id="branch_address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_address" />
                            </div>
                            <div>
                                <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status Cabang</label>
                                <select id="status" v-model="form.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="" selected disabled>Pilih</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.status" />
                            </div>
                            <div>
                                <label for="open_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jam Buka</label>
                                <input v-model="form.open_time" type="time" id="open_time" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.open_time" />
                            </div>
                            <div>
                                <label for="close_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jam Tutup</label>
                                <input v-model="form.close_time" type="time" id="close_time" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.close_time" />
                            </div>
                            <div>
                                <label for="late_tolerance_minutes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Toleransi Terlambat (menit)</label>
                                <input v-model="form.late_tolerance_minutes" min="0" type="number" id="late_tolerance_minutes" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.late_tolerance_minutes" />
                            </div>
                            <div class="col-span-2">
                                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profil Cabang</label>
                                <Textarea :row="9" v-model="form.description" :placeholder="'Silahkan masukkan profil cabang disini...'" />
                                <InputError class="mt-2" :message="form.errors.description" />
                            </div>
                        </div>
                        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button :class="{ 'opacity-25': form.processing }" :disabled="form.processing" type="submit" class="text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <!-- Modal Lihat Data  -->
            <Modal :show="showModalRead" @close="closeModalRead">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            TAMPILKAN CABANG
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
                                            KODE CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.branch_code }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            NAMA CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.branch_name }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            ALAMAT CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.branch_address }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            STATUS CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            <p
                                                class="text-white font-medium rounded-sm text-sm px-2 text-center inline-flex items-center"
                                                :class="form.status == 'Aktif' ? 'bg-green-500' : 'bg-red-500'"
                                            >
                                                {{ form.status }}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            JAM OPERASIONAL
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ formatTime(form.open_time) }} - {{ formatTime(form.close_time) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            TOLERANSI TERLAMBAT
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.late_tolerance_minutes ?? 0 }} menit
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            PROFIL CABANG
                                        </th>
                                        <td class="px-6 py-4">
                                            <pre style="white-space: pre-line; font-size: 13px; color: gray; font-family: 'Arial', sans-serif;">
                                                {{ form.description }}
                                            </pre>
                                        </td>
                                    </tr>
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            DIUBAH OLEH
                                        </th>
                                        <td class="px-6 py-4">
                                            {{ form.last_update?.user?.name ?? '-' }}
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
            <!-- Modal Ubah Data  -->
            <Modal :show="showModalUpdate" @close="closeModalUpdate">
                <div class="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            UBAH CABANG
                        </h3>
                    </div>
                    <form @submit.prevent="ubahData">
                        <div class="grid grid-cols-2 gap-4 mx-4">
                            <div>
                                <label for="branch_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor</label>
                                <input v-model="form.branch_code" type="text" id="branch_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_code" />
                            </div>
                            <div>
                                <label for="branch_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Cabang</label>
                                <input v-model="form.branch_name" type="text" id="branch_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_name" />
                            </div>
                            <div>
                                <label for="branch_address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Cabang</label>
                                <input v-model="form.branch_address" type="text" id="branch_address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.branch_address" />
                            </div>
                            <div>
                                <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status Cabang</label>
                                <select id="status" v-model="form.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="" selected disabled>Pilih</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.status" />
                            </div>
                            <div>
                                <label for="open_time_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jam Buka</label>
                                <input v-model="form.open_time" type="time" id="open_time_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.open_time" />
                            </div>
                            <div>
                                <label for="close_time_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jam Tutup</label>
                                <input v-model="form.close_time" type="time" id="close_time_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.close_time" />
                            </div>
                            <div>
                                <label for="late_tolerance_minutes_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Toleransi Terlambat (menit)</label>
                                <input v-model="form.late_tolerance_minutes" min="0" type="number" id="late_tolerance_minutes_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <InputError :message="form.errors.late_tolerance_minutes" />
                            </div>
                            <div class="col-span-2">
                                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profil Cabang</label>
                                <Textarea :row="9" v-model="form.description" :placeholder="'Silahkan masukkan profil cabang disini...'" />
                                <InputError class="mt-2" :message="form.errors.description" />
                            </div>
                        </div>
                        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button :class="{ 'opacity-25': form.processing }" :disabled="form.processing" type="submit" class="text-white uppercase bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ubah</button>
                        </div>
                    </form>
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
                            Apakah anda yakin ingin menghapus cabang ini ?
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
