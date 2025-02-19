<script setup>
    import { computed } from 'vue';
    import { Link } from '@inertiajs/vue3';

    const props = defineProps(["href", "active"]);

    const classes = computed(() =>
        props.active
            ? "flex items-center w-full p-1 text-blue-500 font-bold transition duration-75 rounded-lg pl-10 group bg-white hover:bg-blue-400"
            : "flex items-center w-full p-1 text-white transition duration-75 rounded-lg pl-10 group hover:bg-white hover:text-blue-500"
    );

</script>
<template>
    <Link :href="href" :class="classes">
        <slot />
    </Link>
</template>
