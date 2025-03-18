<script setup>
    import { ref, onUnmounted } from 'vue';
    import { usePage, router } from '@inertiajs/vue3';
    import toast from '@/Composables/toast';
    import ToastItem from '@/Components/Custom/ToastItem.vue';

    const page = usePage();

    let removeFinishEventListener = router.on('finish', () => {
        if (page.props.toast) {
            toast.add({
                message: page.props.toast
            });
        }
    });

    onUnmounted(() => removeFinishEventListener());

    function remove(index) {
        toast.remove(index);
    }
</script>
<template>
    <TransitionGroup
        tag="div"
        enter-from-class="translate-x-full opacity-0"
        enter-active-class="duration-500"
        leave-active-class="duration-500"
        leave-to-class="translate-x-full opacity-0"
        class="fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs">
        <ToastItem
            v-for="(item, index) in toast.items"
            :key="item"
            :message="item.message.message"
            :type="item.message.type"
            :duration="3000"
            @remove="remove(index)"
        />
    </TransitionGroup>
</template>
