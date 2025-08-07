<template>
    <Transition name="fade-slide">

        <div>
            <div v-if="visible" class="flex items-center p-4 rounded-md shadow-md border-l-6 relative" :class="[
            error
                ? 'bg-red-50 text-red-800 border-red-500'
                : 'bg-green-50 text-green-800 border-green-500'
        ]">
            <div class="pt-1">
                <component :is="error ? IconsWorning : IconsTick" class="w-6 h-6"
                    :class="error ? 'text-red-500' : 'text-green-500'" />
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium">{{ errorMessages }}</p>
            </div>
            <button @click="closeAlert" class="ml-4 text-lg text-gray-400 hover:text-gray-600">
                <IconsCross class="w-5 h-5 cursor-pointer" />
            </button>
        </div>
        </div>
    </Transition>
</template>

<script setup>
import IconsWorning from './icons/Worning.vue'
import IconsTick from './icons/Tick.vue'

const props = defineProps({
    error: {
        type: Boolean,
        default: false
    },
    errorMessages: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['close'])
const visible = ref(true)

function closeAlert() {
    visible.value = false
    emit('close')
}

onMounted(() => {
    setTimeout(() => {
        closeAlert()
    }, 3000)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
