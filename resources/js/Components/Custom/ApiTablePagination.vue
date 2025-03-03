<template>

<nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Menampilkan
            <span class="font-semibold text-gray-900 dark:text-white">
                {{ pagination.from }} - {{ pagination.to }}
            </span>
            dari
            <span class="font-semibold text-gray-900 dark:text-white">
                {{ pagination.total }}
            </span>
        </span>
        <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li v-for="(link, index) in pagination.links" :key="link.label" class="text-white">
                <button
                    :key="index"
                    :disabled="!link.url"
                    :class="{
                        'flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': link.label == 'pagination.previous',
                        'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': link.label == 'pagination.next',
                        'flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white': link.active,
                        'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': link.url && !link.active
                    }"
                    @click="changePage(link.url)"
                >
                    <template v-if="link.label == 'pagination.previous'">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </template>
                    <template v-else-if="link.label == 'pagination.next'">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </template>
                    <template v-else>
                        {{ link.label }}
                    </template>
                </button>
                <!-- <div v-if="index == 0">
                    <button @click="changePage(link.url)" preserve-scroll :href="link.url ?? ''" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>
                <div v-else-if="index == pagination.links.length-1">
                    <button @click="changePage(link.url)" preserve-scroll :href="link.url ?? ''" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
                <div v-else>
                    <button @click="changePage(link.url)" v-if="link.active" preserve-scroll :href="link.url ?? ''" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                        {{ link.label }}
                    </button>
                    <button v-else preserve-scroll :href="link.url ?? ''" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        {{ link.label }}
                    </button>
                </div>
            </li> -->
            </li>
        </ul>
    </nav>
</template>

<script setup>
const props = defineProps({
    pagination: Object,
});
const emit = defineEmits(['page-change']);

const changePage = (url) => {
    if (url) {
        const page = new URL(url).searchParams.get("page");
        emit("page-change", Number(page));
    }
};
</script>
