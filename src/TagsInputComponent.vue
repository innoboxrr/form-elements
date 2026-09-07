<template>
    <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                <span v-if="help" class="cursor-pointer">
                    <i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
                </span>
                {{ label }}
            </label>

            <input
                :class="customClass"
                type="text"
                ref="tagsInput"
                :name="name"
                :placeholder="placeholder" />
        </div>
    </div>
</template>

<script setup>

import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Tagify from '@yaireo/tagify'
import './css/tagify.css'

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    help: {
        type: String,
        default: null
    },
    customClass: {
        type: String,
        default: 'uk-input uk-form-large uk-border-rounded'
    },
    name: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Array],
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const tagsInput = ref(null)

let tagify = null

const onTagChange = () => emit('update:modelValue', tagify.value.map((tag) => tag.value))

onMounted(() => {

    tagify = new Tagify(tagsInput.value)

    tagify.on('add', onTagChange)
    tagify.on('remove', onTagChange)

    syncTags(props.modelValue)

})

onBeforeUnmount(() => {

    tagify?.destroy()
    tagify = null

})

const syncTags = (value) => {

    if (! tagify) {
        return
    }

    const tags = Array.isArray(value) ? value : []
    const current = tagify.value.map((tag) => tag.value)

    if (JSON.stringify(current) !== JSON.stringify(tags)) {
        tagify.loadOriginalValues(tags)
    }

}

// El watcher era immediate, pero en ese momento tagify aun no existia: la
// sincronizacion inicial la hace ahora onMounted.
watch(() => props.modelValue, syncTags)

</script>
