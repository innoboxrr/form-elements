<template>

    <DialogShell
        kind="dialog"
        size="sm"
        :open="confirmation !== null"
        :title="confirmation?.title ?? null"
        :close-label="closeLabel"
        @update:open="(value) => { if (! value) answer(false) }">

        <p>{{ confirmation?.message }}</p>

        <template #footer>

            <!-- El foco empieza en cancelar: un Enter por inercia no debe borrar
                 nada. -->
            <button type="button" :class="secondaryClass" autofocus @click="answer(false)">
                {{ confirmation?.cancelLabel }}
            </button>

            <button
                type="button"
                :class="confirmation?.variant === 'danger' ? dangerClass : primaryClass"
                @click="answer(true)">
                {{ confirmation?.confirmLabel }}
            </button>

        </template>

    </DialogShell>

</template>

<script setup>

    /**
     * Donde se pregunta lo que pide `confirmAction()`. Se monta una vez, en la
     * raíz de la aplicación.
     *
     *     <ConfirmHostComponent />
     *
     * Cerrar con Escape o con un clic fuera cuenta como cancelar.
     */

    import { onScopeDispose, shallowRef } from 'vue'
    import { getConfirmation, onConfirmationChange, resolveConfirmation } from 'innoboxrr-form-core'
    import DialogShell from './internal/DialogShell.vue'
    import { useThemeClass } from './composables/useTheme.js'

    defineProps({
        closeLabel: { type: String, default: 'Cerrar' },
    })

    const confirmation = shallowRef(getConfirmation())

    onScopeDispose(onConfirmationChange((next) => {
        confirmation.value = next
    }))

    const primaryClass = useThemeClass('button')
    const secondaryClass = useThemeClass('buttonSecondary')
    const dangerClass = useThemeClass('buttonDanger')

    const answer = (value) => resolveConfirmation(value)

</script>
