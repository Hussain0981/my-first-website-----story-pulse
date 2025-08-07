export default function useDeleteItem() {
    const { $api } = useNuxtApp()
    const likeError = ref(false)
    const likeErrorMessege = ref('')

    async function deleteItem(id) {
        try {
            const res = await $api(`delete-story?story_id=${id}`, {
                method: 'POST'
            })
            if (res.success) {
                likeError.value = false;
                likeErrorMessege.value = res.message
            }
        } catch (err) {
            console.log(err);
            likeError.value = true;
            likeErrorMessege.value = err

        }
    }
    return {
        deleteItem,
        likeError,
        likeErrorMessege
    }
}