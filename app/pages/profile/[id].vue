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
            <img class="h-[60vh] w-full object-center object-cover object-no-repeat" :src="getUserProfile?.cover_image" alt="">
            <div class="bg-black/50 absolute inset-0"></div>
        </div>
        <!-- user Data -->
        <div class="-translate-y-[40%] md:-translate-y-2/3 px-2 md:px-10">
            <div class="flex flex-col md:flex-row gap-y-4   justify-between items-center  md:text-white">
                <div class="flex flex-col items-center justify-center">
                    <img class="h-40 w-40 border-2 border-white rounded-full" :src="getUserProfile?.profile_image" alt="">
                    <h3 class="text-black mt-2">{{ getUserProfile?.name }}</h3>
                </div>
                <div>
                    <h3>Stories ({{ storyLength }})</h3>
                </div>
                <div v-if="user_id === id" class="flex gap-x-2" >
                    <button
                        class="px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:border-transparent hover:bg-gray-200 transition-colors">Create
                        Story
                    </button>
                    <button
                        class="px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:border-transparent hover:bg-gray-200 transition-colors">Edit
                        Profile
                    </button>
                </div>
            </div>

        </div>
        <div class="px-2 md:px-10 -mt-20 md:-mt-28">
            <div class="py-6 md:py-2 md:w-1/2 mx-auto w-full">
                <p>{{ user?.description }}</p>
            </div>
            <div class="border-b-2 border-gray-300 text-center">
                <h1 class="border-b-2 border-orange-400 inline-block py-2 px-2">Stories</h1>
            </div>

            <!-- get stories -->
            <div class="w-full pt-8 pb-2">
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

    </div>
</template>


<script setup>


const storyLength = ref(null)

const { $api } = useNuxtApp()

const loading = ref(false)
const stories = ref([])
const page = ref(1)
const hasMoreImages = ref(true)
const user = ref(null)
const route = useRoute()
const id = ref(route.params.id)

const getUserProfile = ref(null)
console.log(getUserProfile.value);


// Function to get stories
async function getStories() {
    if (loading.value || !hasMoreImages.value || !user.value?.user_id) return

    loading.value = true

    try {
        const res = await $api(`user-stories?user_id=${id.value}&page=${page.value}`)
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

async function getProfile(newId){
    try {
        const res = await $api(`get-profile?user_id=${newId}`)
        getUserProfile.value = res.user
    }catch(err){
        console.log(err);
        
    }
}

onMounted(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
        try {
            user.value = JSON.parse(userData)
        } catch (e) {
            console.error('Failed to parse user data:', e)
            return
        }

        // ✅ Check after user is set
        if (user.value?.user_id === id.value) {
            return navigateTo('/profile')
        }

        page.value = 1
        getStories()
    } else {
        console.warn('No user data found in localStorage')
    }

    getProfile(id.value)
})

watch( id, (newVal) => {
    if(newVal){
        getStories(newVal)
        getProfile(newVal)
    }
})

watch(stories.value, (newVal) => {
    if(newVal){
        storyLength.value = newVal.length
    }
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

// handle Edit
function handleEdit(id) {
    
}
</script>
