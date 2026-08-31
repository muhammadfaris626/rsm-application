<script setup>
    import { onBeforeUnmount, onMounted, ref } from "vue";
    import { initFlowbite } from "flowbite";
    import Sidebar from "@/Components/Partials/Sidebar.vue";
    import Toast from "@/Components/Custom/Toast.vue";
    import LoadingPopup from "@/Components/Custom/LoadingPopup.vue";
    import { router } from "@inertiajs/vue3";

    const isLoading = ref(false);
    const removeStartListener = router.on("start", () => {
        isLoading.value = true;
    });
    const removeFinishListener = router.on("finish", () => {
        isLoading.value = false;
    });

    onMounted(() => {
        initFlowbite();
    });

    onBeforeUnmount(() => {
        removeStartListener();
        removeFinishListener();
    });
</script>

<template>
    <Sidebar />
    <Toast />
    <LoadingPopup :loading="isLoading" />
    <div class="sm:ml-64">
        <div class="p-4">
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>
