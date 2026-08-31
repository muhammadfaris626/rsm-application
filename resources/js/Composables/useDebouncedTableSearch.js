import { onBeforeUnmount, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';

export function useDebouncedTableSearch(routeName, initialSearch = '', delay = 350) {
    const search = ref(initialSearch ?? '');
    let searchTimer;

    watch(search, (value) => {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            const url = new URL(route(routeName));

            if (value) {
                url.searchParams.set('search', value);
            }

            router.visit(url, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['fetchData', 'search'],
            });
        }, delay);
    });

    onBeforeUnmount(() => clearTimeout(searchTimer));

    return search;
}
