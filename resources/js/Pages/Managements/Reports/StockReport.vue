<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const props = defineProps({
    reportType: String,
    title: String,
    rows: Array,
    filters: Object,
    branches: Array,
    totals: Object,
});

const startDate = ref(props.filters.start_date);
const endDate = ref(props.filters.end_date);
const branch = ref(props.filters.branch ?? '');
const isBranch = computed(() => props.reportType === 'branch');
const indexRoute = computed(() => isBranch.value ? 'branchStockReports.index' : 'centerStockReports.index');
const excelRoute = computed(() => isBranch.value ? 'branchStockReports.excel' : 'centerStockReports.excel');
const pdfRoute = computed(() => isBranch.value ? 'branchStockReports.pdf' : 'centerStockReports.pdf');

const query = () => ({
    start_date: startDate.value,
    end_date: endDate.value,
    ...(isBranch.value && branch.value ? { branch: branch.value } : {}),
});

const applyFilter = () => router.get(route(indexRoute.value), query(), { preserveState: true, preserveScroll: true, replace: true });
const download = (routeName) => window.location.href = route(routeName, query());
const number = (value) => new Intl.NumberFormat('id-ID').format(value ?? 0);
const date = (value) => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
</script>

<template>
    <Head :title="title" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <div :class="isBranch ? 'from-blue-600 to-indigo-700' : 'from-emerald-600 to-teal-700'" class="rounded-xl bg-gradient-to-r p-6 text-white shadow-lg">
                <h1 class="text-2xl font-bold">{{ title }}</h1>
                <p class="mt-1 text-sm text-white/80">
                    {{ isBranch ? 'Pantau stok awal, tambahan, pemakaian, kerusakan, dan stok akhir setiap cabang.' : 'Pantau stok awal, pembelian, dan stok akhir gudang pusat.' }}
                </p>
            </div>

            <div class="rounded-xl bg-white p-5 shadow-md">
                <form class="grid grid-cols-1 items-end gap-4 md:grid-cols-4" @submit.prevent="applyFilter">
                    <label class="block text-sm font-medium text-gray-700">Tanggal mulai
                        <input v-model="startDate" required type="date" class="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                    </label>
                    <label class="block text-sm font-medium text-gray-700">Tanggal selesai
                        <input v-model="endDate" :min="startDate" required type="date" class="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                    </label>
                    <label v-if="isBranch" class="block text-sm font-medium text-gray-700">Cabang
                        <select v-model="branch" class="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <option value="">Semua Cabang</option>
                            <option v-for="item in branches" :key="item.id" :value="item.id">{{ item.branch_name }}</option>
                        </select>
                    </label>
                    <button type="submit" class="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900">Tampilkan Laporan</button>
                </form>

                <div class="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                    <button type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="download(pdfRoute)">Unduh PDF</button>
                    <button type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" @click="download(excelRoute)">Ekspor Excel</button>
                    <span class="self-center text-sm text-gray-500">{{ rows.length }} baris data</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
                <div v-for="(value, key) in totals" :key="key" class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p class="text-xs uppercase tracking-wide text-gray-500">{{ ({ initial_stock: 'Stok Awal', additional_stock: 'Tambahan Stok', used_stock: 'Terpakai', damaged_stock: 'Rusak', purchased_stock: 'Pembelian', final_stock: 'Stok Akhir' })[key] }}</p>
                    <p class="mt-1 text-xl font-bold text-gray-900">{{ number(value) }}</p>
                </div>
            </div>

            <div class="overflow-hidden rounded-xl bg-white shadow-md">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600">
                        <thead :class="isBranch ? 'bg-blue-700' : 'bg-emerald-700'" class="text-xs uppercase text-white">
                            <tr>
                                <th class="px-4 py-3 text-center">No</th>
                                <template v-if="isBranch">
                                    <th class="px-4 py-3">Tanggal</th><th class="px-4 py-3">No. Permintaan</th><th class="px-4 py-3">Cabang</th>
                                </template>
                                <th class="px-4 py-3">Kategori</th><th class="px-4 py-3">Barang</th>
                                <th class="px-4 py-3 text-right">Stok Awal</th>
                                <th v-if="isBranch" class="px-4 py-3 text-right">Tambahan Stok</th>
                                <th v-else class="px-4 py-3 text-right">Pembelian</th>
                                <template v-if="isBranch"><th class="px-4 py-3 text-right">Terpakai</th><th class="px-4 py-3 text-right">Rusak</th></template>
                                <th class="px-4 py-3 text-right">Stok Akhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in rows" :key="`${row.reference ?? row.product}-${index}`" class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                                <template v-if="isBranch"><td class="whitespace-nowrap px-4 py-3">{{ date(row.date) }}</td><td class="whitespace-nowrap px-4 py-3">{{ row.reference }}</td><td class="px-4 py-3">{{ row.branch }}</td></template>
                                <td class="px-4 py-3">{{ row.category }}</td><td class="px-4 py-3 font-medium text-gray-900">{{ row.product }}</td>
                                <td class="px-4 py-3 text-right">{{ number(row.initial_stock) }}</td>
                                <td class="px-4 py-3 text-right">{{ number(isBranch ? row.additional_stock : row.purchased_stock) }}</td>
                                <template v-if="isBranch"><td class="px-4 py-3 text-right">{{ number(row.used_stock) }}</td><td class="px-4 py-3 text-right">{{ number(row.damaged_stock) }}</td></template>
                                <td class="px-4 py-3 text-right font-semibold">{{ number(row.final_stock) }}</td>
                            </tr>
                            <tr v-if="rows.length === 0"><td :colspan="isBranch ? 11 : 6" class="px-4 py-12 text-center text-gray-500">Tidak ada data pada periode ini.</td></tr>
                        </tbody>
                        <tfoot class="bg-gray-100 font-bold text-gray-900">
                            <tr>
                                <td :colspan="isBranch ? 6 : 3" class="px-4 py-3 text-right">TOTAL</td>
                                <td class="px-4 py-3 text-right">{{ number(totals.initial_stock) }}</td>
                                <td class="px-4 py-3 text-right">{{ number(isBranch ? totals.additional_stock : totals.purchased_stock) }}</td>
                                <template v-if="isBranch"><td class="px-4 py-3 text-right">{{ number(totals.used_stock) }}</td><td class="px-4 py-3 text-right">{{ number(totals.damaged_stock) }}</td></template>
                                <td class="px-4 py-3 text-right">{{ number(totals.final_stock) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <p v-if="!isBranch" class="text-xs text-gray-500">Stok awal dan akhir dihitung secara historis dengan memperhitungkan pembelian, pengiriman ke cabang, dan retur yang selesai diproses.</p>
        </div>
    </AuthenticatedLayout>
</template>
