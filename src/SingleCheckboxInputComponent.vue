<template>

    <div class="uk-margin">

        <label :for="id + '_' + label" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">

        <input
            :id="id + '_' + label"
            class="uk-checkbox"
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

</script>

<style>
</style>
