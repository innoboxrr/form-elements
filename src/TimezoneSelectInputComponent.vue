<template>
    <SelectSearchInputComponent
        class="timezone"
        :validators="validators"
        :name="name"
        :input-label="label"
        :help="help"
        :multiple="multiple"
        :size="size"
        v-model="value"
        :options="timezoneOptions"
        :placeholder="placeholder"
    />
</template>

<script setup>

    import { computed } from 'vue'
    import SelectSearchInputComponent from './SelectSearchInputComponent.vue'
    import { timezones as timezoneOptions } from 'innoboxrr-form-core'

    const props = defineProps({
        label: { type: String, default: '' },
        placeholder: { type: String, default: 'Select a timezone' },
        help: { type: String, default: null },
        name: { type: String, required: true },
        multiple: { type: Boolean, default: false },
        size: { type: Number, default: null },
        validators: { type: String, default: '' },
        modelValue: { type: [String, Number, Array, Object], default: "" }
    })

    const emit = defineEmits(['update:modelValue'])

    const value = computed({
        get: () => props.modelValue,
        // SelectSearch entrega la opcion completa; se propaga solo su valor.
        set: (option) => emit('update:modelValue', option?.value ?? option),
    })

</script>

<style>
    .vs__dropdown-toggle {
        border: 0 !important;
    }
</style>