export default function useLike() {
    const pending = ref(false)
    const { $api } = useNuxtApp()
    const originalCount = ref(null)
    const originalState = ref(null)

    async function like(id, stories) {

        const story = stories.find(e => e.story_id === id)
        if (!story) return

        // Save original values
        originalState.value = story.user_like
        originalCount.value = story.likes_count

        // Optimistic UI update
        story.user_like = !story.user_like
        story.likes_count = story.user_like
            ? originalCount.value + 1
            : originalCount.value - 1

        pending.value = true

        try {
            await $api(`add-remove-like?story_id=${id}`, {
                method: 'POST'
            })
        } catch (err) {
            console.error('Like API failed:', err)

            // Revert on error
            story.user_like = originalState.value
            story.likes_count = originalCount.value
        } finally {
            pending.value = false
        }
    }

    return {
        like,
        pending
    }
}
