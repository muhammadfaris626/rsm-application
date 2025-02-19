<script setup>
    import { usePermission } from '@/Composables/permissions';
    import SidebarLink from '@/Components/Custom/SidebarLink.vue'
    import NavigationLink from '@/Components/Custom/NavigationLink.vue';
    import { Link } from '@inertiajs/vue3';
    import { usePage } from "@inertiajs/vue3";
    const { hasPermission } = usePermission();
    const countPermissions = usePage().props.auth.user.permissions.length;
</script>

<script>
    export default {
        methods: {
            isRouteActive(routes) {
                return routes.some(route => this.route().current(route));
            },
            isRouteEnable(routes) {
                const routeValues = Object.values(usePage().props.auth.user.permissions);
                const routeEnableValues = Object.values(routes);
                return routeEnableValues.some(route => routeValues.includes(route));
            }
        }
    }
</script>

<template>
    <aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul class="font-medium">
                <!-- <li>
                    <NavigationLink :href="route('profile.edit')" :active="isRouteActive(['profile.edit'])">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span class="ms-3">Profile</span>
                    </NavigationLink>
                </li> -->
                <li>
                    <NavigationLink :href="route('dashboard')" :active="isRouteActive(['dashboard', 'home'])">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span class="ms-3">Dashboard</span>
                    </NavigationLink>
                </li>
                <template v-if="hasPermission('report: menu')">
                    <li>
                        <NavigationLink :href="route('reports.index')" :active="isRouteActive(['reports.index', 'reports.databaseTraining', 'reports.recapitulationModule', 'reports.finalReports'])">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                            <span class="ms-3">Reports</span>
                        </NavigationLink>
                    </li>
                </template>

                <li
                    :class="{ hidden: !isRouteEnable([
                        'employee: menu', 'count: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="employees" data-collapse-toggle="employees">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Employees</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="employees" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'employees.index', 'employees.create', 'employees.edit',
                                'number-of-employees.index'
                            ]) }"
                    >
                        <template v-if="hasPermission('employee: menu')">
                            <li>
                                <SidebarLink :href="route('employees.index')" :active="isRouteActive(['employees.index', 'employees.create', 'employees.edit'])">
                                    Employee Information
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('count: menu')">
                            <li>
                                <SidebarLink :href="route('number-of-employees.index')" :active="isRouteActive(['number-of-employees.index'])">
                                    Number Of Employees
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'course: menu', 'lesson: menu', 'test: menu', 'question: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="trainings" data-collapse-toggle="trainings">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Trainings</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="trainings" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'courses.index', 'courses.create', 'courses.edit',
                                'lessons.index', 'lessons.create', 'lessons.edit',
                                'tests.index', 'tests.create', 'tests.edit',
                                'questions.index', 'questions.create', 'questions.edit'
                            ]) }"
                    >
                        <template v-if="hasPermission('course: menu')">
                            <li>
                                <SidebarLink :href="route('courses.index')" :active="isRouteActive(['courses.index', 'courses.create', 'courses.edit'])">
                                    Courses
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('lesson: menu')">
                            <li>
                                <SidebarLink :href="route('lessons.index')" :active="isRouteActive(['lessons.index', 'lessons.create', 'lessons.edit'])">
                                    Lessons
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('test: menu')">
                            <li>
                                <SidebarLink :href="route('tests.index')" :active="isRouteActive(['tests.index', 'tests.create', 'tests.edit'])">
                                    Tests
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('question: menu')">
                            <li>
                                <SidebarLink :href="route('questions.index')" :active="isRouteActive(['questions.index', 'questions.create', 'questions.edit'])">
                                    Questions
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <li
                    :class="{ hidden: !isRouteEnable([
                        'user: menu', 'role: menu', 'permission: menu', 'department: menu', 'location: menu', 'position: menu'
                    ]) }"
                >
                    <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="pengaturan" data-collapse-toggle="pengaturan">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Settings</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="pengaturan" class="py-2"
                        :class="{ hidden: !isRouteActive([
                                'users.index', 'users.edit', 'users.create',
                                'roles.index', 'roles.edit', 'roles.create', 'roles.show',
                                'permissions.index', 'permissions.edit', 'permissions.create',
                                'departments.index', 'departments.edit', 'departments.create',
                                'locations.index', 'positions.index'
                            ]) }"
                    >
                        <template v-if="hasPermission('user: menu')">
                            <li>
                                <SidebarLink :href="route('users.index')" :active="isRouteActive(['users.index', 'users.edit', 'users.create'])">
                                    Users
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('role: menu')">
                            <li>
                                <SidebarLink :href="route('roles.index')" :active="isRouteActive(['roles.index', 'roles.edit', 'roles.create', 'roles.show'])">
                                    Roles
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('permission: menu')">
                            <li>
                                <SidebarLink :href="route('permissions.index')" :active="isRouteActive(['permissions.index', 'permissions.edit', 'permissions.create'])">
                                    Permissions
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('department: menu')">
                            <li>
                                <SidebarLink :href="route('departments.index')" :active="isRouteActive(['departments.index', 'departments.edit', 'departments.create'])">
                                    Departments
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('location: menu')">
                            <li>
                                <SidebarLink :href="route('locations.index')" :active="isRouteActive(['locations.index'])">
                                    Work Locations
                                </SidebarLink>
                            </li>
                        </template>
                        <template v-if="hasPermission('position: menu')">
                            <li>
                                <SidebarLink :href="route('positions.index')" :active="isRouteActive(['positions.index'])">
                                    Positions
                                </SidebarLink>
                            </li>
                        </template>
                    </ul>
                </li>
                <template v-if="usePage().props.auth.user.roles[0] == 'employee'">
                    <li>
                        <NavigationLink :href="route('trainings.index')" :active="isRouteActive(['trainings.index', 'trainings.show', 'trainings.start', 'trainings.changeTraining', 'trainings.startLesson'])">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                            <span class="ms-3">Trainings</span>
                        </NavigationLink>
                    </li>
                </template>
            </ul>
        </div>
    </aside>
</template>
