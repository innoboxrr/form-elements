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

<script>
    // Fallback mínimo: input nativo de color con la misma interfaz v-model
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
    };

    export default {
        name: 'LvColorpickerWrapper',
        components: { FallbackColorpicker },
        props: {
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
        },
        emits: ['update:modelValue'],
        data() {
            return {
                Picker: 'FallbackColorpicker'
            };
        },
        computed: {
            value: {
                get() { return this.modelValue; },
                set(v) { this.$emit('update:modelValue', v); }
            }
        },
        async created() {
            // Intento de cargar lightvue solo si el proyecto host lo tiene instalado
            try {
                const mod = await import('lightvue/color-picker');
                this.Picker = mod.default || mod;
            } catch (e) {
                // No instalado o no compatible → usamos fallback sin romper
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('[innoboxrr-form-elements] lightvue no encontrado; usando <input type="color"> como fallback.');
                }
            }
        }
    }
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
