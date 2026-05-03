<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    employee: {
        type: Object,
        default: null,
    },
    todayAttendance: {
        type: Object,
        default: null,
    },
    serverTime: {
        type: String,
        default: '',
    },
});

const page = usePage();
const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const capturedPhoto = ref('');
const photoBlob = ref(null);
const message = ref('');
const messageType = ref('info');
const isSubmitting = ref(false);
const isSubmittingAbsence = ref(false);
const cameraReady = ref(false);
const cameraError = ref('');
const currentAttendance = ref(props.todayAttendance);
const maxPhotoSize = 720;
const photoQuality = 0.65;
const attendanceNote = ref('');
const todayDate = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
const absenceForm = ref({
    work_date: todayDate(),
    attendance_type: '',
    attendance_note: '',
});

const hasCheckedIn = computed(() => Boolean(currentAttendance.value?.check_in));
const hasCheckedOut = computed(() => Boolean(currentAttendance.value?.check_out));
const isTodayAbsence = computed(() => ['Sakit', 'Izin'].includes(currentAttendance.value?.attendance_type));
const actionLabel = computed(() => {
    if (!hasCheckedIn.value) return 'Absen Masuk';
    if (!hasCheckedOut.value) return 'Absen Keluar';
    return 'Absensi Hari Ini Selesai';
});

const statusLabel = computed(() => {
    if (isTodayAbsence.value) return currentAttendance.value.attendance_type;
    if (!hasCheckedIn.value) return 'Belum absen';
    if (!hasCheckedOut.value) return 'Sudah absen masuk';
    return 'Sudah absen lengkap';
});

const isCurrentTimeLate = computed(() => {
    if (!props.employee?.branch?.open_time || hasCheckedIn.value || isTodayAbsence.value) return false;

    const [hour, minute] = props.employee.branch.open_time.slice(0, 5).split(':').map(Number);
    const now = new Date();
    const limit = new Date();
    limit.setHours(hour, minute + Number(props.employee.branch.late_tolerance_minutes ?? 0), 0, 0);

    return now > limit;
});

const formatDateTime = (value) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
};

const formatTime = (value) => {
    if (!value) return '-';
    return value.slice(0, 5);
};

const currentLocalDateTime = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const setMessage = (text, type = 'info') => {
    message.value = text;
    messageType.value = type;
};

const startCamera = async () => {
    cameraError.value = '';
    if (!navigator.mediaDevices?.getUserMedia) {
        cameraError.value = 'Browser tidak mendukung akses kamera.';
        return;
    }

    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 720 },
                height: { ideal: 720 },
            },
            audio: false,
        });

        if (video.value) {
            video.value.srcObject = stream.value;
            cameraReady.value = true;
        }
    } catch (error) {
        cameraReady.value = false;
        cameraError.value = 'Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.';
    }
};

const stopCamera = () => {
    stream.value?.getTracks()?.forEach(track => track.stop());
    stream.value = null;
    cameraReady.value = false;
};

const capturePhoto = async () => {
    if (!video.value || !canvas.value || !cameraReady.value) {
        setMessage('Kamera belum siap.', 'error');
        return;
    }

    const sourceWidth = video.value.videoWidth || 640;
    const sourceHeight = video.value.videoHeight || 480;
    const scale = Math.min(maxPhotoSize / sourceWidth, maxPhotoSize / sourceHeight, 1);
    const width = Math.round(sourceWidth * scale);
    const height = Math.round(sourceHeight * scale);

    canvas.value.width = width;
    canvas.value.height = height;

    const context = canvas.value.getContext('2d');
    context.drawImage(video.value, 0, 0, width, height);

    capturedPhoto.value = canvas.value.toDataURL('image/jpeg', photoQuality);
    photoBlob.value = await new Promise(resolve => canvas.value.toBlob(resolve, 'image/jpeg', photoQuality));
    setMessage('Foto berhasil diambil.', 'success');
};

