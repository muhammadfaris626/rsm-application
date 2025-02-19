<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import { usePage, useForm, router, Head } from '@inertiajs/vue3';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    defineProps(['fetchData', 'branch', 'tanggalMulai', 'tanggalSelesai']);
    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    }
    const totalOmzet = computed(() => {
        return usePage().props.fetchData.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }
    const printPage = () => {
        document.body.style.backgroundColor = 'white';
        window.print();
    }
</script>
<style scoped>
/* CSS untuk menyembunyikan tombol print saat dalam mode print */
@media print {
    .print\:hidden {
        display: none;
    }

}
</style>
<template>
    <Head title="Cetak" />
    <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
        <div class="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
                <img :src="'/images/rsm-merah.png'" class="h-20">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-neutral-200">Laporan Omzet</h2>
            </div>
            <div class="inline-flex gap-x-2">
                <!-- <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Simpan PDF
                </a> -->
                <button @click="printPage" class="print:hidden py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    Cetak
                </button>
            </div>
        </div>
        <div class="grid md:grid-cols-2">
            <div>
                <div class="grid">
                    <dl class="flex flex-col sm:flex-row gap-x-3 text-sm">
                        <dt class="min-w-36 max-w-[200px] text-gray-500 dark:text-neutral-500">
                        Nama Cabang
                        </dt>
                        <dd class="font-medium text-gray-800 dark:text-neutral-200">
                            <span class="block font-semibold">: {{ branch }}</span>
                        </dd>
                    </dl>

                    <dl class="flex flex-col sm:flex-row gap-x-3 text-sm">
                        <dt class="min-w-36 max-w-[200px] text-gray-500 dark:text-neutral-500">
                        Dari Tanggal
                        </dt>
                        <dd class="font-medium text-gray-800 dark:text-neutral-200">
                        <span class="block font-semibold">: {{ formatDate(tanggalMulai) }}</span>
                        </dd>
                    </dl>
                    <dl class="flex flex-col sm:flex-row gap-x-3 text-sm">
                        <dt class="min-w-36 max-w-[200px] text-gray-500 dark:text-neutral-500">
                        Sampai Tanggal
                        </dt>
                        <dd class="font-medium text-gray-800 dark:text-neutral-200">
                        <span class="block font-semibold">: {{ formatDate(tanggalSelesai) }}</span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="mt-6 border border-gray-200 rounded-lg dark:border-neutral-700 bg-white">
            <Table>
                <template #header>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell v-if="branch == 'SEMUA CABANG'">CABANG</TableHeaderCell>
                    <TableHeaderCell>TANGGAL</TableHeaderCell>
                    <TableHeaderCell>BARANG</TableHeaderCell>
                    <TableHeaderCell>HARGA</TableHeaderCell>
                    <TableHeaderCell>JUMLAH</TableHeaderCell>
                    <TableHeaderCell>TOTAL</TableHeaderCell>
                </template>
                <template #default>
                    <TableRow v-for="(data, index) in fetchData" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <TableDataCell :status="'number'">{{ index + 1 }}</TableDataCell>
                        <TableDataCell v-if="branch == 'SEMUA CABANG'" :status="'record'">{{ data.branch_product.branch.branch_name }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ formatDate(data.updated_at) }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ data.branch_product.product.product_name }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ formatRupiah(data.price) }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ data.quantity }}</TableDataCell>
                        <TableDataCell :status="'record'">{{ formatRupiah(data.total_price) }}</TableDataCell>
                    </TableRow>
                </template>
            </Table>
        </div>
        <div class="mt-8 flex sm:justify-end">
            <div class="w-full max-w-2xl sm:text-end space-y-2">
                <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                    <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
                        <dt class="col-span-3 text-gray-500 text-xl">TOTAL OMZET :</dt>
                        <dd class="col-span-2 font-bold text-gray-800 text-2xl">{{ formatRupiah(totalOmzet) }}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
