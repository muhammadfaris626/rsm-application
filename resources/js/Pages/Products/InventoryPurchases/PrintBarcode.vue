<script setup>
import { onMounted, nextTick, computed } from "vue";
import QrcodeVue from 'qrcode.vue';

const props = defineProps({
    selectedCheckbox: {
        type: Array,
        required: true
    },
    jumlahCetak: {
        type: String,
        required: true
    }
});

const repeatedBarcodes = computed(() => {
    return props.selectedCheckbox.flatMap(data => Array(Number(props.jumlahCetak)).fill(data));
});

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            window.print();
        }, 1000);
    });
});
</script>

<template>
    <div class="page">
        <div class="barcode-container">
            <div v-for="(data, index) in repeatedBarcodes" :key="index" class="barcode-wrapper">
                <QrcodeVue :value="data" :size="99" level="H" render-as="svg" />
            </div>
        </div>
    </div>
</template>

<style>
@media print {
    @page {
        size: 50mm 30mm landscape; /* Perbesar ukuran agar muat 3 QR Code */
        margin: 0;
    }

    body, .page {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        margin-top: 5px;
    }

    .barcode-container {
        display: flex;
        flex-wrap: wrap; /* Agar QR Code turun ke bawah jika lebih dari 3 */
        justify-content: center; /* Pusatkan QR Code */
        align-items: center;
        max-width: 100%; /* Batasi agar tidak lebih dari 3 QR Code per baris */
        gap: 80px; /* Tambahkan jarak antar QR Code */
    }

    .barcode-wrapper {
        text-align: center;
        width: calc(100% / 4 - 5px); /* Maksimal 3 QR Code per baris */
        margin: 2px;
    }
}
</style>
