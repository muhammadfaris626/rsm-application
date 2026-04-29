<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch, onMounted } from 'vue';
    import { router, Head } from '@inertiajs/vue3';
    import VueMultiselect from "vue-multiselect";
    import TextInput from "@/Components/TextInput.vue";
    import VueApexCharts from 'vue3-apexcharts';

    const props = defineProps(['branches', 'sales', 'employeeActive', 'branchActive', 'expenditures', 'profile', 'userRoleVisitor', 'recentSales', 'recentOrders', 'topProducts', 'monthlyStats']);

    const selectBranch = ref(''), selectStartDate = ref(''), selectEndDate = ref('');
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
    const showFilters = ref(false);

    const hasActiveFilters = computed(() => {
        return selectBranch.value || selectStartDate.value || selectEndDate.value;
    });

    const clearFilters = () => {
        selectBranch.value = '';
        selectStartDate.value = '';
        selectEndDate.value = '';
    };

    const filterUrl = computed(() => {
        let url = new URL(route('dashboard'));
        if (optionBranch.value) {
            url.searchParams.append("branch", optionBranch.value.id);
        }
        if (optionStartDate.value && optionEndDate.value) {
            url.searchParams.append("start_date", optionStartDate.value);
            url.searchParams.append("end_date", optionEndDate.value);
        }
        return url;
    });

    watch(() => filterUrl.value, (updatedFilterUrl) => {
        router.visit(updatedFilterUrl, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    });

    onMounted(() => {
        if (window.location.search) {
            router.visit(route("dashboard"), {
                replace: true
            });
        }
    });

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    }

    // Calculate totals
    const totalOmzet = computed(() => {
        return (props.sales || []).reduce((sum, item) => sum + Number(item.total_price || 0), 0);
    });

    const totalPengeluaran = computed(() => {
        return (props.expenditures || []).reduce((sum, item) => sum + Number(item.total_cost || 0), 0);
    });

    const profit = computed(() => {
        return totalOmzet.value - totalPengeluaran.value;
    });

    const profitPercentage = computed(() => {
        if (totalOmzet.value === 0) return 0;
        return ((profit.value / totalOmzet.value) * 100).toFixed(1);
    });

    // Chart data for revenue vs expenses
    const revenueExpenseChart = computed(() => {
        const salesData = props.sales || [];
        const expenseData = props.expenditures || [];

        // Group by date
        const salesByDate = {};
        salesData.forEach(sale => {
            const date = new Date(sale.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            salesByDate[date] = (salesByDate[date] || 0) + Number(sale.total_price || 0);
        });

        const expensesByDate = {};
        expenseData.forEach(exp => {
            const date = new Date(exp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            expensesByDate[date] = (expensesByDate[date] || 0) + Number(exp.total_cost || 0);
        });

        const dates = [...new Set([...Object.keys(salesByDate), ...Object.keys(expensesByDate)])].sort();

        return {
            series: [{
                name: 'Omzet',
                data: dates.map(date => salesByDate[date] || 0)
            }, {
                name: 'Pengeluaran',
                data: dates.map(date => expensesByDate[date] || 0)
            }],
            chartOptions: {
                chart: {
                    type: 'area',
                    height: 350,
                    toolbar: { show: false },
                    zoom: { enabled: false }
                },
                dataLabels: { enabled: false },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3,
                    }
                },
                colors: ['#10b981', '#ef4444'],
                xaxis: {
                    categories: dates
                },
                legend: {
                    position: 'top'
                },
                grid: {
                    borderColor: '#e5e7eb',
                    strokeDashArray: 3
                }
            }
        };
    });

    // Pie chart for profit breakdown
    const profitChart = computed(() => {
        return {
            series: [totalOmzet.value, totalPengeluaran.value],
            chartOptions: {
                chart: {
                    type: 'donut',
                    height: 300
                },
                labels: ['Omzet', 'Pengeluaran'],
                colors: ['#10b981', '#ef4444'],
                legend: {
                    position: 'bottom'
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val.toFixed(1) + "%";
                    }
                }
            }
        };
    });
</script>

