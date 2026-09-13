<template>

    <div
        :class="dropClass"
        :data-dragging="dragging ? 'true' : 'false'"
        role="button"
        tabindex="0"
        @click="openFileDialog"
        @keydown.enter.prevent="openFileDialog"
        @keydown.space.prevent="openFileDialog"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleDrop">

        <IconComponent name="media" :size="32" />

        <p>{{ mainText }}</p>

        <p :class="hintClass">{{ subText }}</p>

        <input
            ref="fileInput"
            type="file"
            hidden
            :multiple="multiple"
            @change="handleFileChange">

    </div>

</template>

<script setup>

    /**
     * La zona para soltar archivos, con el marcado de su gemela React: se
     * resalta mientras se arrastra algo encima y se abre también con el
     * teclado. Antes la dibujaban clases de Tailwind que el paquete no
     * declara.
     */

    import { ref } from 'vue'
    import IconComponent from './IconComponent.vue'
    import { useThemeClass } from './composables/useTheme.js'

    defineProps({
        multiple: { type: Boolean, default: false },
        mainText: { type: String, default: 'Arrastra y suelta el archivo aqui' },
        subText: { type: String, default: 'o haz clic para seleccionar los archivos.' },
    })

    const emit = defineEmits(['change'])

    const dropClass = useThemeClass('fileDrop')
    const hintClass = useThemeClass('fileDropHint')

    const fileInput = ref(null)
    const dragging = ref(false)

    const openFileDialog = () => fileInput.value?.click()

    const handleDrop = (event) => {
        dragging.value = false

        emit('change', Array.from(event.dataTransfer.files))
    }

    const handleFileChange = (event) => emit('change', Array.from(event.target.files))

</script>
