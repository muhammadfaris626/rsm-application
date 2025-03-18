<script setup>
    import { computed } from 'vue';
    import { Link } from '@inertiajs/vue3';
    const props = defineProps(["href", "active"]);
    const classes = computed(() =>
        props.active
            ? "flex items-center p-2 text-blue-500 font-bold rounded-lg group bg-white hover:bg-blue-400"
            : "flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white hover:text-blue-500 group"
    );
</script>
<template>
    <Link :href="href" :class="classes">
        <slot />
    </Link>
</template>