<template>
    <Head title="Beranda" />
    <AuthenticatedLayout>
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard111</h1>
                        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
                    </div>
                    <div class="flex items-center justify-end">
                        <button @click="showFilters = !showFilters"
                                class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                            <span v-if="hasActiveFilters" class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">{{
                                [selectBranch, selectStartDate, selectEndDate].filter(f => f).length
                            }}</span>
                        </button>
                    </div>
                </div>

                <!-- Filter Section -->
                <div v-show="showFilters" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div class="flex flex-wrap gap-4">
                        <!-- Branch Filter -->
                        <div v-if="userRoleVisitor != 'admin-branch'" class="flex flex-col flex-1 min-w-[200px] max-w-full">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Cabang</label>
                            <div class="flex-shrink-0">
                                <VueMultiselect
                                    v-model="selectBranch"
                                    :options="branches"
                                    :close-on-select="true"
                                    placeholder="Semua Cabang"
                                    label="branch_name"
                                    track-by="id"
                                    :clearable="true"
                                />
                            </div>
                        </div>

                        <!-- Start Date Filter -->
                        <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Dari Tanggal</label>
                            <div class="flex-shrink-0">
                                <TextInput
                                    id="startDate"
                                    type="date"
                                    class="block w-full"
                                    v-model="selectStartDate"
                                />
                            </div>
                        </div>

                        <!-- End Date Filter -->
                        <div class="flex flex-col flex-1 min-w-[200px] max-w-full">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap">Sampai Tanggal</label>
                            <div class="flex-shrink-0">
                                <TextInput
                                    id="endDate"
                                    type="date"
                                    class="block w-full"
                                    v-model="selectEndDate"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Clear Filters Button -->
                    <div v-if="hasActiveFilters" class="mt-4 flex justify-end">
                        <button @click="clearFilters"
                                class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Hapus Filter
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Omzet Card -->
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <span class="text-green-100 text-sm font-medium">OMZET</span>
                    </div>
                    <h3 class="text-3xl font-bold mb-1">{{ formatRupiah(totalOmzet) }}</h3>
                    <p class="text-green-100 text-sm">Total pendapatan</p>
                </div>

                <!-- Pengeluaran Card -->
                <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span class="text-red-100 text-sm font-medium">PENGELUARAN</span>
                    </div>
                    <h3 class="text-3xl font-bold mb-1">{{ formatRupiah(totalPengeluaran) }}</h3>
                    <p class="text-red-100 text-sm">Total biaya operasional</p>
                </div>

                <!-- Profit Card -->
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                        </div>
                        <span class="text-blue-100 text-sm font-medium">KEUNTUNGAN</span>
                    </div>
                    <h3 class="text-3xl font-bold mb-1">{{ formatRupiah(profit) }}</h3>
                    <p class="text-blue-100 text-sm">{{ profitPercentage }}% dari omzet</p>
                </div>

                <!-- Karyawan Aktif Card -->
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-white/20 rounded-lg p-3">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span class="text-purple-100 text-sm font-medium">KARYAWAN</span>
                    </div>
                    <h3 class="text-3xl font-bold mb-1">{{ employeeActive }}</h3>
                    <p class="text-purple-100 text-sm">Karyawan aktif</p>
                </div>
            </div>

            <!-- Additional Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Cabang Aktif -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Cabang Aktif</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ branchActive }}</p>
                        </div>
                        <div class="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3">
                            <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Average Transaction -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Rata-rata Transaksi</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {{ sales && sales.length > 0 ? formatRupiah(totalOmzet / sales.length) : formatRupiah(0) }}
                            </p>
                        </div>
                        <div class="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
                            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Total Transactions -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Transaksi</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ sales ? sales.length : 0 }}</p>
                        </div>
                        <div class="bg-teal-100 dark:bg-teal-900 rounded-lg p-3">
                            <svg class="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Revenue vs Expenses Chart -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Omzet vs Pengeluaran</h3>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Periode terpilih</span>
                    </div>
                    <VueApexCharts
                        v-if="revenueExpenseChart.series[0].data.length > 0"
                        type="area"
                        height="350"
                        :options="revenueExpenseChart.chartOptions"
                        :series="revenueExpenseChart.series"
                    />
                    <div v-else class="flex items-center justify-center h-64 text-gray-400">
                        <p>Tidak ada data untuk ditampilkan</p>
                    </div>
                </div>

                <!-- Profit Breakdown Chart -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Komposisi Keuangan</h3>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Omzet & Pengeluaran</span>
                    </div>
                    <VueApexCharts
                        v-if="totalOmzet > 0 || totalPengeluaran > 0"
                        type="donut"
                        height="350"
                        :options="profitChart.chartOptions"
                        :series="profitChart.series"
                    />
                    <div v-else class="flex items-center justify-center h-64 text-gray-400">
                        <p>Tidak ada data untuk ditampilkan</p>
                    </div>
                </div>
            </div>

            <!-- Recent Sales & Orders -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Sales -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Penjualan Terbaru</h3>
                    </div>
                    <div class="p-6">
                        <div v-if="recentSales && recentSales.length > 0" class="space-y-4">
                            <div v-for="(sale, index) in recentSales.slice(0, 5)" :key="index"
                                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div class="flex items-center gap-3">
                                    <div class="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                                        <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ sale.invoice_number || 'N/A' }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ sale.date || 'N/A' }}</p>
                                    </div>
                                </div>
                                <span class="font-semibold text-green-600 dark:text-green-400">{{ formatRupiah(sale.total_price || 0) }}</span>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gray-400">
                            <p>Tidak ada penjualan terbaru</p>
                        </div>
                    </div>
                </div>

                <!-- Recent Orders -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Permintaan Pesanan Terbaru</h3>
                    </div>
                    <div class="p-6">
                        <div v-if="recentOrders && recentOrders.length > 0" class="space-y-4">
                            <div v-for="(order, index) in recentOrders.slice(0, 5)" :key="index"
                                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div class="flex items-center gap-3">
                                    <div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ order.ro_number || 'N/A' }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.status || 'N/A' }}</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 text-xs font-semibold rounded-full"
                                      :class="{
                                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': order.status === 'Sedang diverifikasi',
                                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': order.status === 'Selesai',
                                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': order.status === 'Disetujui',
                                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': !order.status
                                      }">
                                    {{ order.status || 'Pending' }}
                                </span>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gray-400">
                            <p>Tidak ada permintaan pesanan terbaru</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Branch Profile -->
            <div v-if="profile != null" class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <div class="flex items-start gap-4">
                    <div class="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profil Cabang</h3>
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ profile.description || 'Tidak ada deskripsi' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
