<template>

    <div class="uk-margin">

        <label :for="id + '_' + label" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">

        <input
            :id="id + '_' + label"
            class="uk-checkbox"
            type="checkbox"
            :name="`input_${id}`"
            :checked="checked"
            :value="value"
            @input.prevent="(event) => $emit('update:checked', event.target.checked)" />
            
            &nbsp;{{ label }}

        </label>

    </div>

</template>

<script>
    
    export default {
    
        props: {
        
            id: {
                type: String,
                required: true,
            },

            label: {
                type: String,
            },  

            checked: {
                type: Boolean,
            },

            value: {
                default: null,
            }
    
        },

        emits: ['update:checked'],
    
    }

</script>

<style>
</style>
