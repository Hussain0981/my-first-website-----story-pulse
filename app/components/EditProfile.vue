<template>
    <div class="fixed inset-0 z-50 grid place-items-center h-screen w-screen">
        <div class="px-10  relative">
            <form @submit.prevent="handleUpdateProfile" class="w-full max-w-[800px]  h-[90vh] overflow-y-auto bg-white rounded-md p-5 z-20">
                <!-- Close Icon -->
                <div class="py-2 flex justify-end">
                    <IconsCross @click="closeParentForm"
                        class="h-10 w-10 cursor-pointer fill-orange-500 hover:fill-orange-700 transition-colors stroke-" />
                </div>

                <!-- Profile and Cover Image Upload -->
                <div class="flex flex-col md:flex-row gap-y-5 md:gap-y-0 gap-x-10">
                    <!-- Profile Image -->
                    <div>
                        <h2 class="mb-2 text-xl font-bold font-roboto">Profile image</h2>
                        <div class="flex gap-3">
                            <div class="group">
                                <label for="profileImage"
                                    class="h-32 md:h-40 w-40 rounded-md border flex flex-col justify-center items-center cursor-pointer">
                                    <IconsCamera
                                        class="h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-400" />
                                    <span>Upload Profile Image</span>
                                    <input type="file" id="profileImage" class="hidden" @change="handleProfileImage"
                                        accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <img :src="form.profile_image" alt="Profile Preview"
                                    class="h-32 md:h-40 w-40 rounded-md border object-cover" />
                            </div>
                        </div>
                    </div>

                    <!-- Cover Image -->
                    <div>
                        <h2 class="mb-2 text-xl font-bold font-roboto">Cover image</h2>
                        <div class="flex gap-3">
                            <div class="group">
                                <label for="cover_photo"
                                    class="h-32 md:h-40 w-40 rounded-md border flex flex-col justify-center items-center cursor-pointer">
                                    <IconsCamera
                                        class="h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-400" />
                                    <span>Upload Cover Image</span>
                                    <input type="file" id="cover_photo" class="hidden" @change="handleCoverImage"
                                        accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <img :src="form.cover_image" alt="Cover Preview"
                                    class="h-32 md:h-40 w-40 rounded-md border object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Name and Email -->
                <div class="flex flex-col md:flex-row w-full gap-x-5 mt-4">
                    <div class="w-full flex flex-col">
                        <label for="name">Name</label>
                        <input v-model="form.name" type="text" id="name"
                            class="border border-gray-500 rounded-md px-2 py-1.5 mt-1" />
                    </div>
                    <div class="w-full flex flex-col">
                        <label for="email">Email</label>
                        <input v-model="form.email" type="text" id="email"
                            class="border border-gray-500 rounded-md px-2 py-1.5 mt-1" />
                    </div>
                </div>

                <!-- Description -->
                <div class="mt-4 flex flex-col mb-1">
                    <label for="description">Description</label>
                    <textarea v-model="form.description" id="description"
                        class="border border-gray-500 rounded-md px-2 py-1.5 mt-1"></textarea>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-5">
                    <button type="submit"
                        class="bg-orange-500 hover:bg-orange-700 transition-all cursor-pointer px-4 py-2 rounded-md text-white">
                        <span v-if="loading">Loading...</span>
                        <span v-else>Update Profile</span>
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script setup>
const loading = ref(false)
const { $axios } = useNuxtApp()
const userData = ref({})
const form = reactive({
    profile_image: '',
    cover_image: '',
    name: '',
    email: '',
    description: ''
})

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close-form'])

function closeParentForm() {
    emit('close-form', false)
}

onMounted(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
    userData.value = localUser || props.user?.user || {}

    // Initialize form
    form.profile_image = userData.value.profile_image || ''
    form.cover_image = userData.value.cover_image || ''
    form.name = userData.value.name || ''
    form.email = userData.value.email || ''
    form.description = userData.value.description || ''
})

function handleProfileImage(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        form.profile_image = URL.createObjectURL(file)
    } else {
        form.profile_image = ''
    }
}

function handleCoverImage(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        form.cover_image = URL.createObjectURL(file)
    } else {
        form.cover_image = ''
    }
}

async function handleUpdateProfile() {
    loading.value = true
    try {
        const formData = new FormData()
        for (const key in form) {
            formData.append(key, form[key])
        }

        const response = await $axios.post(`update-profile`, formData)
        if (response.data.success) {
            alert('Profile updated successfully!')
            closeParentForm()
        }
    } catch (err) {
        console.error('Update failed:', err)
    } finally {
        loading.value = false
    }
}
</script>