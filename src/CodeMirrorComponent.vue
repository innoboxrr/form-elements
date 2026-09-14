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

    import { useColorScheme } from './composables/useColorScheme.js'
    import {
        cachedDarkTheme,
        cachedLanguage,
        isSupportedLanguage,
        loadDarkTheme,
        loadLanguage,
    } from './internal/codeMirrorLoaders.js'

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

        /**
         * `auto` sigue a la aplicación, con la misma regla que tokens.css de
         * innoboxrr-form-core. `dark` y `light` la fuerzan, como la prop
         * `theme` del gemelo React.
         */
        theme: {
            type: String,
            default: 'auto',
            validator: (value) => ['auto', 'dark', 'light'].includes(value)
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

    /**
     * Antes el editor llevaba one-dark siempre, también en una aplicación en
     * modo claro. Ahora sigue a la aplicación, y one-dark solo se descarga la
     * primera vez que hace falta pintar en oscuro.
     */
    const colorScheme = useColorScheme()

    const resolvedTheme = computed(() => (
        props.theme === 'dark' || props.theme === 'light' ? props.theme : colorScheme.value
    ))

    const darkTheme = shallowRef(cachedDarkTheme())

    watch(resolvedTheme, (theme) => {

        if (theme !== 'dark' || darkTheme.value) {
            return
        }

        loadDarkTheme().then((extension) => {
            darkTheme.value = extension
        })

    }, { immediate: true })

    const extensions = computed(() => [
        ...(languageSupport.value ? [languageSupport.value] : []),
        ...(resolvedTheme.value === 'dark' && darkTheme.value ? [darkTheme.value] : []),
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
