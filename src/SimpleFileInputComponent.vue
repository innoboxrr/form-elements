<template>
    
    <label class="file-select">
    
        <div class="select-button">
        
            <span v-if="hasFile">Archivo seleccionado: {{file.name}}</span>
            
            <span v-else>{{ label }}</span>
        
        </div>
        
        <input 
            :class="customClass"
            type="file" 
            :name="inputName" 
            @change="handleFileChange" />
    
    </label>

</template>

<script setup>

    import { computed, ref } from 'vue'

    defineProps({
        customClass: { type: String, required: false, default: null },
        inputName: { type: String, default: 'file' },
        label: { type: String, default: 'Seleccionar archivo' }
    })

    const emit = defineEmits(['input'])

    const file = ref(null)

    const hasFile = computed(() => Boolean(file.value?.size))

    const handleFileChange = (event) => {

        // Cancelar el dialogo deja la lista vacia; antes se asignaba
        // undefined y la plantilla reventaba al leer file.size.
        file.value = event.target.files?.[0] ?? null

        emit('input', file.value)

    }

</script>

<style scoped>

    .file-select > .select-button {
        padding: 10px;
        color: white;
        background-color: #2EA169;
        border-radius: 10px;
        text-align: center;
        font-weight: bold;
    }

    .file-select > input[type="file"] {
        display: none;
    }

</style>