const submitAttendance = async () => {
    if (!props.employee) {
        setMessage('Akun ini belum terhubung dengan data karyawan.', 'error');
        return;
    }

    if (isTodayAbsence.value) {
        setMessage('Hari ini sudah tercatat sebagai ' + currentAttendance.value.attendance_type + '.', 'info');
        return;
    }

    if (hasCheckedOut.value) {
        setMessage('Absensi hari ini sudah lengkap.', 'info');
        return;
    }

    if (!hasCheckedIn.value && isCurrentTimeLate.value && !attendanceNote.value.trim()) {
        setMessage('Keterangan terlambat wajib diisi.', 'error');
        return;
    }

    if (!photoBlob.value) {
        setMessage('Ambil foto terlebih dahulu sebelum absen.', 'error');
        return;
    }

    isSubmitting.value = true;

    const payload = new FormData();
    payload.append('user_id', page.props.auth.user.id);
    payload.append('attendance', currentLocalDateTime());
    payload.append('photo', photoBlob.value, 'attendance.jpg');
    payload.append('attendance_note', attendanceNote.value);

    try {
        const response = await axios.post('/api/attendance', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessage(response.data?.message || 'Absensi berhasil disimpan.', response.data?.status === 'completed' ? 'info' : 'success');
        photoBlob.value = null;
        capturedPhoto.value = '';
        attendanceNote.value = '';

        window.location.reload();
    } catch (error) {
        setMessage(error.response?.data?.message || 'Absensi gagal disimpan.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const submitAbsence = async () => {
    if (!props.employee) {
        setMessage('Akun ini belum terhubung dengan data karyawan.', 'error');
        return;
    }

    if (!absenceForm.value.attendance_type || !absenceForm.value.attendance_note.trim()) {
        setMessage('Jenis absensi dan keterangan wajib diisi.', 'error');
        return;
    }

    isSubmittingAbsence.value = true;

    try {
        const response = await axios.post(route('attendances.absence'), absenceForm.value);
        setMessage(response.data?.message || 'Data berhasil dikirim.', 'success');
        window.location.reload();
    } catch (error) {
        setMessage(error.response?.data?.message || 'Data gagal dikirim.', 'error');
    } finally {
        isSubmittingAbsence.value = false;
    }
};

onMounted(startCamera);
onBeforeUnmount(stopCamera);
</script>

<template>
    <Head title="Absen Saya" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <h1 class="text-2xl font-bold">Absen Saya</h1>
                <p class="text-blue-100 mt-1">Lakukan absen masuk dan keluar menggunakan foto langsung dari kamera.</p>
            </div>

            <div v-if="!employee" class="bg-white rounded-xl shadow-md p-6">
                <p class="text-red-600 font-semibold">Akun ini belum terhubung dengan data karyawan.</p>
                <p class="text-gray-600 mt-1">Hubungkan akun user login ke data karyawan melalui menu Database Karyawan.</p>
            </div>

            <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div class="xl:col-span-2 bg-white rounded-xl shadow-md p-5">
                    <div class="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Kamera Absensi</h2>
                            <p class="text-sm text-gray-500">{{ employee.name }} · {{ employee.branch?.branch_name ?? '-' }}</p>
                        </div>
                        <span
                            class="px-3 py-1 rounded-full text-sm font-semibold"
                            :class="{
                                'bg-blue-100 text-blue-700': isTodayAbsence,
                                'bg-gray-100 text-gray-700': !hasCheckedIn && !isTodayAbsence,
                                'bg-yellow-100 text-yellow-700': hasCheckedIn && !hasCheckedOut,
                                'bg-green-100 text-green-700': hasCheckedOut,
                            }"
                        >
                            {{ statusLabel }}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="bg-gray-100 rounded-lg overflow-hidden min-h-[320px] flex items-center justify-center">
                            <video
                                ref="video"
                                autoplay
                                playsinline
                                muted
                                class="w-full h-full object-cover"
                            ></video>
                            <p v-if="cameraError" class="p-6 text-center text-red-600">{{ cameraError }}</p>
                        </div>

                        <div class="bg-gray-100 rounded-lg overflow-hidden min-h-[320px] flex items-center justify-center">
                            <img v-if="capturedPhoto" :src="capturedPhoto" alt="Foto absensi" class="w-full h-full object-cover">
                            <p v-else class="text-gray-500 text-sm">Foto yang diambil akan muncul di sini.</p>
                        </div>
                    </div>

                    <canvas ref="canvas" class="hidden"></canvas>

                    <div v-if="isCurrentTimeLate && !hasCheckedIn" class="mt-5">
                        <label class="block mb-2 text-sm font-medium text-gray-700">Keterangan Terlambat</label>
                        <textarea
                            v-model="attendanceNote"
                            rows="3"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Masukkan alasan terlambat..."
                        ></textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                            type="button"
                            @click="capturePhoto"
                            :disabled="!cameraReady || hasCheckedOut || isTodayAbsence"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
                        >
                            Ambil Foto
                        </button>
                        <button
                            type="button"
                            @click="submitAttendance"
                            :disabled="isSubmitting || hasCheckedOut || isTodayAbsence"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
                        >
                            {{ isSubmitting ? 'Menyimpan...' : actionLabel }}
                        </button>
                        <button
                            type="button"
                            @click="startCamera"
                            class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            Buka Ulang Kamera
                        </button>
                    </div>

                    <div
                        v-if="message"
                        class="mt-4 rounded-lg px-4 py-3 text-sm font-medium"
                        :class="{
                            'bg-green-50 text-green-700': messageType === 'success',
                            'bg-red-50 text-red-700': messageType === 'error',
                            'bg-blue-50 text-blue-700': messageType === 'info',
                        }"
                    >
                        {{ message }}
                    </div>
                </div>

                <div class="space-y-6">
                <div class="bg-white rounded-xl shadow-md p-5">
                    <h2 class="text-lg font-semibold text-gray-900">Absensi Hari Ini</h2>
                    <dl class="mt-4 space-y-4">
                        <div>
                            <dt class="text-sm text-gray-500">Tanggal Server</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(serverTime) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jam Operasional Cabang</dt>
                            <dd class="font-semibold text-gray-900">
                                {{ formatTime(employee.branch?.open_time) }} - {{ formatTime(employee.branch?.close_time) }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Toleransi Terlambat</dt>
                            <dd class="font-semibold text-gray-900">{{ employee.branch?.late_tolerance_minutes ?? 0 }} menit</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jenis Absensi</dt>
                            <dd class="font-semibold text-gray-900">{{ currentAttendance?.attendance_type ?? 'Hadir' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jam Masuk</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(currentAttendance?.check_in) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Status Masuk</dt>
                            <dd class="font-semibold text-gray-900">
                                {{ currentAttendance?.attendance_status ?? '-' }}
                                <span v-if="currentAttendance?.late_minutes">({{ currentAttendance.late_minutes }} menit)</span>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jam Keluar</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(currentAttendance?.check_out) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Status Keluar</dt>
                            <dd class="font-semibold text-gray-900">
                                {{ currentAttendance?.checkout_status ?? '-' }}
                                <span v-if="currentAttendance?.early_leave_minutes">({{ currentAttendance.early_leave_minutes }} menit)</span>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Keterangan</dt>
                            <dd class="font-semibold text-gray-900 whitespace-pre-line">{{ currentAttendance?.attendance_note ?? '-' }}</dd>
                        </div>
                    </dl>
                </div>

                <div class="bg-white rounded-xl shadow-md p-5">
                    <h2 class="text-lg font-semibold text-gray-900">Sakit / Izin</h2>
                    <div class="mt-4 space-y-4">
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700">Tanggal</label>
                            <input
                                v-model="absenceForm.work_date"
                                type="date"
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            >
                        </div>
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700">Jenis</label>
                            <select
                                v-model="absenceForm.attendance_type"
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Pilih</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Izin">Izin</option>
                            </select>
                        </div>
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700">Keterangan</label>
                            <textarea
                                v-model="absenceForm.attendance_note"
                                rows="4"
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Masukkan keterangan sakit atau izin..."
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            @click="submitAbsence"
                            :disabled="isSubmittingAbsence"
                            class="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
                        >
                            {{ isSubmittingAbsence ? 'Mengirim...' : 'Kirim Data' }}
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
