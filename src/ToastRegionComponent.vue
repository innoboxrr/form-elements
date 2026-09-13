<template>

    <div
        ref="region"
        :class="regionClass"
        popover="manual"
        role="region"
        :aria-label="label"
        :hidden="! supportsPopover && toasts.length === 0 ? true : undefined">

        <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[toastClass, variantClass(toast.variant)]"
            :role="toast.variant === 'danger' ? 'alert' : 'status'"
            :data-variant="toast.variant">

            <div>
                <strong v-if="toast.title" :class="titleClass">{{ toast.title }}</strong>
                <span>{{ toast.message }}</span>
            </div>

            <button
                type="button"
                :class="[iconButtonClass, closeClass]"
                :aria-label="closeLabel"
                @click="dismiss(toast.id)">
                <IconComponent name="close" :size="14" />
            </button>

        </div>

    </div>

</template>

<script setup>

    /**
     * Donde aparecen los avisos de `notify()`. Se monta una vez, en la raíz de
     * la aplicación.
     *
     *     <ToastRegionComponent />
     *
     * Va en la capa superior con popover="manual": un aviso que llega con un
     * drawer abierto con showModal() quedaría debajo del fondo inerte, y justo
     * ahí es donde se guarda un formulario.
     */

    import { nextTick, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue'
    import { dismiss, getToasts, onToastsChange } from 'innoboxrr-form-core'
    import IconComponent from './IconComponent.vue'
    import { useTheme, useThemeClass } from './composables/useTheme.js'

    defineProps({
        label: { type: String, default: 'Avisos' },
        closeLabel: { type: String, default: 'Cerrar' },
    })

    const supportsPopover = typeof HTMLElement !== 'undefined'
        && typeof HTMLElement.prototype.showPopover === 'function'

    const region = ref(null)
    const toasts = shallowRef(getToasts())

    onScopeDispose(onToastsChange((next) => {
        toasts.value = next
    }))

    const theme = useTheme()
    const regionClass = useThemeClass('toastRegion')
    const toastClass = useThemeClass('toast')
    const titleClass = useThemeClass('toastTitle')
    const iconButtonClass = useThemeClass('iconButton')
    const closeClass = useThemeClass('toastClose')

    const variantClass = (variant) => ({
        success: theme.value.toastSuccess,
        danger: theme.value.toastDanger,
        warning: theme.value.toastWarning,
    })[variant] ?? ''

    const isShown = (element) => {
        try {
            return element.matches(':popover-open')
        } catch {
            return false
        }
    }

    const place = (previous = 0) => {
        const element = region.value

        if (! element || ! supportsPopover) {
            return
        }

        const count = toasts.value.length

        if (count === 0) {
            if (isShown(element)) {
                element.hidePopover()
            }

            return
        }

        // Un diálogo abierto después que la región queda por encima de ella.
        // Volver a mostrarla la sube; solo se hace entonces, porque reinicia
        // la animación de los avisos que ya estaban.
        const modalOpen = document.querySelector('dialog[open]') !== null

        if (isShown(element) && count > previous && modalOpen) {
            element.hidePopover()
        }

        if (! isShown(element)) {
            element.showPopover()
        }
    }

    onMounted(() => place())

    watch(toasts, async (next, previous) => {
        await nextTick()
        place(previous?.length ?? 0)
    })

</script>
