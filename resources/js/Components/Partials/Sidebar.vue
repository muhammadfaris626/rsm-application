<script setup>
    import { usePermission } from '@/Composables/permissions';
    import SidebarLink from '@/Components/Custom/SidebarLink.vue'
    import NavigationLink from '@/Components/Custom/NavigationLink.vue';
    import { Link } from '@inertiajs/vue3';
    import { usePage } from "@inertiajs/vue3";
    import { useNotifications } from '@/Composables/useNotifications';
    import { computed } from 'vue';
    const { hasPermission } = usePermission();
    const countPermissions = usePage().props.auth.user.permissions.length;
    const isRouteActive = (routes) => {
        return routes.some(route => window.route().current(route));
    }
    const isRouteEnable = (routes) => {
        const routeValues = Object.values(usePage().props.auth.user.permissions);
        const routeEnableValues = Object.values(routes);
        return routeEnableValues.some(route => routeValues.includes(route));
    }
    const { notificationCount, orderRequestCount, returnRequestCount, fetchNotifications } = useNotifications();
    // const computedNotificationCount = computed(() => notificationCount.value);
</script>

<template>
    <button type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
    </button>

    <aside class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto bg-blue-500 dark:bg-gray-800">
            <a href="https://flowbite.com/" class="flex justify-center items-center ps-2.5 mb-5">
                <img :src="'/images/rsm-putih.svg'" class="h-16 me-3" />
            </a>
            <ul class="space-y-2 font-medium">
                <li>
                    <NavigationLink :href="route('dashboard')" :active="isRouteActive(['dashboard', 'home'])">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span class="ms-3">Beranda</span>
                    </NavigationLink>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'branch-product: menu', 'inventory-purchase: menu', 'request-order: menu', 'sale: menu', 'center-stock: menu', 'request-return: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="product" data-collapse-toggle="product">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Produk</span>
                        <span v-if="notificationCount > 0" class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white bg-red-500 rounded-full dark:bg-blue-900 dark:text-blue-300 mr-2">{{ notificationCount }}</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="product" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'branchProducts.index', 'inventoryPurchases.index', 'inventoryPurchases.create', 'inventoryPurchases.edit', 'inventoryPurchases.show',
                                'requestOrders.index', 'requestOrders.create', 'requestOrders.edit',
                                'requestReturns.index', 'requestReturns.create', 'requestReturns.edit',
                                'sales.index', 'sales.create', 'sales.edit', 'centerProducts.index',
                            ]) }"
                    >
                        <template v-if="hasPermission('sale: menu')">
                            <li>
                                <SidebarLink :href="route('sales.index')" :active="isRouteActive(['sales.index', 'sales.create', 'sales.edit'])">
                                    Penjualan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('inventory-purchase: menu')">
                            <li>
                                <SidebarLink :href="route('inventoryPurchases.index')" :active="isRouteActive(['inventoryPurchases.index', 'inventoryPurchases.create', 'inventoryPurchases.edit', 'inventoryPurchases.show'])">
                                    Pembelian Persediaan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('request-order: menu')">
                            <li>
                                <SidebarLink :href="route('requestOrders.index')" :active="isRouteActive(['requestOrders.index', 'requestOrders.create', 'requestOrders.edit'])">
                                    Permintaan Stok
                                    <span v-if="orderRequestCount > 0" class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white bg-red-500 rounded-full dark:bg-blue-900 dark:text-blue-300 mr-2">{{ orderRequestCount }}</span>
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('request-return: menu')">
                            <li>
                                <SidebarLink :href="route('requestReturns.index')" :active="isRouteActive(['requestReturns.index', 'requestReturns.create', 'requestReturns.edit'])">
                                    Permintaan Return
                                    <span v-if="returnRequestCount > 0" class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white bg-red-500 rounded-full dark:bg-blue-900 dark:text-blue-300 mr-2">{{ returnRequestCount }}</span>
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('branch-product: menu')">
                            <li>
                                <SidebarLink :href="route('branchProducts.index')" :active="isRouteActive(['branchProducts.index'])">
                                    Barang Cabang
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('center-stock: menu')">
                            <li>
                                <SidebarLink :href="route('centerProducts.index')" :active="isRouteActive(['centerProducts.index'])">
                                    Barang Pusat
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'operational-center: menu', 'operational-branch: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="operational" data-collapse-toggle="operational">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                        </svg>

                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Operasional</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="operational" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'operationalCenters.index', 'operationalBranches.index'
                            ]) }"
                    >
                        <template v-if="hasPermission('operational-center: menu')">
                            <li>
                                <SidebarLink :href="route('operationalCenters.index')" :active="isRouteActive(['operationalCenters.index'])">
                                    Pusat
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('operational-branch: menu')">
                            <li>
                                <SidebarLink :href="route('operationalBranches.index')" :active="isRouteActive(['operationalBranches.index'])">
                                    Cabang
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'management-structure: menu', 'report: menu', 'report-branch: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="management" data-collapse-toggle="management">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Manajemen</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="management" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'managementStructures.index', 'reports.index', 'reportBranches.index'
                            ]) }"
                    >
                        <template v-if="hasPermission('report-branch: menu')">
                            <li>
                                <SidebarLink :href="route('reportBranches.index')" :active="isRouteActive(['reportBranches.index'])">
                                    Laporan Cabang
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('report: menu')">
                            <li>
                                <SidebarLink :href="route('reports.index')" :active="isRouteActive(['reports.index'])">
                                    Laporan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('management-structure: menu')">
                            <li>
                                <SidebarLink :href="route('managementStructures.index')" :active="isRouteActive(['managementStructures.index'])">
                                    Struktur Manajemen
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'performance: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="karyawan" data-collapse-toggle="karyawan">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Karyawan</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="karyawan" class="py-2"
                        :class="{ hidden: !isRouteActive([
                            'performances.index'
                        ]) }"
                    >
                        <li>
                            <SidebarLink :href="'#'">
                                Absensi
                            </SidebarLink>
                        </li>
                        <template v-if="hasPermission('performance: menu')">
                            <li>
                                <SidebarLink :href="'#'">
                                    Kinerja
                                </SidebarLink>
                            </li>
                        </template>


                        <li>
                            <SidebarLink :href="'#'">
                                Profil
                            </SidebarLink>
                        </li>
                        <li>
                            <SidebarLink :href="'#'">
                                Mutasi
                            </SidebarLink>
                        </li>
                        <li>
                            <SidebarLink :href="'#'">
                                Pemberhentian
                            </SidebarLink>
                        </li>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'product-category: menu', 'product: menu', 'employee: menu', 'branch: menu', 'expenditure: menu', 'position: menu', 'supplier: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="database" data-collapse-toggle="database">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Database</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="database" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'productCategories.index', 'products.index', 'employees.index', 'branches.index', 'expenditures.index', 'positions.index',
                                'suppliers.index'
                            ]) }"
                    >
                        <template v-if="hasPermission('product-category: menu')">
                            <li>
                                <SidebarLink :href="route('productCategories.index')" :active="isRouteActive(['productCategories.index'])">
                                    Kategori Barang
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('product: menu')">
                            <li>
                                <SidebarLink :href="route('products.index')" :active="isRouteActive(['products.index'])">
                                    Barang
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('employee: menu')">
                            <li>
                                <SidebarLink :href="route('employees.index')" :active="isRouteActive(['employees.index'])">
                                    Karyawan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('branch: menu')">
                            <li>
                                <SidebarLink :href="route('branches.index')" :active="isRouteActive(['branches.index'])">
                                    Cabang
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('expenditure: menu')">
                            <li>
                                <SidebarLink :href="route('expenditures.index')" :active="isRouteActive(['expenditures.index'])">
                                    Pengeluaran
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('position: menu')">
                            <li>
                                <SidebarLink :href="route('positions.index')" :active="isRouteActive(['positions.index'])">
                                    Jabatan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('supplier: menu')">
                            <li>
                                <SidebarLink :href="route('suppliers.index')" :active="isRouteActive(['suppliers.index'])">
                                    Supplier
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'user: menu', 'role: menu', 'permission: menu', 'approval-type: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-white hover:text-blue-500" aria-controls="pengaturan" data-collapse-toggle="pengaturan">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-bluee-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Pengaturan</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="pengaturan" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'users.index', 'users.edit', 'users.create',
                                'roles.index', 'roles.edit', 'roles.create', 'roles.show',
                                'permissions.index', 'permissions.edit', 'permissions.create',
                                'approvalTypes.index', 'approvalTypes.edit', 'approvalTypes.create'
                            ]) }"
                    >
                        <template v-if="hasPermission('user: menu')">
                            <li>
                                <SidebarLink :href="route('users.index')" :active="isRouteActive(['users.index', 'users.edit', 'users.create'])">
                                    Akun
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('role: menu')">
                            <li>
                                <SidebarLink :href="route('roles.index')" :active="isRouteActive(['roles.index', 'roles.edit', 'roles.create', 'roles.show'])">
                                    Peran
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('permission: menu')">
                            <li>
                                <SidebarLink :href="route('permissions.index')" :active="isRouteActive(['permissions.index', 'permissions.edit', 'permissions.create'])">
                                    Perizinan
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('approval-type: menu')">
                            <li>
                                <SidebarLink :href="route('approvalTypes.index')" :active="isRouteActive(['approvalTypes.index', 'approvalTypes.edit', 'approvalTypes.create'])">
                                    Jenis Persetujuan
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li>
                    <Link :href="route('logout')" method="post" as="button" class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white hover:text-blue-800 group w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 group-hover:text-blue-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        <span class="ms-3">Keluar</span>
                    </Link>
                </li>
            </ul>
        </div>
    </aside>
</template>
