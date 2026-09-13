<template>

    <dialog
        ref="dialog"
        :class="classes"
        :aria-labelledby="title ? titleId : undefined"
        :aria-label="title ? undefined : (label ?? undefined)"
        @cancel="onCancel"
        @close="onClose"
        @click="onClick">

        <!-- El contenido existe solo mientras está abierto: un formulario vuelve
             limpio cada vez, y dos copias del mismo formulario no se pisan los
             ids en el DOM. -->
        <template v-if="open">

            <header v-if="title || $slots.header || dismissible" :class="headerClass">

                <slot name="header">
                    <h2 v-if="title" :id="titleId" :class="titleClass">{{ title }}</h2>
                </slot>

                <button
                    v-if="dismissible"
                    type="button"
                    :class="closeClass"
                    :aria-label="closeLabel"
                    @click="requestClose">
                    <IconComponent name="close" :size="16" />
                </button>

            </header>

            <div :class="bodyClass">
                <slot :close="requestClose" />
            </div>

            <footer v-if="$slots.footer" :class="footerClass">
                <slot name="footer" :close="requestClose" />
            </footer>

        </template>

    </dialog>

</template>

<script setup>

    /**
     * Lo común a DialogComponent y DrawerComponent: son el mismo elemento con
     * otra forma, y dos implementaciones acabarían comportándose distinto.
     */

    import { computed, useId } from 'vue'
    import IconComponent from '../IconComponent.vue'
    import { useThemeClass } from '../composables/useTheme.js'
    import { useNativeDialog } from '../composables/useNativeDialog.js'

    const props = defineProps({
        kind: { type: String, default: 'dialog' },
        open: { type: Boolean, default: false },
        title: { type: String, default: null },
        label: { type: String, default: null },
        size: { type: String, default: 'md' },
        side: { type: String, default: 'end' },
        dismissible: { type: Boolean, default: true },
        closeLabel: { type: String, default: 'Cerrar' },
    })

    const emit = defineEmits(['update:open', 'close'])

    const titleId = useId()

    const part = computed(() => (props.kind === 'drawer' ? 'drawer' : 'dialog'))

    const modifier = computed(() => {
        if (props.kind === 'drawer') {
            return props.side === 'start' ? 'drawerStart' : null
        }

        return { sm: 'dialogSmall', lg: 'dialogLarge' }[props.size] ?? null
    })

    const baseClass = useThemeClass(part)
    const modifierClass = useThemeClass(modifier)
    const headerClass = useThemeClass(() => `${part.value}Header`)
    const titleClass = useThemeClass(() => `${part.value}Title`)
    const bodyClass = useThemeClass(() => `${part.value}Body`)
    const footerClass = useThemeClass(() => `${part.value}Footer`)
    const closeClass = useThemeClass('iconButton')

    const classes = computed(() => [baseClass.value, modifierClass.value].filter(Boolean))

    const requestClose = () => {
        emit('update:open', false)
        emit('close')
    }

    const { dialog, onCancel, onClose, onClick } = useNativeDialog({
        open: () => props.open,
        dismissible: () => props.dismissible,
        requestClose,
    })

</script>
