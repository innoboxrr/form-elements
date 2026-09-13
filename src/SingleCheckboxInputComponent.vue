<template>

    <div class="fe-mb">

        <label :for="id + '_' + label" :class="labelClass">

        <input
            :id="id + '_' + label"
            class="fe-checkbox"
            type="checkbox"
            :name="`input_${id}`"
            :checked="checked"
            :value="value"
            @input.prevent="(event) => emit('update:checked', event.target.checked)" />

            &nbsp;{{ label }}

        </label>

    </div>

</template>

<script setup>

    import { useThemeClass } from './composables/useTheme.js'

    defineProps({

        id: {
            type: String,
            required: true,
        },

        label: {
            type: String,
            default: ''
        },

        checked: {
            type: Boolean,
            default: false
        },

        value: {
            default: null,
        }

    })

    const emit = defineEmits(['update:checked'])

    const labelClass = useThemeClass('label')

</script>
