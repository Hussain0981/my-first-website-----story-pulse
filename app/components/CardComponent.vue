<template>
    <div class="border border-gray-300 rounded-md h-[450px] relative">
        <div class="flex items-center justify-between w-full">
            <div class="flex gap-x-2 items-center py-1 px-2 cursor-pointer" @click="story.user?.user_id === user.user_id ? navigateTo('/profile') : navigateTo(`/profile/${story.user?.user_id}`)">
                <img class="h-14 w-14 border-2 border-gray-500 rounded-full bg-cover bg-center"
                    :src="story.user?.profile_image" alt="">
                <div>
                    <h4 class="text-gray-800 font-bold">{{ story.user?.name }}</h4>
                    <span>
                        <NuxtTime :datetime="story.createdAt" relative />
                    </span>
                </div>
            </div>
            <div v-if="story.user?.user_id === user.user_id" class="relative px-3">
                <!-- Dots icon button -->
                <div class="inline-block" @mouseenter="showDots = true" @mouseleave="showDots = false">
                    <IconsDots class="h-8 w-8 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition" />
                </div>

                <!-- Dropdown menu -->
                <div v-if="showDots" @mouseenter="showDots = true" @mouseleave="showDots = false"
                    class="absolute right-0 top-8 bg-white rounded-md shadow-lg w-[140px] py-1 z-50">
                    <div @click="handleEdit(story.story_id)"
                        class="flex items-center gap-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
                        <IconsEdit class="h-5 w-5 " />
                        <span class="text-sm text-gray-900">Edit</span>
                    </div>
                    <div @click="handleDelete(story.story_id)"
                        class="flex items-center gap-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
                        <IconsDelete class="h-5 w-5 " />
                        <span class="text-sm text-gray-900">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <img class="h-60 w-full bg-cover bg-center" :src="story.image" alt="">
        </div>
        <div class="p-2">
            <div>
                <h4 class="text-gray-700 font-bold cursor-pointer hover:text-blue-700 transition-colors inline-block select-none"
                    @click="navigateTo(`/details/${story.story_id}`);">{{ story.title }}</h4>
                <p class="flex-grow">{{ story.description.split('').length > 120 ? story.description.slice(0, 120) + ('...') :
                    story.description }}</p>
            </div>
            <div class="flex justify-end items-center gap-x-1 absolute bottom-2 right-2">
                <button @click="handleArchive(story.story_id)">
                    <IconsArchive :class="[story.
                        is_archived
                        ? 'text-green-800' : 'text-black']" class="h-6 w-6 cursor-pointer text-black" />
                </button>
                <button @click="handleLike(story.story_id)">
                    <IconsHeart :class="[story.user_like ? 'text-green-800' : 'text-black']"
                        class="h-6 w-6 cursor-pointer text-black" />
                </button>
                
                <span>{{ story.likes_count }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const showDots = ref(false)
const user = ref({})
const props = defineProps({
    story: {
        type: Object,
        default: {}
    }
})
const emit = defineEmits(['archive', 'like', 'delete', 'edit'])
function handleArchive(id) {
    emit('archive', id)
}
function handleLike(id) {
    emit('like', id)
}
function handleDelete(id) {
    emit('delete', id)
    showDots.value = false
}
function handleEdit(id) {
    emit('edit', id)
    showDots.value = false

}
onMounted(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData) {
        user.value = userData
    }

})

</script>
