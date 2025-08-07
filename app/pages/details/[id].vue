<template>
  <div>
    <div class="grid md:grid-cols-[60%_auto] gap-6 px-2 md:px-10 py-6">
      <!-- Left Section: Main Story -->
      <div class="md:p-5">
        <!-- ✅ Skeleton Loader -->
        <div v-if="loading">
          <div class="space-y-4 animate-pulse">
            <!-- User Info -->
            <div class="flex items-center gap-x-4">
              <div class="h-12 w-12 rounded-full bg-gray-300"></div>
              <div class="space-y-2 w-full">
                <div class="h-4 w-1/3 bg-gray-300 rounded"></div>
                <div class="h-3 w-1/4 bg-gray-300 rounded"></div>
              </div>
            </div>

            <!-- Image Placeholder -->
            <div class="h-[60vh] w-full bg-gray-300 rounded-md"></div>

            <!-- Title and Description -->
            <div class="space-y-3">
              <div class="h-6 w-2/3 bg-gray-300 rounded"></div>
              <div class="h-4 w-full bg-gray-300 rounded"></div>
              <div class="h-4 w-5/6 bg-gray-300 rounded"></div>
              <div class="h-4 w-4/5 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        <!-- ✅ Main Content -->
        <div v-else>
          <div class="flex items-center gap-x-2 mb-2">
            <img class="h-12 w-12 bg-cover bg-center rounded-full shadow-sm" :src="story.user?.profile_image" alt="" />
            <div>
              <h3>{{ story.user?.name }}</h3>
              <p>
                <NuxtTime :datetime="story.createdAt" relative />
              </p>
            </div>
          </div>

          <img class="h-[60vh] w-full rounded-md shadow-md object-cover" :src="story.image" alt="" />

          <div class="py-4">
            <h2 class="text-xl font-semibold">{{ story.title }}</h2>
            <p class="mt-2 text-gray-700 leading-relaxed">{{ story.description }}</p>
          </div>
        </div>
      </div>

      <!-- Right Section: Other Stories -->
      <div class="flex flex-col gap-y-5">
        <div>
          <h2 class="mb-2 text-lg font-semibold">Explore More Stories</h2>

        </div>
        <div>
          <div class="h-auto md:h-[80vh] overflow-y-auto space-y-2 md:space-y-6">
            <!-- Skeleton Loader -->
            <div v-if="loading">
              <div class="p-2 animate-pulse" v-for="i in 10" :key="i">
                <div class="flex gap-x-3 items-center ">
                  <!-- Image/Thumbnail placeholder -->
                  <div class="h-20 w-28 rounded-md shadow-md bg-gray-200"></div>

                  <!-- Text placeholders -->
                  <div class="flex flex-col gap-y-2 flex-1">
                    <div class="h-6 w-1/2 bg-gray-200 rounded "></div>
                    <div class="h-4 w-4/5 bg-gray-200 rounded "></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div v-for="story in otherStories" :key="story.story_id">
                <div class="flex gap-4 pb-4 cursor-pointer" @click="$router.push(`/details/${story.story_id}`)">
                  <img class="h-20 w-28 object-cover object-center rounded-lg" :src="story.image"
                    alt="Story Image" />
                  <div class="flex flex-col justify-center">
                    <h3 class="text-lg font-semibold py-1">{{ story.title }}</h3>
                    <p class="text-gray-700 text-sm leading-snug">
                      {{
                        story.description.length > 50
                          ? story.description.substring(0, 50) + "..."
                          : story.description
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})
const route = useRoute();
const id = route.params.id;
const loading = ref(false);
const story = ref([]);
const otherStories = ref([]);
const { $api } = useNuxtApp()

async function getClickedStory() {
  try {
    loading.value = true;
    const res = await $api(`get-story-detail/${id}`);
    if (res?.story) {
      story.value = res?.story;
    }
    if (res?.otherStories) {
      otherStories.value = res?.otherStories;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false; // ✅ Fix: stop loading here
  }
}


onMounted(() => {
  getClickedStory();
});
</script>
