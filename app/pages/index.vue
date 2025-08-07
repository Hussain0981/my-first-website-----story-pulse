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
        <div class="relative h-[60vh] md:h-[80vh]">
            <div class="h-full w-full bg-[url('/images/hero-section.jpg')] bg-center bg-cover bg-no-repeat"></div>
            <div class="bg-black/50 absolute inset-0"></div>
            <div class="absolute top-1/2 px-2 md:left-8 -translate-y-1/2 text-white z-30 w-full max-w-[500px]">
                <p class="mt-10">Adventure is not just about exploring new places — it’s about discovering new parts of
                    yourself. Whether you're hiking through misty mountains, diving into unknown waters, or getting lost
                    in the heart of a vibrant city, every step outside your comfort zone becomes a story worth telling.
                    Adventure awakens your senses, challenges your limits, and reminds you what it means to feel truly
                    alive.</p>
            </div>
        </div>
        <div class="flex items-center justify-between px-2 md:px-10 h-[15vh]">
            <div>
                <h3 class="underline underline-offset-8">All Stories</h3>
            </div>
            <div>
                <span>
                    <button @click="createPost = true"
                        class="px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:border-transparent hover:bg-gray-200 transition-colors">Create
                        Story
                    </button>
                </span>
            </div>

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

        <!-- create post -->
        <div v-if="createPost">
            <CreatePost @close="createPost = false; eStroy = {}; editMode = false" :Editstory="eStroy"
                :editMode="editMode" @sendFormData="handleFormSubmit" />
        </div>

    </div>
</template>
<script setup>
const { $api } = useNuxtApp()
const createPost = ref(false)
const loading = ref(false)
const stories = ref([])
const page = ref(1)
const hasMoreImages = ref(true)

// Function to get stories
async function getStories() {
    if (loading.value || !hasMoreImages.value) return

    loading.value = true

    try {
        const res = await $api(`get-stories?page=${page.value}&type=&story=`)
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
const { deleteItem, error: likeError, errorMessage: likeErrorMessege } = useDeleteItem()
function handleDelete(id) {
    deleteItem(id)
    const index = stories.value.findIndex(story => story.story_id === id)
    console.log(index);

    if (index !== -1) {
        stories.value.splice(index, 1)
    }

}
const { handlePost, pending: uploadpending, error: uplError, errorMessage: uplErrorMessage, response } = useHandlePost()
async function handleFormSubmit(data) {
    if (data.editMode) {
        await handlePost(
            data.title,
            data.description,
            data.image,
            data.story_id,
            data.editMode
        )

        if (response.value?.success && response.value?.story) {
            const storyIndex = stories.value.findIndex(
                (e) => e.story_id === data.story_id
            )

            if (storyIndex !== -1) {
                stories.value.splice(storyIndex, 1, response.value.story)
            }
        }
    } else {
        await handlePost(data.title, data.description, data.image)

        if (response.value?.success && response.value?.story) {
            stories.value.unshift(response.value.story)
        }
    }
    createPost.value = false

}





// handle Edit
function handleEdit(id) {

}
</script>
