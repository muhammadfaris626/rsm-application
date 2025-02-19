<script setup>
import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
import JsBarcode from "jsbarcode";
import { ref, onMounted, nextTick, computed } from 'vue';

const props = defineProps({
    selectedCheckbox: {
        type: Array
    },
    jumlahCetak: {
        type: String
    }
});

const barcodeCanvas = ref(null);

const repeatedBarcodes = computed(() => {
    return props.selectedCheckbox.flatMap(data => Array(Number(props.jumlahCetak)).fill(data));
});

onMounted(() => {
    nextTick(() => {
        repeatedBarcodes.value.forEach((data, index) => {
            const barcodeElement = document.getElementById(`barcode-${index}`);
            if (barcodeElement) {
                JsBarcode(barcodeElement, data, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 50,
                    displayValue: true,
                });
            }
        });
        // Trigger the print dialog after barcodes are generated
        document.body.style.backgroundColor = 'white';
        window.print();
    });
});
</script>

<template>
    <Head title="Cetak Barcode" />
    <div class="grid grid-cols-3 gap-4 m-5">
        <div v-for="(data, index) in repeatedBarcodes" :key="index" class="flex justify-center items-center">
            <svg :id="`barcode-${index}`" class="w-full h-20"></svg>
        </div>
    </div>
</template>
