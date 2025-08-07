<template>
    <div>
        <div v-if="errorMessage.length != 0" class="fixed top-5 right-5 z-50">
            <AlertBox :error="error" :errorMessages="errorMessage" @close="errorMessage = ''" />
        </div>
        <div class="relative bg-[url('/images/login.jpg')] bg-cover bg-center">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="h-screen px-2 md:px-0  grid place-items-center">
                <form @submit.prevent="handleSubmit"
                    class="text-white w-full max-w-96 h-auto shadow-2xl px-5 py-6 rounded-md flex flex-col gap-y-7 z-50 backdrop-blur-sm bg-white/20">
                    <h1 class="text-3xl font-semibold text-center py-2">Login</h1>
                    <div>
                        <input id="email" v-model="form.email" type="text"
                            class="mt-1 border-b py-2 w-full focus:outline-0" placeholder="Enter your email" />
                    </div>
                    <div>
                        <input id="possword" v-model="form.password" type="text"
                            class="mt-1 border-b py-2 w-full focus:outline-0" placeholder="Enter your password" />
                    </div>
                    <div class="py-3">
                        
                        <button :disabled="pending" class="px-5 py-1 h-[40px] border focus:outline-white focus:outline-2 border-white  rounded-md w-full cursor-pointer hover:border-white/50 transition-colors ">
                            <span v-if="pending"><LoadingButton /></span>
                            <span v-else>Login</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'auth',
})
const form = reactive({
    email: '',
    password: '',
})

const { data, pending, userLogin, error, errorMessage } = useUserLogin()

async function handleSubmit() {
    await userLogin(form.email, form.password);
    reloadNuxtApp();
}

</script>