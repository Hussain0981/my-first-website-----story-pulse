<template>
    <div
        class="navigation fixed top-0 right-0 w-full z-40 flex justify-between px-2 md:px-10 h-[70px] items-center text-white">
        <div>
            <h1>Clone2.</h1>
        </div>
        <div class="flex items-center justify-between">
            <div class="md:hidden" @click="mobailView = true">
                <IconsMenu class="h-10 w-10 cursor-pointer p-1" />
            </div>
            <div>
                <ul :class="[
                    mobailView ? 'translate-x-0' : 'translate-x-full',
                    'fixed inset-0 z-40 flex flex-col md:flex-row bg-black py-10 md:py-0 gap-3 transition-all duration-300 ease-in-out md:static md:translate-x-0 md:bg-transparent md:flex md:gap-x-3'
                ]">
                    <div>
                        <span @click="mobailView = false"
                            class="md:hidden p-1 absolute right-3 top-2 cursor-pointer font-bold text-2xl">X</span>
                    </div>
                    <NuxtLink class="p-2" to="/" @click="mobailView = false">Home</NuxtLink>
                    <NuxtLink class="p-2" to="/about-us" @click="mobailView = false">About Us</NuxtLink>
                    <NuxtLink class="p-2" to="popular-stories" @click="mobailView = false">Popular Stories</NuxtLink>
                    <NuxtLink class="p-2" to="/archives" @click="mobailView = false">Archives</NuxtLink>
                    <NuxtLink class="p-2 md:hidden" to="/profile" @click="mobailView = false">Profile</NuxtLink>
                    <NuxtLink class="p-2 md:hidden" @click="handleLogout">Logout</NuxtLink>
                    <div class="relative p-2 cursor-pointer hidden md:block" @mouseenter="showProfile = true"
                        @mouseleave="showProfile = false">
                        <NuxtLink class="">Profile</NuxtLink>
                        <div v-if="showProfile"
                            class="absolute right-0 top-10 w-40 h-auto bg-white py-1 text-black rounded-md">
                            <div class="py-2 hover:bg-gray-200 cursor-pointer"
                                @click="navigateTo('/profile'); showProfile = false">
                                <div class="flex items-center gap-x-1 px-2">
                                    <span>
                                        <IconsProfile class="h-6 w-6" />
                                    </span>
                                    <span class="text-bold font-[17px]">Profile</span>
                                </div>
                            </div>
                            <div class="py-2 hover:bg-gray-200 cursor-pointer" @click="handleLogout">
                                <div class="flex items-center gap-x-1 px-2">
                                    <span>
                                        <IconsLogout class="h-6 w-6" />
                                    </span>
                                    <span class="text-bold font-[17px]">Log out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
const showProfile = ref(false)
const mobailView = ref(false)
function handleScrolling() {
    const scrollPosition = window.scrollY
    if (scrollPosition > 50) {
        document.querySelector('.navigation').classList.add('bg-gray-800', 'shadow-lg')
    } else {
        document.querySelector('.navigation').classList.remove('bg-gray-800', 'shadow-lg')
    }
}
function handleLogout() {
    const cookie = useCookie('token')
    cookie.value = null;
    showProfile.value = false
    localStorage.clear()
    reloadNuxtApp();

}
onMounted(() => {
    window.addEventListener('scroll', handleScrolling)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScrolling)
})
</script>