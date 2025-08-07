export default function useUserLogin() {
    const { $api } = useNuxtApp()

    const data = ref(null)
    const error = ref(false)
    const errorMessage = ref('')
    const pending = ref(false)

    async function userLogin(email, password) {
        pending.value = true
        try {
            const res = await $api('/login', {
                method: 'POST',
                body: {
                    email,
                    password
                }
            })
            console.log(res);

            if (res.success) {
                data.value = res
                error.value = false
                errorMessage.value = res.message
                const user = res?.user
                localStorage.setItem('user', JSON.stringify(user))
                const token = res.token
                const cookie = useCookie('token')
                cookie.value = token
            }
        } catch (err) {
            error.value = true
            errorMessage.value = err
        } finally {
            pending.value = false
        }
    }

    return {
        userLogin,
        data,
        error,
        pending,
        errorMessage
    }
}
