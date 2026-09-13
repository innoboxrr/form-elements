<template>

    <span class="fe-inline">

        <input
            v-if="editing"
            ref="input"
            v-model="draft"
            :type="type"
            :class="inputClass"
            :aria-label="label"
            :aria-invalid="error ? 'true' : undefined"
            :disabled="saving"
            @keydown.enter.prevent="confirm"
            @keydown.esc.prevent="cancel"
            @blur="confirm" />

        <button
            v-else
            type="button"
            :class="editableClass"
            :aria-label="`${label}: ${empty ? placeholder : shown}`"
            @click="start">
            {{ empty ? placeholder : shown }}
        </button>

        <span v-if="error" :class="errorClass" role="alert">{{ error }}</span>

    </span>

</template>

<script setup>

    /**
     * Un valor que se edita donde está: en la celda de una tabla, en una ficha.
     *
     *     <ClickToEditComponent :value="producto.title" :save="(title) => updateModel(producto.id, { title })" />
     *
     * Enter o salir del campo confirman; Escape cancela. Un valor sin cambios no
     * emite nada.
     *
     * Con `save`, la confirmación espera a que termine: mientras guarda el
     * campo no se puede tocar, y si falla se queda abierto con el error, porque
     * cerrarlo mostraría un valor que no se guardó. `input` sigue emitiéndose con
     * el valor confirmado.
     *
     * Antes el valor era un <p> que solo respondía al ratón, salir del campo lo
     * dejaba abierto para siempre, y React confirmaba al salir mientras Vue no:
     * el mismo componente se usaba distinto según el framework.
     */

    import { computed, nextTick, ref, watch } from 'vue'
    import { useThemeClass } from './composables/useTheme.js'

    const props = defineProps({
        value: {
            default: '',
        },
        type: { type: String, default: 'text' },
        placeholder: { type: String, default: '—' },
        label: { type: String, default: 'Editar' },
        save: { type: Function, default: null },
        customClass: { type: String, default: null },
    })

    const emit = defineEmits(['input'])

    const editing = ref(false)
    const saving = ref(false)
    const error = ref(null)
    const draft = ref('')
    const shown = ref(props.value)
    const input = ref(null)

    watch(() => props.value, (value) => {
        shown.value = value
    })

    const inputClass = useThemeClass('input', () => props.customClass)
    const editableClass = useThemeClass('editable')
    const errorClass = useThemeClass('error')

    const empty = computed(() => shown.value === '' || shown.value === null || shown.value === undefined)

    const focus = async () => {
        await nextTick()
        input.value?.focus()
    }

    const start = () => {
        draft.value = shown.value ?? ''
        error.value = null
        editing.value = true
        focus()
    }

    const cancel = () => {
        editing.value = false
        error.value = null
    }

    const confirm = async () => {
        // Enter confirma y quita el campo, y quitarlo dispara blur: sin esta
        // guarda se confirmaría dos veces.
        if (! editing.value || saving.value) {
            return
        }

        const next = draft.value

        if (String(next) === String(shown.value ?? '')) {
            editing.value = false

            return
        }

        if (props.save) {
            saving.value = true
            error.value = null

            try {
                await props.save(next)
            } catch (failure) {
                saving.value = false
                error.value = failure?.message || 'No se pudo guardar'
                focus()

                return
            }

            saving.value = false
        }

        shown.value = next
        editing.value = false

        emit('input', next)
    }

    defineExpose({ start })

</script>
