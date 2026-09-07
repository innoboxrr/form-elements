<template>

    <div class="fe-mb">

        <div class="fe-inline fe-w-full">

            <label class="">{{ label }}</label>

            <Codemirror
                :placeholder="placeholder"
                :style="{ height: '400px' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="extensions"
                @ready="handleReady"
                v-model="value" />

        </div>

    </div>

</template>

<script setup>

    // Docs: https://www.npmjs.com/package/vue-codemirror

    import { computed, shallowRef } from 'vue'
    import { Codemirror } from 'vue-codemirror'
    import { html } from '@codemirror/lang-html'
    import { css } from '@codemirror/lang-css'
    import { javascript } from '@codemirror/lang-javascript'
    import { json } from '@codemirror/lang-json'
    import { oneDark } from '@codemirror/theme-one-dark'

    const props = defineProps({

        label: {
            type: String,
            required: false,
            default: ''
        },

        lang: {
            type: String,
            default: 'html'
        },

        placeholder: {
            type: String,
            default: 'Escriba su codigo aqui...'
        },

        modelValue: {
            type: String,
            default: ""
        }

    })

    const emit = defineEmits(['update:modelValue'])

    const languages = {
        html,
        css,
        javascript,
        json,
    }

    /**
     * Antes se resolvia una sola vez en setup(), asi que cambiar `lang` no
     * tenia efecto. Y un lenguaje desconocido devolvia undefined, que acababa
     * dentro del array de extensiones que recibe CodeMirror.
     */
    const extensions = computed(() => {

        const language = languages[props.lang] ?? languages.html

        return [language(), oneDark]

    })

    // La vista de CodeMirror no debe hacerse reactiva en profundidad.
    const view = shallowRef(null)

    const handleReady = (payload) => {
        view.value = payload.view
    }

    const value = computed({
        get: () => props.modelValue,
        set: (newValue) => emit('update:modelValue', newValue),
    })

    defineExpose({ view })

</script>
