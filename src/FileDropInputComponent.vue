<template>
    
    <div 
        @click="openFileDialog"
        @drop.prevent="handleDrop" 
        @dragover.prevent 
        class="mb-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:border-slate-400 dark:hover:bg-slate-500 pointer">
        
        <IconComponent name="media" :size="32" custom-class="text-slate-500 my-3 dark:text-slate-200" />
        
        <p class="text-slate-400 text-sm pt-2 dark:text-slate-200 pointer">
            {{ mainText }}
        </p>
        
        <p class="text-slate-400 text-xs pt-2 dark:text-slate-200 pointer">
            {{ subText }}
        </p>
        
        <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            @change="handleFileChange" 
            :multiple="multiple">

    </div>

</template>

<script setup>

    import { ref } from 'vue'
    import IconComponent from './IconComponent.vue'

    defineProps({
        multiple: { type: Boolean, default: false },
        mainText: { type: String, default: 'Arrastra y suelta el archivo aqui' },
        subText: { type: String, default: 'o haz clic para seleccionar los archivos.' },
    })

    const emit = defineEmits(['change'])

    const fileInput = ref(null)

    const openFileDialog = () => fileInput.value?.click()

    const handleDrop = (event) => emit('change', Array.from(event.dataTransfer.files))

    const handleFileChange = (event) => emit('change', Array.from(event.target.files))

</script>