export default function useArchiveItem() {
  const { $api } = useNuxtApp()

  const errorMessage = ref('')
  const error = ref(false)
  const pending = ref(false)
  const originalState = ref(null)

  async function archive(id, stories) {
    console.log('Stories:', stories)
    
    const story = stories.find(e => e.story_id === id)
    console.log('Stories:', stories)
    
    if (!story) return

    // Save original state before optimistic update
    originalState.value = story.is_archived
    story.is_archived = !story.is_archived

    try {
      pending.value = true

      const res = await $api(`/add-remove-archive?story_id=${id}`, {
        method: 'POST'
      })

      if(res.success && res.message === 'archived') {
        error.value = false
        errorMessage.value = 'Successfully added to archive'
      }else {
        error.value = false
        errorMessage.value = 'Successfully removed from archive'
      }
    } catch (err) {
      story.is_archived = originalState.value
      error.value = true
      errorMessage.value = err?.data?.message || err.message || 'Something went wrong'
      
    } finally {
      pending.value = false
    }
  }

  return {
    pending,
    error,
    errorMessage,
    archive
  }
}
