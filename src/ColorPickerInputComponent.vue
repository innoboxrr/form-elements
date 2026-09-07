<template>
    <div class="uk-margin">
        <component
            :is="Picker"
            :label="label"
            :clearable="clearable"
            :bottom-bar="bottomBar"
            :colors="colors"
            v-model="value" />
    </div>
</template>

<script setup>

    import { computed, onMounted, ref, shallowRef } from 'vue'

    // Fallback minimo: input nativo de color con la misma interfaz v-model.
    const FallbackColorpicker = {
        name: 'FallbackColorpicker',
        props: {
            label: { type: String, default: '' },
            clearable: { type: Boolean, default: true },
            bottomBar: { type: Boolean, default: true },
            colors: { type: Array, default: () => [] },
            modelValue: { default: '#607C8A' }
        },
        emits: ['update:modelValue'],
        computed: {
            value: {
                get() { return this.modelValue; },
                set(v) { this.$emit('update:modelValue', v); }
            }
        },
        template: `
            <div>
                <label v-if="label" class="lv-input__label">{{ label }}</label>
                <input type="color" v-model="value" />
            </div>
        `
    }

    const props = defineProps({
        label: { type: String, default: '' },
        clearable: { type: Boolean, default: true },
        bottomBar: { type: Boolean, default: true },
        colors: {
            type: Array,
            default: () => ([
                "#F44336","#E91E63","#9C27B0","#673AB7",
                "#3F51B5","#2196F3","#03A9F4","#00BCD4",
                "#009688","#4CAF50","#8BC34A","#CDDC39",
                "#FFEB3B","#FFC107","#FF9800","#795548"
            ])
        },
        modelValue: { default: "#607C8A" }
    })

    const emit = defineEmits(['update:modelValue'])

    // shallowRef: un componente no debe hacerse reactivo en profundidad.
    const Picker = shallowRef(FallbackColorpicker)

    const value = computed({
        get: () => props.modelValue,
        set: (newValue) => emit('update:modelValue', newValue),
    })

    onMounted(async () => {

        // lightvue es un peer opcional: solo se usa si el anfitrion lo tiene.
        try {

            const module = await import('lightvue/color-picker')

            Picker.value = module.default || module

        } catch {

            // process.env no existe en un bundle de navegador; import.meta.env
            // es lo que Vite expone.
            if (import.meta.env?.DEV) {
                console.warn('[innoboxrr-form-elements] lightvue no encontrado; usando <input type="color"> como fallback.')
            }

        }

    })

</script>

<style>
    .lv-input__label {
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 0.875rem;
    }
    .lv-overlaypanel { z-index: 1015 !important; }
</style>
