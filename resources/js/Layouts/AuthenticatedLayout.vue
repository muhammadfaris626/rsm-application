<script setup>
import { ref } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.vue';
import { Link } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import { initFlowbite } from 'flowbite';
import Sidebar from '@/Components/Partials/Sidebar.vue';
import Navbar from '@/Components/Partials/Navbar.vue';
import Toast from '@/Components/Custom/Toast.vue';

// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})

const showingNavigationDropdown = ref(false);
</script>

<template>
    <!-- Navbar -->
    <!-- <Navbar /> -->
    <!-- Sidebar -->
    <Sidebar />
    <!-- Content -->
    <Toast />
    <div class="sm:ml-64">
        <div class="p-4">
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>
