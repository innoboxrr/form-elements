<template>

    <dialog
        ref="dialog"
        :class="[dialogClass, commandClass]"
        :aria-label="label"
        @cancel="onCancel"
        @close="onClose"
        @click="onClick">

        <template v-if="open">

            <input
                ref="input"
                v-model="query"
                type="text"
                :class="inputClass"
                :placeholder="placeholder"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                :aria-controls="listId"
                :aria-activedescendant="filtered.length > 0 ? optionId(active) : undefined"
                @keydown="onKeydown" />

            <ul v-if="filtered.length > 0" :id="listId" :class="listClass" role="listbox" :aria-label="label">

                <template v-for="section in sections" :key="section.group ?? ''">

                    <li v-if="section.group" role="presentation" :class="groupClass">{{ section.group }}</li>

                    <li
                        v-for="entry in section.entries"
                        :id="optionId(entry.index)"
                        :key="entry.item.id ?? entry.index"
                        role="option"
                        :aria-selected="entry.index === active ? 'true' : 'false'"
                        :class="itemClass"
                        @click="choose(entry.item)"
                        @mousemove="active = entry.index">
                        <IconComponent v-if="entry.item.icon" :name="entry.item.icon" :size="16" />
                        <span>{{ entry.item.label }}</span>
                        <kbd v-if="entry.item.shortcut" :class="kbdClass">{{ entry.item.shortcut }}</kbd>
                    </li>

                </template>

            </ul>

            <p v-else :class="emptyClass">{{ emptyText }}</p>

        </template>

    </dialog>

</template>

<script setup>

    /**
     * Buscar y ejecutar cualquier cosa sin tocar el ratón.
     *
     *     <CommandPaletteComponent v-model:open="abierta" :items="[
     *         { id: 'products', label: 'Productos', group: 'Ir a', icon: 'box', action: () => router.push(…) },
     *         { id: 'new', label: 'Nuevo producto', group: 'Crear', shortcut: 'N', keywords: ['alta'] },
     *     ]" @select="…" />
     *
     * Ctrl+K o Cmd+K la abren y la cierran desde cualquier sitio; `hotkey` cambia
     * la tecla y `null` quita el atajo. El filtro no distingue mayúsculas ni
     * acentos: quien escribe «configuracion» busca «Configuración».
     */

    import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
    import IconComponent from './IconComponent.vue'
    import { useThemeClass } from './composables/useTheme.js'
    import { useNativeDialog } from './composables/useNativeDialog.js'

    const props = defineProps({
        open: { type: Boolean, default: false },
        items: { type: Array, default: () => [] },
        placeholder: { type: String, default: 'Buscar…' },
        emptyText: { type: String, default: 'Sin resultados' },
        label: { type: String, default: 'Paleta de comandos' },
        hotkey: { type: String, default: 'k' },
    })

    const emit = defineEmits(['update:open', 'select'])

    const listId = useId()
    const query = ref('')
    const active = ref(0)
    const input = ref(null)

    const dialogClass = useThemeClass('dialog')
    const commandClass = useThemeClass('command')
    const inputClass = useThemeClass('commandInput')
    const listClass = useThemeClass('commandList')
    const groupClass = useThemeClass('commandGroup')
    const itemClass = useThemeClass('commandItem')
    const emptyClass = useThemeClass('commandEmpty')
    const kbdClass = useThemeClass('kbd')

    const normalize = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()

    const filtered = computed(() => {
        const needle = normalize(query.value).trim()

        if (needle === '') {
            return props.items
        }

        return props.items.filter((item) => normalize([item.label, item.group, ...(item.keywords ?? [])].join(' ')).includes(needle))
    })

    /**
     * Los grupos en el orden en que aparecen, cada elemento con su posición en
     * la lista plana, que es la que recorren las flechas.
     */
    const sections = computed(() => {
        const groups = new Map()

        filtered.value.forEach((item, index) => {
            const key = item.group ?? null

            if (! groups.has(key)) {
                groups.set(key, [])
            }

            groups.get(key).push({ item, index })
        })

        return [...groups].map(([group, entries]) => ({ group, entries }))
    })

    const optionId = (index) => `${listId}-${index}`

    const requestClose = () => emit('update:open', false)

    const { dialog, onCancel, onClose, onClick } = useNativeDialog({
        open: () => props.open,
        dismissible: () => true,
        requestClose,
    })

    watch(() => props.open, async (value) => {
        if (value) {
            query.value = ''
            active.value = 0

            await nextTick()

            input.value?.focus()
        }
    })

    watch(query, () => {
        active.value = 0
    })

    const choose = (item) => {
        if (! item) {
            return
        }

        requestClose()
        emit('select', item)
        item.action?.(item)
    }

    const onKeydown = (event) => {
        const total = filtered.value.length

        if (event.key === 'ArrowDown' && total > 0) {
            event.preventDefault()
            active.value = (active.value + 1) % total
        }

        if (event.key === 'ArrowUp' && total > 0) {
            event.preventDefault()
            active.value = (active.value - 1 + total) % total
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            choose(filtered.value[active.value])
        }
    }

    const onHotkey = (event) => {
        if (props.hotkey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === props.hotkey.toLowerCase()) {
            event.preventDefault()
            emit('update:open', ! props.open)
        }
    }

    onMounted(() => window.addEventListener('keydown', onHotkey))

    onBeforeUnmount(() => window.removeEventListener('keydown', onHotkey))

</script>
