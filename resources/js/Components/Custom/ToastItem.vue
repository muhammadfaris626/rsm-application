<script setup>
    import { onMounted } from 'vue';
    const props = defineProps({
        message: String,
        type: {
            type: String,
            default: 'success'
        },
        duration: {
            type: Number,
            default: 2000
        }
    });

    onMounted(() => {
        setTimeout(() => emit('remove'), props.duration);
    });

    const emit = defineEmits(['remove']);
</script>

<template>
    <div id="toast-success" class="flex items-center border-2 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-md dark:text-gray-800 dark:bg-gray-200" role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
            :class="{
                'bg-green-100 text-green-500 dark:bg-green-500 dark:text-green-200': type === 'success',
                'bg-red-100 text-red-500 dark:bg-red-500 dark:text-red-200': type === 'error'
            }">
            <!-- Icon sukses -->
            <svg v-if="type === 'success'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>

            <!-- Icon error -->
            <svg v-else class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l12 12M13 1L1 13"/>
            </svg>
        </div>
        <div class="ms-3 text-sm font-normal">{{ props.message }}</div>
        <button @click="emit('remove')" type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-200 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    </div>
</template>
