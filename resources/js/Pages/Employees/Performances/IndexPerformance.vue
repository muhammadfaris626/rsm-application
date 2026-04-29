<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { computed, ref, watch } from 'vue';
    import { Head, router, usePage } from '@inertiajs/vue3';
    import Table from '@/Components/Custom/Table.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';

    defineProps({
        fetchData: {
            type: Object,
            default: () => ({ data: [] }),
        },
        summary: {
            type: Object,
            default: () => ({}),
        },
    });

    const search = ref(usePage().props.search || '');
    const pageNumber = ref(1);
    const searchUrl = computed(() => {
        const url = new URL(route('performances.index'));
        url.searchParams.append('page', pageNumber.value);

        if (search.value) {
            url.searchParams.append('search', search.value);
        }

        return url;
    });

    watch(searchUrl, (updatedSearchUrl) => {
        router.visit(updatedSearchUrl, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    });
</script>

<template>
    <Head title="Kinerja" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Kinerja</h1>
                        <p class="text-emerald-100 mt-1">Ringkasan aktivitas karyawan bulan berjalan</p>
                    </div>
                    <div class="hidden md:block bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow-md p-4">
                    <p class="text-sm text-gray-500">Karyawan Aktif</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ summary.active_employees || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-4">
                    <p class="text-sm text-gray-500">Absensi Bulan Ini</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ summary.attendance_this_month || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-4">
                    <p class="text-sm text-gray-500">Total Mutasi</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ summary.mutations || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-4">
                    <p class="text-sm text-gray-500">Total Pemberhentian</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ summary.terminations || 0 }}</p>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md p-4">
                <div class="w-full md:w-1/3">
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            v-model="search"
                            type="text"
                            class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-4 py-2.5 transition-all duration-200 placeholder-gray-400"
                            placeholder="Cari nomor atau nama karyawan..."
                        >
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow class="bg-emerald-500">
                            <TableHeaderCell class="text-white">NO</TableHeaderCell>
                            <TableHeaderCell class="text-white">NOMOR KARYAWAN</TableHeaderCell>
                            <TableHeaderCell class="text-white">NAMA</TableHeaderCell>
                            <TableHeaderCell class="text-white">CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">STATUS</TableHeaderCell>
                            <TableHeaderCell class="text-white">ABSENSI</TableHeaderCell>
                            <TableHeaderCell class="text-white">MUTASI</TableHeaderCell>
                            <TableHeaderCell class="text-white">PEMBERHENTIAN</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in fetchData.data" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'">{{ (fetchData.from || 1) + index }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.employee_number }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.name }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_name || '-' }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.status }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.attendance_count }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.mutation_count }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.termination_count }}</TableDataCell>
                        </TableRow>
                    </template>
                    <template #pagination>
                        <div class="bg-gray-50 px-4 py-3">
                            <TablePagination :pagination="fetchData" />
                        </div>
                    </template>
                </Table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
