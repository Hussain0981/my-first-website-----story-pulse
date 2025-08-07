<template>
  <div class="relative">
    <div class="fixed font-fira h-screen w-full top-0 left-0 grid place-items-center z-40"
      style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="relative w-full max-w-[450px] px-3">
        <form class="bg-white px-3 md:px-8 py-8 rounded-2xl shadow-md relative" @submit.prevent="createStory">
          <!-- Close button -->
          <div class="absolute top-5 right-5 cursor-pointer" @click="handleClose">
            <IconsCross class="h-8 w-8 rounded-full shadow-orange-300 hover:shadow-md" />
          </div>

          <h1 class="text-center py-4">
            {{ props.editMode ? 'Edit Post' : 'Create Post' }}
          </h1>

          <!-- Title input -->
          <input type="text" placeholder="Enter title" v-model="form.title"
            class="border border-gray-400 w-full px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 transition-all" />

          <!-- Description input -->
          <textarea v-model="form.description"
            class="mt-4 min-h-[15vh] border border-gray-400 w-full px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 transition-all"
            placeholder="Description"></textarea>

          <!-- Image picker -->
          <div class="flex mt-4 w-full">
            <label for="image"
              class="flex-1 grid place-items-center mr-2 h-32 w-1/2 border border-gray-300 outline-none hover:bg-[#EA580C] cursor-pointer">
              Select Image
            </label>
            <input type="file" id="image" class="hidden" accept="image/*" @change="handleImageUpload" />
            <img v-if="imageURL" :src="imageURL" alt="" class="flex-1 h-32 object-cover object-center" />
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="btnLoading"
            class="mt-4 w-full text-white py-2 rounded-md bg-[#EA580C] transition-all duration-200 cursor-pointer">
            <span v-if="props.btnLoading"><LoadingButton /></span>
            <span v-else>{{ props.editMode ? 'Update' : 'Create' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const props = defineProps({
  editMode: Boolean,
  Editstory: Object,
  btnLoading: Boolean,
})

console.log(props.Editstory);


const emit = defineEmits(['close', 'runTimeAddStory', 'sendFormData'])
function handleClose() {
  emit('close')
}


const form = reactive({
  title: '',
  description: ''
})

const imageFile = ref(null) // actual file
const imageURL = ref(null)  // preview url

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imageURL.value = URL.createObjectURL(file)
  }
}


async function createStory() {
  emit('sendFormData', {
    title: form.title,
    description: form.description,
    image: imageFile.value,
    story_id: props.editMode ? props.Editstory?.story_id : null,
    editMode: props.editMode                         
  })
}



watch(
  () => props.Editstory,
  (val) => {
    if (val) {
      form.title = val.title || ''
      form.description = val.description || ''
      imageURL.value = val.image || null
    }
  },
  { immediate: true }
)
</script>
