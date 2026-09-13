<template>
  <div class="avatar-container">
      <img
          :src="avatarUrl"
          :class="avatarClass"
          alt="Avatar"
          role="button"
          tabindex="0"
          @click="triggerFileInput"
          @keydown.enter.prevent="triggerFileInput"
          @keydown.space.prevent="triggerFileInput" />
      <input
          type="file"
          accept="image/*"
          ref="fileInput"
          @change="uploadAvatar"
          style="display: none"
      />
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useThemeClass } from './composables/useTheme.js'

const props = defineProps({
    avatarUrl: { type: String, required: true },
    uploadUrl: { type: String, required: true },
    uploadMethod: { type: String, default: 'POST' },
})

const emit = defineEmits(['upload'])

// El tamaño, el borde y el foco salen del tema, igual que en la rama React.
const avatarClass = useThemeClass('avatarPreview')

const fileInput = ref(null)

const triggerFileInput = () => fileInput.value?.click()

const uploadAvatar = async () => {

    const file = fileInput.value?.files?.[0]

    if (! file) return

    try {

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(props.uploadUrl, {
            method: props.uploadMethod,
            body: formData,
        })

        if (! response.ok) {
            console.error('Error al subir el avatar:', response.statusText)
            return
        }

        emit('upload', await response.json())

    } catch (error) {
        console.error('Error al subir el avatar:', error)
    }

}

</script>

<style scoped>
  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
