<template>
    <div>
        <label
            v-if="label"
            :class="labelClass">
            {{ label }}
        </label>

        <draggable
            v-model="value"
            handle=".drag-handle"
            item-key="__draggable_key"
            :class="groupClass"
        >
            <template #item="{ element: group, index: groupIndex }">
                <div
                    :class="cardClass"
                    :key="groupIndex"
                >
                    <!-- ENCABEZADO -->
                    <div
                        :class="toolbarClass"
                        @click.prevent="group._collapsed = !group._collapsed"
                    >
                        <button
                            type="button"
                            :class="[iconButtonClass, dragHandleClass, 'drag-handle']"
                            :aria-label="`Mover grupo ${groupIndex + 1}`"
                            @click.prevent.stop>
                            <IconComponent name="drag" />
                        </button>
                        <h4 :class="groupTitleClass">
                            {{ __('Item') }} #{{ groupIndex + 1 }}
                        </h4>
                        <span :class="spacerClass" />
                        <button
                            type="button"
                            :class="iconButtonClass"
                            title="Duplicar grupo"
                            aria-label="Duplicar grupo"
                            @click.prevent.stop="duplicateGroup(groupIndex)">
                            <IconComponent name="copy" />
                        </button>
                        <button
                            type="button"
                            :class="[iconButtonClass, iconButtonDangerClass]"
                            :title="__('Eliminar grupo')"
                            :aria-label="__('Eliminar grupo')"
                            @click.prevent.stop="removeGroup(groupIndex)">
                            <IconComponent name="delete" />
                        </button>
                        <button
                            type="button"
                            :class="iconButtonClass"
                            title="Expandir/Colapsar"
                            aria-label="Expandir/Colapsar"
                            :aria-expanded="! group._collapsed ? 'true' : 'false'">
                            <IconComponent :name="! group._collapsed ? 'down' : 'up'" />
                        </button>
                    </div>

                    <!-- CUERPO -->
                    <div
                        v-show="!group._collapsed"
                        class="fe-card-body"
                    >
                        <div
                            v-for="(field, fieldIndex) in inputsConfig"
                            :key="fieldIndex"
                        >
                            <component
                                :is="resolveComponent(field.type)"
                                v-model="group[field.key]"
                                v-bind="getFieldAttributes(field, groupIndex, fieldIndex)"
                                @paste="handlePaste($event, groupIndex, field)"
                            >
                                <template v-slot>
                                    <option
                                        v-for="option in field.options"
                                        :key="option.value"
                                        :value="option.value"
                                        :disabled="option.disabled">
                                        {{ option.text }}
                                    </option>
                                </template>
                            </component>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>

        <!-- BOTÓN PARA AÑADIR -->
        <button
            type="button"
            :class="[buttonClass, 'fe-mt']"
            @click.prevent="addGroup">
            {{ addButtonLabel || __('Add') }}
        </button>
    </div>
</template>


<script setup>

import { computed } from 'vue'
import IconComponent from './IconComponent.vue'
import draggable from 'vuedraggable'
import TextInputComponent from './TextInputComponent.vue'
import SelectInputComponent from './SelectInputComponent.vue'
import TextareaInputComponent from './TextareaInputComponent.vue'
import EditorInputComponent from './EditorInputComponent.vue'
import { useThemeClass } from './composables/useTheme.js'

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    inputsConfig: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    addButtonLabel: {
        type: String,
        default: ''
    },
    removeButtonLabel: {
        type: String,
        default: ''
    },
    hasSufix: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue'])

// El aspecto sale del tema, con el mismo marcado que la rama React: cada grupo
// es una superficie con su barra. Antes eran clases de Tailwind y colores
// escritos para el modo oscuro que el paquete no declara.
const labelClass = useThemeClass('label')
const groupClass = useThemeClass('group')
const cardClass = useThemeClass('surface')
const toolbarClass = useThemeClass('toolbar')
const spacerClass = useThemeClass('toolbarSpacer')
const groupTitleClass = useThemeClass('groupTitle')
const iconButtonClass = useThemeClass('iconButton')
const iconButtonDangerClass = useThemeClass('iconButtonDanger')
const dragHandleClass = useThemeClass('dragHandle')
const buttonClass = useThemeClass('button')

const value = computed({
    get: () => props.modelValue,
    set: (newValue) => emit('update:modelValue', newValue),
})

/**
 * Devolvia el nombre del componente como cadena, lo que exige que este
 * registrado globalmente. Con <script setup> los componentes son locales, asi
 * que se devuelve el objeto.
 */
const COMPONENTS = {
    text: TextInputComponent,
    editor: EditorInputComponent,
    select: SelectInputComponent,
    textarea: TextareaInputComponent,
}

const resolveComponent = (type) => COMPONENTS[type] ?? 'div'

const emptyGroup = (overrides = {}) => {

    const group = { _collapsed: false, __draggable_key: Date.now() + Math.random() }

    props.inputsConfig.forEach((field) => {
        group[field.key] = ''
    })

    return { ...group, ...overrides }

}

// Antes se hacia push/splice sobre el array del prop, es decir mutandolo.
const addGroup = () => emit('update:modelValue', [...props.modelValue, emptyGroup()])

const duplicateGroup = (index) => {

    const clone = {
        ...props.modelValue[index],
        _collapsed: false,
        __draggable_key: Date.now() + Math.random(),
    }

    const next = [...props.modelValue]

    next.splice(index + 1, 0, clone)

    emit('update:modelValue', next)

}

const removeGroup = (index) => emit(
    'update:modelValue',
    props.modelValue.filter((_, position) => position !== index)
)

const getFieldAttributes = (field, groupIndex, fieldIndex) => ({
    ...field.attributes,
    id: `${field.key}-${groupIndex}-${fieldIndex}`,
    name: `${field.key}-${groupIndex}-${fieldIndex}`,
    label: props.hasSufix ? `${field.attributes.label} #${groupIndex + 1}` : field.attributes.label,
})

const handlePaste = (event, groupIndex, field) => {

    if (! field?.attributes?.enablePasteList) {
        return
    }

    const pastedText = (event.clipboardData ?? window.clipboardData)?.getData('text') ?? ''

    const items = pastedText
        .split(pastedText.includes('\n') ? '\n' : ',')
        .map((item) => item.trim())
        .filter(Boolean)

    if (items.length <= 1) {
        return
    }

    event.preventDefault()

    const confirmSplit = confirm(
        `Se detectaron multiples valores para "${field.attributes.label}".\n¿Deseas dividirlos en grupos separados?`
    )

    if (! confirmSplit) {
        return
    }

    const next = [...props.modelValue]

    next[groupIndex] = { ...next[groupIndex], [field.key]: items[0] }

    for (let i = 1; i < items.length; i++) {
        next.splice(groupIndex + i, 0, emptyGroup({ [field.key]: items[i] }))
    }

    emit('update:modelValue', next)

}

</script>
