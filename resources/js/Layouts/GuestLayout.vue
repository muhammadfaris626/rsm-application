<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="h-screen flex items-center justify-center bg-gray-100">

        <!-- <img :src="'images/background3.jpg'" class="absolute inset-0 w-full h-full bg-cover bg-center"> -->
        <!-- <div class="absolute inset-0 "></div> -->
        <div class="relative z-10 p-8 rounded-lg w-full max-w-md">
            <slot />
        </div>
    </div>
</template>
