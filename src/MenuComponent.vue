<template>

    <span class="fe-inline">

        <slot name="trigger" :toggle="toggle" :open="isOpen" :loading="loading" :trigger-props="triggerProps">
            <button
                ref="trigger"
                type="button"
                :class="iconButtonClass"
                :disabled="loading"
                v-bind="triggerProps"
                @click="toggle">
                <IconComponent :name="icon" :size="16" />
            </button>
        </slot>

        <div
            :id="menuId"
            ref="menu"
            popover="auto"
            :class="menuClass"
            :hidden="! supportsPopover && ! isOpen ? true : undefined"
            @toggle="onToggle"
            @keydown="onKeydown">

            <ul :class="listClass" role="menu" :aria-label="label">

                <template v-for="(item, index) in items" :key="item.id ?? index">

                    <li v-if="item.separator" role="separator" :class="separatorClass" />

                    <li v-else-if="item.group" role="presentation" :class="labelClass">{{ item.group }}</li>

                    <li v-else role="none">
                        <button
                            type="button"
                            role="menuitem"
                            :class="[itemClass, item.danger ? dangerClass : null]"
                            :aria-disabled="item.disabled ? 'true' : undefined"
                            :data-tooltip="item.disabled && item.disabledReason ? item.disabledReason : undefined"
                            @click="choose(item)">
                            <IconComponent v-if="item.icon" :name="item.icon" :size="14" />
                            <span>{{ item.label }}</span>
                            <kbd v-if="item.shortcut" :class="kbdClass">{{ item.shortcut }}</kbd>
                        </button>
                    </li>

                </template>

            </ul>

        </div>

    </span>

</template>

<script setup>

    /**
     * Un menú desplegable sobre el atributo popover y Floating UI.
     *
     *     <MenuComponent :items="[
     *         { id: 'edit', label: 'Editar', icon: 'edit', action: editar },
     *         { separator: true },
     *         { id: 'delete', label: 'Eliminar', icon: 'delete', danger: true, disabled: ! puede, disabledReason: 'Sin permiso' },
     *     ]" @select="…" />
     *
     * El navegador pone la capa superior, el cierre al pulsar fuera y Escape;
     * Floating UI lo coloca junto al botón. Las flechas, Inicio y Fin mueven el
     * foco entre los elementos que se pueden usar.
     *
     * `beforeOpen` se espera antes de abrir. Es para lo que tiene que estar
     * resuelto antes de enseñar el menú —los permisos de una fila—: abrirlo con
     * todo deshabilitado y habilitarlo después hace que el usuario vea
     * parpadear lo que no puede hacer.
     *
     * Un elemento sin permiso se deshabilita y explica por qué, en vez de
     * desaparecer: quien no puede tiene que saber que la acción existe.
     */

    import { computed, nextTick, onBeforeUnmount, ref, useId } from 'vue'
    import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
    import IconComponent from './IconComponent.vue'
    import { useThemeClass } from './composables/useTheme.js'

    const props = defineProps({
        items: { type: Array, default: () => [] },
        label: { type: String, default: 'Acciones' },
        icon: { type: String, default: 'more' },
        placement: { type: String, default: 'bottom-end' },
        beforeOpen: { type: Function, default: null },
    })

    const emit = defineEmits(['select', 'open', 'close'])

    const supportsPopover = typeof HTMLElement !== 'undefined'
        && typeof HTMLElement.prototype.showPopover === 'function'

    const menuId = useId()
    const trigger = ref(null)
    const menu = ref(null)
    const isOpen = ref(false)
    const loading = ref(false)

    let reference = null
    let stopPositioning = null

    const iconButtonClass = useThemeClass('iconButton')
    const menuClass = useThemeClass('menu')
    const listClass = useThemeClass('menuList')
    const itemClass = useThemeClass('menuItem')
    const dangerClass = useThemeClass('menuItemDanger')
    const separatorClass = useThemeClass('menuSeparator')
    const labelClass = useThemeClass('menuLabel')
    const kbdClass = useThemeClass('kbd')

    const triggerProps = computed(() => ({
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen.value ? 'true' : 'false',
        'aria-controls': menuId,
        'aria-label': props.label,
    }))

    const enabledItems = () => [...(menu.value?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') ?? [])]

    const focusItem = (index) => {
        const items = enabledItems()

        if (items.length > 0) {
            items[(index + items.length) % items.length].focus()
        }
    }

    const position = () => {
        const element = menu.value

        if (! reference || ! element) {
            return
        }

        const update = () => computePosition(reference, element, {
            placement: props.placement,
            strategy: 'fixed',
            middleware: [offset(4), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
            Object.assign(element.style, { left: `${x}px`, top: `${y}px` })
        })

        try {
            stopPositioning = autoUpdate(reference, element, update)
        } catch {
            // Sin ResizeObserver (jsdom) se coloca una vez y ya.
            update()
        }
    }

    const opened = async () => {
        isOpen.value = true
        emit('open')

        await nextTick()

        position()
        focusItem(0)
    }

    const closed = () => {
        const hadFocus = menu.value?.contains(document.activeElement) || document.activeElement === document.body

        isOpen.value = false
        stopPositioning?.()
        stopPositioning = null
        emit('close')

        if (hadFocus) {
            reference?.focus?.()
        }
    }

    const show = () => {
        if (supportsPopover) {
            menu.value?.showPopover()
        } else {
            opened()
        }
    }

    const hide = () => {
        if (supportsPopover) {
            try {
                menu.value?.hidePopover()
            } catch {
                // Ya estaba cerrado.
            }
        } else if (isOpen.value) {
            closed()
        }
    }

    const toggle = async (event) => {
        if (isOpen.value) {
            hide()

            return
        }

        reference = event?.currentTarget ?? trigger.value

        if (props.beforeOpen) {
            loading.value = true

            try {
                await props.beforeOpen()
            } finally {
                loading.value = false
            }
        }

        show()
    }

    const onToggle = (event) => {
        if (event.newState === 'open') {
            opened()
        } else {
            closed()
        }
    }

    const choose = (item) => {
        if (item.disabled) {
            return
        }

        hide()
        emit('select', item)
        item.action?.(item)
    }

    const onKeydown = (event) => {
        const items = enabledItems()
        const current = items.indexOf(document.activeElement)

        const moves = {
            ArrowDown: current + 1,
            ArrowUp: current - 1,
            Home: 0,
            End: items.length - 1,
        }

        if (event.key in moves) {
            event.preventDefault()
            focusItem(moves[event.key])
        }

        if (event.key === 'Escape' && ! supportsPopover) {
            hide()
        }
    }

    onBeforeUnmount(() => stopPositioning?.())

    defineExpose({ open: show, close: hide })

</script>
