<template>
    <div>
        <div class="relative">
            <div v-if="pending" class="fixed inset-0 z-50 flex items-center justify-center">
                <!-- Dark overlay -->
                <div class="absolute inset-0 bg-black/55"></div>

                <!-- Loading component in center -->
                <LoadingButton class="z-10 " />
            </div>
        </div>
        <div v-if="errorMessage.length != 0" class="fixed top-5 right-5 z-50">
            <AlertBox :error="error" :errorMessages="errorMessage" @close="errorMessage = ''" />
        </div>
        <div class="relative">
            <div class="bg-[url('/images/popular-stories.jpg')] bg-cover bg-center h-[50vh] md:h-[80vh] w-full"></div>
            <div class="absolute inset-0 bg-black/50 "></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white whitespace-nowrap">
                <h2>Popular Stories</h2>
            </div>
        </div>
        <div class="py-5">
            <h1 class="px-2 md:px-10">Popular Stories</h1>
        </div>
        <div class="w-full px-2 md:px-10">
            <div v-if="loading" class="grid md:grid-cols-3 gap-4 pb-10">
                <CardLoader v-for="i in 9" :key="i" />
            </div>

            <div v-else class="grid md:grid-cols-3 gap-4">
                <div v-for="story in stories" :key="story.id">
                    <CardComponent :story="story" @archive="handleArchive" @like="handleLike" @delete="handleDelete"
                        @edit="handleEdit" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp()

const loading = ref(false)
const stories = ref([])
const page = ref(1)
const hasMoreImages = ref(true)

// Function to get stories
async function getStories() {
    if (loading.value || !hasMoreImages.value) return

    loading.value = true

    try {
        const res = await $api(`get-stories?page=${page.value}&type=archive&story=`)
        const newStories = res?.stories || []

        stories.value.push(...newStories)

        if (newStories.length < 9) {
            hasMoreImages.value = false
        }
        page.value++
    } catch (err) {
        console.error('Failed to load stories:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getStories(page.value = 1)
})

// Use composable for infinite scroll
useInfiniteScroll({
    callback: getStories,
    canLoadMore: () => hasMoreImages.value && !loading.value
})
const { archive, pending, error, errorMessage } = useArchiveItem()
async function handleArchive(id) {
    await archive(id, stories.value)

}
const { like } = useLike()
async function handleLike(id) {
    await like(id, stories.value)
}

// handle Delete
const { deleteItem, error:likeError, errorMessage:likeErrorMessege } = useDeleteItem()
function handleDelete(id) {
    deleteItem(id)
    const index = stories.value.findIndex(story => story.story_id === id)
    console.log(index);

    if (index !== -1) {
        stories.value.splice(index, 1)
    }

}

// handle Edit
function handleEdit(id) {

}
</script>

