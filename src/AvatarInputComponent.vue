<template>
  <div class="avatar-container">
      <img 
	  	:src="avatarUrl" 
		@click="triggerFileInput"
		alt="Avatar" 
		class="w-24 h-24 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer avatar" />
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

const props = defineProps({
    avatarUrl: { type: String, required: true },
    uploadUrl: { type: String, required: true },
    uploadMethod: { type: String, default: 'POST' },
})

const emit = defineEmits(['upload'])

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

  .avatar {
    width: 100px; /* Ajusta el tamaño según tus necesidades */
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
</style>
