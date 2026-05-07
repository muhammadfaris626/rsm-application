<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import TextInput from '@/Components/TextInput.vue';
import Modal from '@/Components/Modal.vue';
import { Head, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const props = defineProps({
    branches: {
        type: Array,
        default: () => [],
    },
    selectedBranchId: {
        type: Number,
        default: null,
    },
    period: {
        type: Object,
        default: () => ({}),
    },
    overall: {
        type: Object,
        default: () => ({}),
    },
    branchSummaries: {
        type: Array,
        default: () => [],
    },
    notAbsentDetails: {
        type: Array,
        default: () => [],
    },
    attendanceDetails: {
        type: Object,
        default: () => ({}),
    },
    isBranchAdmin: {
        type: Boolean,
        default: false,
    },
});

const selectedBranch = ref(props.selectedBranchId ?? '');
const startDate = ref(props.period.start_date ?? '');
const endDate = ref(props.period.end_date ?? '');
const showDetailModal = ref(false);
const selectedDetailBranch = ref(null);
const selectedDetailType = ref('not_absent');

const cards = computed(() => [
    { label: 'Karyawan Aktif', value: props.overall.employee_count || 0, helper: 'Total karyawan dalam cabang terpilih', color: 'from-sky-500 to-sky-600' },
    { label: 'Tepat Waktu', type: 'on_time', value: props.overall.on_time || 0, helper: `${props.overall.on_time_percentage || 0}% dari total jadwal`, color: 'from-green-500 to-green-600' },
    { label: 'Terlambat', type: 'late', value: props.overall.late || 0, helper: `${props.overall.late_percentage || 0}% dari total jadwal`, color: 'from-red-500 to-red-600' },
    { label: 'Tidak Absen', type: 'not_absent', value: props.overall.not_absent || 0, helper: `${props.overall.not_absent_percentage || 0}% dari total jadwal`, color: 'from-gray-600 to-gray-700' },
    { label: 'Sakit / Izin', type: 'sick_permit', value: (props.overall.sick || 0) + (props.overall.permit || 0), helper: `${props.overall.sick || 0} sakit, ${props.overall.permit || 0} izin`, color: 'from-amber-500 to-amber-600' },
    { label: 'Belum Absen Keluar', type: 'incomplete_checkout', value: props.overall.incomplete_checkout || 0, helper: 'Sudah masuk, belum keluar', color: 'from-purple-500 to-purple-600' },
]);

const monitoringBars = computed(() => [
    { label: 'Tepat Waktu', value: props.overall.on_time_percentage || 0, color: 'bg-green-500' },
    { label: 'Terlambat', value: props.overall.late_percentage || 0, color: 'bg-red-500' },
    { label: 'Tidak Absen', value: props.overall.not_absent_percentage || 0, color: 'bg-gray-700' },
]);

const detailLabels = {
    on_time: 'Tepat Waktu',
    late: 'Terlambat',
    not_absent: 'Tidak Absen',
    sick: 'Sakit',
    permit: 'Izin',
    sick_permit: 'Sakit / Izin',
    incomplete_checkout: 'Belum Absen Keluar',
};

const rawSelectedDetails = computed(() => {
    if (selectedDetailType.value === 'not_absent') {
        return props.notAbsentDetails;
    }

    if (selectedDetailType.value === 'sick_permit') {
        return [
            ...(props.attendanceDetails.sick || []),
            ...(props.attendanceDetails.permit || []),
        ];
    }

    return props.attendanceDetails[selectedDetailType.value] || [];
});

const selectedDetails = computed(() => {
    if (!selectedDetailBranch.value) {
        return rawSelectedDetails.value;
    }

    return rawSelectedDetails.value.filter((item) => Number(item.branch_id) === Number(selectedDetailBranch.value.branch_id));
});

const selectedDetailTitle = computed(() => `${detailLabels[selectedDetailType.value]} - ${selectedDetailBranch.value?.branch_name || 'Semua Cabang'}`);

const applyFilter = () => {
    router.get(route('attendances.summary'), {
        branch_id: selectedBranch.value || undefined,
        start_date: startDate.value || undefined,
        end_date: endDate.value || undefined,
    }, {
        preserveScroll: true,
        replace: true,
    });
};

const resetFilter = () => {
    selectedBranch.value = props.isBranchAdmin ? props.selectedBranchId : '';
    startDate.value = '';
    endDate.value = '';

    router.get(route('attendances.summary'), props.isBranchAdmin ? { branch_id: props.selectedBranchId } : {}, {
        preserveScroll: true,
        replace: true,
    });
};

const openDetailModal = (type, branch = null) => {
    selectedDetailType.value = type;
    selectedDetailBranch.value = branch;
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedDetailBranch.value = null;
};

const formatDate = (value) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
};

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const countButtonClass = (value, color) => value > 0 ? color : 'bg-gray-300 cursor-default';
</script>

