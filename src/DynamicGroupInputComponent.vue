<template>
    <div>
        <label 
            v-if="label"
            class="block mb-4 ml-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            {{ label }}
        </label>

        <draggable
            v-model="value"
            handle=".drag-handle"
            item-key="__draggable_key"
            class="space-y-2 rounded-lg"
        >
            <template #item="{ element: group, index: groupIndex }">
                <div 
                    class="border rounded-lg bg-white dark:bg-slate-800 shadow-sm relative dark:border-slate-600"
                    :key="groupIndex"
                >
                    <!-- ENCABEZADO -->
                    <div 
                        class="flex justify-between items-center px-4 py-3 border-b bg-slate-50 dark:bg-slate-700 dark:border-slate-600 cursor-pointer rounded-t-lg border-b-slate-200 dark:border-b-slate-600"
                        @click.prevent="group._collapsed = !group._collapsed"
                    >
                        <div class="flex items-center gap-2">
                            <div class="cursor-move drag-handle text-slate-400">
                                <i class="fa-solid fa-grip-vertical"></i>
                            </div>
                            <h4 class="text-md font-semibold text-slate-800 dark:text-slate-100">
                                {{ __('Item') }} #{{ groupIndex + 1 }}
                            </h4>
                        </div>
                        <div class="flex items-center space-x-4 text-slate-400">
                            <button
                                @click.prevent.stop="duplicateGroup(groupIndex)"
                                title="Duplicar grupo"
                                class="hover:text-blue-500 transition mr-2">
                                <i class="fa-solid fa-clone"></i>
                            </button>
                            <button
                                class="text-red-800 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300"
                                :title="__('Eliminar grupo')"
                                @click.prevent.stop="removeGroup(groupIndex)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <button
                                title="Expandir/Colapsar"
                                class="hover:text-slate-600 dark:hover:text-slate-300 transition">
                                <i
                                    :class="[
                                        'fa-solid',
                                        !group._collapsed ? 'fa-chevron-down' : 'fa-chevron-up'
                                    ]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- CUERPO -->
                    <div 
                        v-show="!group._collapsed"
                        class="px-6 py-4 bg-white dark:bg-slate-800"
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
            @click.prevent="addGroup" 
            class="mt-6 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ addButtonLabel || __('Add') }}
        </button>
    </div>
</template>


<script setup>

import { computed } from 'vue'
import draggable from 'vuedraggable'
import TextInputComponent from './TextInputComponent.vue'
import SelectInputComponent from './SelectInputComponent.vue'
import TextareaInputComponent from './TextareaInputComponent.vue'
import EditorInputComponent from './EditorInputComponent.vue'

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
