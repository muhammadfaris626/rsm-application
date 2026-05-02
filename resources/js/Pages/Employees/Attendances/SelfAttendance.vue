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
const cameraReady = ref(false);
const cameraError = ref('');
const currentAttendance = ref(props.todayAttendance);

const hasCheckedIn = computed(() => Boolean(currentAttendance.value?.check_in));
const hasCheckedOut = computed(() => Boolean(currentAttendance.value?.check_out));
const actionLabel = computed(() => {
    if (!hasCheckedIn.value) return 'Absen Masuk';
    if (!hasCheckedOut.value) return 'Absen Keluar';
    return 'Absensi Hari Ini Selesai';
});

const statusLabel = computed(() => {
    if (!hasCheckedIn.value) return 'Belum absen';
    if (!hasCheckedOut.value) return 'Sudah absen masuk';
    return 'Sudah absen lengkap';
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
            video: { facingMode: 'user' },
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

    const width = video.value.videoWidth || 640;
    const height = video.value.videoHeight || 480;
    canvas.value.width = width;
    canvas.value.height = height;

    const context = canvas.value.getContext('2d');
    context.drawImage(video.value, 0, 0, width, height);

    capturedPhoto.value = canvas.value.toDataURL('image/jpeg', 0.9);
    photoBlob.value = await new Promise(resolve => canvas.value.toBlob(resolve, 'image/jpeg', 0.9));
    setMessage('Foto berhasil diambil.', 'success');
};

const submitAttendance = async () => {
    if (!props.employee) {
        setMessage('Akun ini belum terhubung dengan data karyawan.', 'error');
        return;
    }

    if (hasCheckedOut.value) {
        setMessage('Absensi hari ini sudah lengkap.', 'info');
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

    try {
        const response = await axios.post('/api/attendance', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessage(response.data?.message || 'Absensi berhasil disimpan.', response.data?.status === 'completed' ? 'info' : 'success');
        photoBlob.value = null;
        capturedPhoto.value = '';

        window.location.reload();
    } catch (error) {
        setMessage(error.response?.data?.message || 'Absensi gagal disimpan.', 'error');
    } finally {
        isSubmitting.value = false;
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
                <p class="text-gray-600 mt-1">Pastikan username user sama dengan nomor karyawan.</p>
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
                                'bg-gray-100 text-gray-700': !hasCheckedIn,
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

                    <div class="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                            type="button"
                            @click="capturePhoto"
                            :disabled="!cameraReady || hasCheckedOut"
                            class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
                        >
                            Ambil Foto
                        </button>
                        <button
                            type="button"
                            @click="submitAttendance"
                            :disabled="isSubmitting || hasCheckedOut"
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

                <div class="bg-white rounded-xl shadow-md p-5">
                    <h2 class="text-lg font-semibold text-gray-900">Absensi Hari Ini</h2>
                    <dl class="mt-4 space-y-4">
                        <div>
                            <dt class="text-sm text-gray-500">Tanggal Server</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(serverTime) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jam Masuk</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(currentAttendance?.check_in) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-gray-500">Jam Keluar</dt>
                            <dd class="font-semibold text-gray-900">{{ formatDateTime(currentAttendance?.check_out) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
