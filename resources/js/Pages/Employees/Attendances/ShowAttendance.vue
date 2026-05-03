<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { ref, onMounted, watch } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from "axios";
import TextInput from "@/Components/TextInput.vue";
import Modal from '@/Components/Modal.vue';
import Table from '@/Components/Custom/Table.vue';
import TableRow from '@/Components/Custom/TableRow.vue';
import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
import TableDataCell from '@/Components/Custom/TableDataCell.vue';

const props = defineProps({
    id: { type: String },
});

const fetchData = ref([]);
const selectStartDate = ref(null);
const selectEndDate = ref(null);
const showPhotoModal = ref(false);
const selectedPhoto = ref({
    title: '',
    url: '',
});

const formatDateInput = (date) => {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const buildDateRows = () => {
    let dates = [];
    let startDate = new Date(`${selectStartDate.value}T00:00:00`);
    let endDate = new Date(`${selectEndDate.value}T00:00:00`);

    while (startDate <= endDate) {
        dates.push({
            work_date: formatDateInput(startDate),
            attendance_type: null,
            check_in: null,
            check_out: null,
            late_minutes: 0,
            attendance_status: null,
            attendance_note: null,
            early_leave_minutes: 0,
            checkout_status: null
        });
        startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
};

const setDefaultDateRange = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    selectStartDate.value = formatDateInput(startDate);
    selectEndDate.value = formatDateInput(endDate);
};

setDefaultDateRange();

// Ambil data dari API dan cocokkan dengan daftar tanggal bulan berjalan
const getData = async () => {
    try {
        const dateRows = buildDateRows();
        const response = await axios.get(`/api/employee-attendances/${props.id}`, {
            params: {
                start_date: selectStartDate.value,
                end_date: selectEndDate.value
            }
        });

        const apiData = response.data.attendances || [];

        // Gabungkan dengan daftar tanggal jika tidak ditemukan di API
        fetchData.value = dateRows.map(item => {
            const match = apiData.find(d => d.work_date === item.work_date);
            return match ? match : item;
        });
    } catch (error) {
        console.error("Gagal mengambil data", error);
    }
};

onMounted(getData);

const applyDateFilter = () => {
    getData();
};

const resetDateFilter = () => {
    setDefaultDateRange();
    getData();
};

const formatTanggal = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

const formatJam = (dateString) => {
    if (!dateString) return "-- : --";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', // Format 24 jam
    }).format(date);
};

const photoUrl = (path) => path ? `/storage/${path}` : '';

const openPhoto = (title, path) => {
    if (!path) return;

    selectedPhoto.value = {
        title,
        url: photoUrl(path),
    };
    showPhotoModal.value = true;
};

const closePhoto = () => {
    showPhotoModal.value = false;
    selectedPhoto.value = {
        title: '',
        url: '',
    };
};
</script>

<template>
    <Head title="Lihat Absensi" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                Karyawan
                            </a>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link :href="route('attendances.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Data Absensi</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Lihat Absensi</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="bg-white rounded-xl shadow-md p-4 my-4">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700">Dari Tanggal</label>
                            <TextInput type="date" class="w-full" v-model="selectStartDate" />
                        </div>
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700">Sampai Tanggal</label>
                            <TextInput type="date" class="w-full" v-model="selectEndDate" />
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            @click="applyDateFilter"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                        >
                            Tampilkan
                        </button>
                        <button
                            type="button"
                            @click="resetDateFilter"
                            class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            Bulan Ini
                        </button>
                    </div>
                </div>
            </div>
            <Table tableClass="min-w-[1500px] table-fixed">
                <template #header>
                    <TableRow>
                        <TableHeaderCell class="w-[70px] whitespace-nowrap">NO</TableHeaderCell>
                        <TableHeaderCell class="w-[150px] whitespace-nowrap">TANGGAL</TableHeaderCell>
                        <TableHeaderCell class="w-[120px] text-center whitespace-nowrap">JENIS</TableHeaderCell>
                        <TableHeaderCell class="w-[140px] text-center whitespace-nowrap">JAM MASUK</TableHeaderCell>
                        <TableHeaderCell class="w-[190px] text-center whitespace-nowrap">STATUS MASUK</TableHeaderCell>
                        <TableHeaderCell class="w-[140px] text-center whitespace-nowrap">JAM KELUAR</TableHeaderCell>
                        <TableHeaderCell class="w-[190px] text-center whitespace-nowrap">STATUS KELUAR</TableHeaderCell>
                        <TableHeaderCell class="w-[280px] whitespace-nowrap">KETERANGAN</TableHeaderCell>
                        <TableHeaderCell class="w-[220px] text-center whitespace-nowrap">FOTO</TableHeaderCell>
                    </TableRow>
                </template>
                <template #default>
                    <TableRow v-for="(data, index) in fetchData" :key="index">
                        <TableDataCell :status="'number'" class="border border-b-1 whitespace-nowrap">{{ index + 1 }}</TableDataCell>
                        <TableDataCell :status="'record'" class="border border-b-1 whitespace-nowrap">{{ formatTanggal(data.work_date) }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">{{ data.attendance_type ?? '-' }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">{{ formatJam(data.check_in) }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">
                            <span
                                v-if="data.attendance_status"
                                class="inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-semibold"
                                :class="data.attendance_status === 'Terlambat' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                            >
                                {{ data.attendance_status }}
                                <template v-if="data.late_minutes">&nbsp;({{ data.late_minutes }} menit)</template>
                            </span>
                            <span v-else>-</span>
                        </TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">{{ formatJam(data.check_out) }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">
                            <span
                                v-if="data.checkout_status"
                                class="inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-semibold"
                                :class="data.checkout_status === 'Pulang cepat' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'"
                            >
                                {{ data.checkout_status }}
                                <template v-if="data.early_leave_minutes">&nbsp;({{ data.early_leave_minutes }} menit)</template>
                            </span>
                            <span v-else>-</span>
                        </TableDataCell>
                        <TableDataCell :status="'record'" class="border border-b-1 whitespace-nowrap truncate">{{ data.attendance_note ?? '-' }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1 whitespace-nowrap">
                            <div class="flex flex-nowrap justify-center gap-2">
                                <button
                                    type="button"
                                    @click="openPhoto('Foto Absen Masuk', data.check_in_photo)"
                                    :disabled="!data.check_in_photo"
                                    class="whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded"
                                >
                                    Masuk
                                </button>
                                <button
                                    type="button"
                                    @click="openPhoto('Foto Absen Keluar', data.check_out_photo)"
                                    :disabled="!data.check_out_photo"
                                    class="whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded"
                                >
                                    Keluar
                                </button>
                            </div>
                        </TableDataCell>
                    </TableRow>
                </template>
            </Table>

            <Modal :show="showPhotoModal" @close="closePhoto">
                <div class="relative w-full max-w-3xl bg-white rounded-lg shadow">
                    <div class="flex items-center justify-between p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">{{ selectedPhoto.title }}</h3>
                        <button
                            type="button"
                            @click="closePhoto"
                            class="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            Tutup
                        </button>
                    </div>
                    <div class="p-4">
                        <img
                            v-if="selectedPhoto.url"
                            :src="selectedPhoto.url"
                            :alt="selectedPhoto.title"
                            class="w-full max-h-[70vh] object-contain rounded-lg bg-gray-100"
                        >
                    </div>
                </div>
            </Modal>
        </div>
    </AuthenticatedLayout>
</template>
