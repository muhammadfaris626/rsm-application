<script setup>
    import { computed } from 'vue';
    const props = defineProps(["status"]);
    const status = computed(() => props.status);
</script>
<template>
    <th v-if="status === 'number'" scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <slot />
    </th>
    <td v-else-if="status === 'record'" class="px-6 py-2">
        <slot />
    </td>
    <td v-else-if="status === 'action'" class="px-6 py-2 text-right">
        <slot />
    </td>
</template>