<template>
    <Head title="Rekap Absensi" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold">Rekap Absensi</h1>
                        <p class="text-sky-100 mt-1">
                            Monitoring absensi semua cabang periode {{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }}
                        </p>
                    </div>
                    <div class="bg-white/20 rounded-lg px-4 py-3 text-sm">
                        <p class="text-sky-100">Total Hari</p>
                        <p class="text-2xl font-bold">{{ period.days || 0 }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md p-4">
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    <div class="lg:col-span-2">
                        <label class="block mb-1 text-sm font-medium text-gray-700">Cabang</label>
                        <select
                            v-model="selectedBranch"
                            :disabled="isBranchAdmin"
                            class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full px-4 py-2.5 disabled:bg-gray-100"
                        >
                            <option value="">Semua Cabang</option>
                            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                                {{ branch.branch_name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700">Dari Tanggal</label>
                        <TextInput type="date" class="w-full" v-model="startDate" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700">Sampai Tanggal</label>
                        <TextInput type="date" class="w-full" v-model="endDate" />
                    </div>
                    <div class="flex items-end gap-2">
                        <button
                            type="button"
                            @click="applyFilter"
                            class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg"
                        >
                            Tampilkan
                        </button>
                        <button
                            type="button"
                            @click="resetFilter"
                            class="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
                <div
                    v-for="card in cards"
                    :key="card.label"
                    :class="['rounded-xl shadow-lg p-5 text-white bg-gradient-to-br', card.color]"
                >
                    <p class="text-sm font-semibold text-white/80">{{ card.label }}</p>
                    <button
                        v-if="card.type"
                        type="button"
                        @click="openDetailModal(card.type)"
                        class="block text-left text-3xl font-bold mt-2 underline decoration-white/50 underline-offset-4 hover:decoration-white"
                    >
                        {{ card.value }}
                    </button>
                    <p v-else class="text-3xl font-bold mt-2">{{ card.value }}</p>
                    <p class="text-xs text-white/80 mt-2">{{ card.helper }}</p>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md p-5">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">Persentase Monitoring</h2>
                        <p class="text-sm text-gray-500 mt-1">Perhitungan berdasarkan total jadwal karyawan aktif dalam periode yang dipilih.</p>
                    </div>
                    <p class="text-sm font-semibold text-gray-700">Total jadwal: {{ overall.total_slots || 0 }}</p>
                </div>
                <div class="space-y-4">
                    <div v-for="bar in monitoringBars" :key="bar.label">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-medium text-gray-700">{{ bar.label }}</span>
                            <span class="text-sm font-bold text-gray-900">{{ formatPercent(bar.value) }}</span>
                        </div>
                        <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div :class="['h-full rounded-full', bar.color]" :style="{ width: `${Math.min(bar.value, 100)}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-5 border-b border-gray-200">
                    <h2 class="text-lg font-bold text-gray-900">Rekap Semua Cabang</h2>
                    <p class="text-sm text-gray-500 mt-1">Klik filter cabang jika ingin fokus monitoring satu cabang saja.</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1250px] text-sm text-left text-gray-600">
                        <thead class="bg-sky-500 text-white uppercase">
                            <tr>
                                <th class="px-4 py-3 whitespace-nowrap">No</th>
                                <th class="px-4 py-3 whitespace-nowrap">Cabang</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Karyawan</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Tepat Waktu</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">% Tepat</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Terlambat</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">% Terlambat</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Tidak Absen</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">% Tidak Absen</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Sakit</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Izin</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Belum Keluar</th>
                                <th class="px-4 py-3 text-center whitespace-nowrap">Disiplin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(branch, index) in branchSummaries"
                                :key="branch.branch_id"
                                class="border-b border-gray-100 hover:bg-sky-50"
                            >
                                <td class="px-4 py-3 whitespace-nowrap font-medium">{{ index + 1 }}</td>
                                <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">{{ branch.branch_name }}</td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">{{ branch.employee_count }}</td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('on_time', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.on_time, 'bg-green-600 hover:bg-green-700')"
                                    >
                                        {{ branch.on_time }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap text-green-700 font-semibold">{{ formatPercent(branch.on_time_percentage) }}</td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('late', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.late, 'bg-red-600 hover:bg-red-700')"
                                    >
                                        {{ branch.late }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap text-red-700 font-semibold">{{ formatPercent(branch.late_percentage) }}</td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('not_absent', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.not_absent, 'bg-gray-700 hover:bg-gray-800')"
                                    >
                                        {{ branch.not_absent }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap text-gray-900 font-semibold">{{ formatPercent(branch.not_absent_percentage) }}</td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('sick', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.sick, 'bg-amber-500 hover:bg-amber-600')"
                                    >
                                        {{ branch.sick }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('permit', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.permit, 'bg-blue-600 hover:bg-blue-700')"
                                    >
                                        {{ branch.permit }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        type="button"
                                        @click="openDetailModal('incomplete_checkout', branch)"
                                        class="inline-flex min-w-[44px] justify-center rounded-lg px-3 py-1 font-bold text-white"
                                        :class="countButtonClass(branch.incomplete_checkout, 'bg-purple-600 hover:bg-purple-700')"
                                    >
                                        {{ branch.incomplete_checkout }}
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <span
                                        class="inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-xs font-bold"
                                        :class="branch.discipline_percentage >= 80 ? 'bg-green-100 text-green-700' : branch.discipline_percentage >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'"
                                    >
                                        {{ formatPercent(branch.discipline_percentage) }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="branchSummaries.length === 0">
                                <td colspan="13" class="px-4 py-10 text-center text-gray-400">Belum ada data untuk ditampilkan</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal :show="showDetailModal" @close="closeDetailModal">
                <div class="bg-white rounded-lg shadow">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 border-b border-gray-200">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Daftar {{ selectedDetailTitle }}</h3>
                            <p class="text-sm text-gray-500 mt-1">
                                Periode {{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }}
                            </p>
                        </div>
                        <button
                            type="button"
                            @click="closeDetailModal"
                            class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            Tutup
                        </button>
                    </div>
                    <div class="p-5">
                        <div class="mb-4 rounded-lg bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
                            Total data: {{ selectedDetails.length }}
                        </div>
                        <div class="max-h-[60vh] overflow-auto border border-gray-200 rounded-lg">
                            <table class="w-full min-w-[980px] text-sm text-left text-gray-600">
                                <thead class="sticky top-0 bg-gray-100 text-gray-700 uppercase">
                                    <tr>
                                        <th class="px-4 py-3 whitespace-nowrap">No</th>
                                        <th class="px-4 py-3 whitespace-nowrap">Tanggal</th>
                                        <th class="px-4 py-3 whitespace-nowrap">Nomor Karyawan</th>
                                        <th class="px-4 py-3 whitespace-nowrap">Nama Karyawan</th>
                                        <th class="px-4 py-3 whitespace-nowrap">Cabang</th>
                                        <th v-if="selectedDetailType !== 'not_absent'" class="px-4 py-3 whitespace-nowrap">Jenis</th>
                                        <th v-if="['on_time', 'late', 'incomplete_checkout'].includes(selectedDetailType)" class="px-4 py-3 whitespace-nowrap">Jam Masuk</th>
                                        <th v-if="selectedDetailType === 'incomplete_checkout'" class="px-4 py-3 whitespace-nowrap">Jam Keluar</th>
                                        <th v-if="selectedDetailType === 'late'" class="px-4 py-3 whitespace-nowrap">Menit Terlambat</th>
                                        <th v-if="selectedDetailType !== 'not_absent'" class="px-4 py-3 whitespace-nowrap">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, index) in selectedDetails"
                                        :key="`${item.employee_id}-${item.work_date}`"
                                        class="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td class="px-4 py-3 whitespace-nowrap">{{ index + 1 }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">{{ formatDate(item.work_date) }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap">{{ item.employee_number || '-' }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">{{ item.employee_name }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap">{{ item.branch_name }}</td>
                                        <td v-if="selectedDetailType !== 'not_absent'" class="px-4 py-3 whitespace-nowrap">{{ item.attendance_type || '-' }}</td>
                                        <td v-if="['on_time', 'late', 'incomplete_checkout'].includes(selectedDetailType)" class="px-4 py-3 whitespace-nowrap">{{ item.check_in || '-' }}</td>
                                        <td v-if="selectedDetailType === 'incomplete_checkout'" class="px-4 py-3 whitespace-nowrap">{{ item.check_out || '-' }}</td>
                                        <td v-if="selectedDetailType === 'late'" class="px-4 py-3 whitespace-nowrap">{{ item.late_minutes || 0 }} menit</td>
                                        <td v-if="selectedDetailType !== 'not_absent'" class="px-4 py-3 whitespace-nowrap">{{ item.attendance_note || '-' }}</td>
                                    </tr>
                                    <tr v-if="selectedDetails.length === 0">
                                        <td colspan="10" class="px-4 py-10 text-center text-gray-400">Tidak ada data pada periode ini</td>
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
