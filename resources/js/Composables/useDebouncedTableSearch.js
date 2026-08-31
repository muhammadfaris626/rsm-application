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

export function useDebouncedTableFilters(
    routeName,
    sources,
    parameters,
    only = ['fetchData', 'search'],
    delay = 350,
) {
    let filterTimer;

    watch(sources, () => {
        clearTimeout(filterTimer);

        filterTimer = setTimeout(() => {
            const url = new URL(route(routeName));

            Object.entries(parameters()).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    url.searchParams.set(key, value);
                }
            });

            router.visit(url, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only,
            });
        }, delay);
    });

    onBeforeUnmount(() => clearTimeout(filterTimer));
}
