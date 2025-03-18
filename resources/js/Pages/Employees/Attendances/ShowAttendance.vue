<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { ref, onMounted, watch } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from "axios";
import TextInput from "@/Components/TextInput.vue";
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

// Fungsi untuk mendapatkan daftar tanggal dalam bulan berjalan
const getCurrentMonthDates = () => {
    let dates = [];
    let today = new Date();
    let startDate = new Date(today.getFullYear(), today.getMonth(), 2); // Tanggal 1 bulan ini
    let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Tanggal terakhir bulan ini

    selectStartDate.value = startDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
    selectEndDate.value = endDate.toISOString().split("T")[0];

    while (startDate <= endDate) {
        dates.push({
            work_date: startDate.toISOString().split("T")[0],
            check_in: null,
            check_out: null
        });
        startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
};

const allDates = ref(getCurrentMonthDates());

// Ambil data dari API dan cocokkan dengan daftar tanggal bulan berjalan
const getData = async () => {
    try {
        const response = await axios.get(`/api/employee-attendances/${props.id}`, {
            params: {
                start_date: selectStartDate.value,
                end_date: selectEndDate.value
            }
        });

        const apiData = response.data.attendances || [];

        // Gabungkan dengan daftar tanggal jika tidak ditemukan di API
        fetchData.value = allDates.value.map(item => {
            const match = apiData.find(d => d.work_date === item.work_date);
            return match ? match : item;
        });
    } catch (error) {
        console.error("Gagal mengambil data", error);
    }
};

onMounted(getData);

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
            <div class="flex justify-end my-4">
                <!-- <div class="flex items-center">
                    Dari: <TextInput type="date" class="mx-2 w-32" v-model="selectStartDate" />
                    Sampai: <TextInput type="date" class="mx-2 w-32" v-model="selectEndDate" />
                </div> -->
            </div>
            <Table>
                <template #header>
                    <TableRow>
                        <TableHeaderCell>NO</TableHeaderCell>
                        <TableHeaderCell>TANGGAL</TableHeaderCell>
                        <TableHeaderCell class="text-center">JAM MASUK</TableHeaderCell>
                        <TableHeaderCell class="text-center">JAM KELUAR</TableHeaderCell>
                    </TableRow>
                </template>
                <template #default>
                    <TableRow v-for="(data, index) in fetchData" :key="index">
                        <TableDataCell :status="'number'" class="border border-b-1">{{ index + 1 }}</TableDataCell>
                        <TableDataCell :status="'record'" class="border border-b-1">{{ formatTanggal(data.work_date) }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1">{{ formatJam(data.check_in) }}</TableDataCell>
                        <TableDataCell :status="'record'" class="text-center border border-b-1">{{ formatJam(data.check_out) }}</TableDataCell>
                    </TableRow>
                </template>
            </Table>
        </div>
    </AuthenticatedLayout>
</template>
