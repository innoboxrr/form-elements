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

    import { computed, shallowRef, watch } from 'vue'
    import { Codemirror } from 'vue-codemirror'
    import { oneDark } from '@codemirror/theme-one-dark'

    import { cachedLanguage, isSupportedLanguage, loadLanguage } from './internal/codeMirrorLoaders.js'

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

    /**
     * El lenguaje llega con import(): importarlos los cuatro de forma estática
     * hacía que el piloto de la aplicación base cargara 580 kB para un editor
     * que solo edita JSON.
     *
     * Mientras llega, el editor ya funciona como texto plano. Cuando llega,
     * cambia `extensions` y vue-codemirror reconfigura su Compartment sin
     * rehacer la vista: no se pierden el cursor ni el historial.
     */
    const languageSupport = shallowRef(null)

    // Solo cuenta la última petición: un lenguaje lento no pisa al siguiente.
    let languageRequest = 0

    watch(() => props.lang, (lang) => {

        // Un lenguaje desconocido cae a html, como antes de cargarlos bajo demanda.
        const name = isSupportedLanguage(lang) ? lang : 'html'
        const request = ++languageRequest

        languageSupport.value = cachedLanguage(name)

        if (languageSupport.value) {
            return
        }

        loadLanguage(name).then((support) => {
            if (request === languageRequest) {
                languageSupport.value = support
            }
        })

    }, { immediate: true })

    const extensions = computed(() => [
        ...(languageSupport.value ? [languageSupport.value] : []),
        oneDark,
    ])

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
