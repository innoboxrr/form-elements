<template>

    <div>
    
        <single-checkbox-input-component
            v-for="option in options"
            :key="option"
            :id="id"
            :label="option.name" 
            :value="option.id" 
            :checked="value.includes(option.id)"
            @update:checked="check(option.id, $event)" />

    </div>

</template>

<script setup>

    import SingleCheckboxInputComponent from './SingleCheckboxInputComponent.vue'

    const props = defineProps({

        id: {
            type: String,
            default: ''
        },

        value: {
            type: Array,
            required: true,
        },

        options: {
            type: Array,
            required: true,
            validator: (value) => value.every(
                (option) => Object.keys(option).includes('name') && Object.keys(option).includes('id')
            ),
        },

    })

    const emit = defineEmits(['update:value'])

    // El estado se lee del DOM en lugar de mantenerlo aqui; se conserva el
    // comportamiento para no cambiar el contrato de update:value.
    const check = () => {

        const values = []

        document.querySelectorAll(`[name=input_${props.id}]`).forEach((option) => {
            if (option.checked) {
                values.push(option.value)
            }
        })

        emit('update:value', values)

    }

</script>
