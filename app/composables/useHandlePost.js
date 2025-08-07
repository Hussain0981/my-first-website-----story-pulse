export default function useHandlePost() {
    const { $api } = useNuxtApp()

    const error = ref(false)
    const errorMessage = ref(null)
    const pending = ref(false)
    const response = ref(null)

    async function handlePost(title, des, image, id, editMode) {
        if (pending.value) return

        const formData = new FormData()
        if (editMode) {
            formData.append('story_id', id)
        }
        formData.append('title', title)
        formData.append('description', des)
        formData.append('image', image)

        try {
            pending.value = true
            
            const post = editMode ? 'update-story' : 'create-blog'
            const res = await $api(post, {
                method: 'POST',
                body: formData
            })

            response.value = res

            if (res && res.success) {
                error.value = false
                errorMessage.value = res.message                
                
            } else {
                error.value = true
                errorMessage.value = res.message || 'Unknown error occurred'
            }

        } catch (err) {
            error.value = true
            errorMessage.value = err?.message || 'Something went wrong'
        } finally {
            pending.value = false
        }
    }

    return {
        handlePost,
        pending,
        response,
        error,
        errorMessage
    }
}
