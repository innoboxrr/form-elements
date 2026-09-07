<!-- FqsInputComponent.vue -->
<template>
    <div>
        <label class="block mb-4 ml-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ labels.title }}
        </label>
        <div
            v-for="(fq, index) in modelValue"
            :key="index"
            class="mb-4 relative">
            <TextInputComponent
                :custom-class="inputClass"
                type="text"
                :name="`question-${index}`"
                :label="labels.question"
                :placeholder="labels.question"
                validators="required length"
                min_length="3"
                max_length="130"
                :model-value="fq.question"
                @update:model-value="updateAt(index, 'question', $event)"
            />
            <EditorInputComponent
                :key="`answer-${index}`"
                :id="`answer-${index}`"
                :file="Boolean(uploadUrl)"
                :uploadUrl="uploadUrl"
                :name="`answer-${index}`"
                :label="labels.answer"
                :placeholder="labels.answer"
                :height="200"
                validators="required"
                :model-value="fq.answer"
                @update:model-value="updateAt(index, 'answer', $event)"
            />
            <button
                v-if="modelValue.length - 1 === index"
                @click.prevent="removeFq(index)"
                class="absolute -bottom-12 right-0 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                {{ labels.remove }}
            </button>
        </div>
        <button
            @click.prevent="addFq"
            class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ labels.add }}
        </button>
    </div>
</template>

<script setup>

    // Se importaba desde 'innoboxrr-form-elements', es decir el paquete
    // importandose a si mismo por nombre: solo resolvia si el proyecto
    // anfitrion lo tenia instalado en node_modules.
    import TextInputComponent from './TextInputComponent.vue'
    import EditorInputComponent from './EditorInputComponent.vue'

    const props = defineProps({
        modelValue: {
            type: Array,
            required: true
        },
        inputClass: {
            type: String,
            default: 'fe-input  '
        },
        // Antes se leian de globales del anfitrion (fileUploadUrl, __()) que
        // este componente no declaraba en ningun sitio.
        uploadUrl: {
            type: String,
            default: null
        },
        labels: {
            type: Object,
            default: () => ({
                title: 'Add frequency asked questions',
                question: 'Question',
                answer: 'Answer',
                add: 'Add Question',
                remove: 'Remove question',
            })
        },
    })

    const emit = defineEmits(['update:modelValue'])

    // Se mutaba el array del prop con push/splice; ahora se emite uno nuevo.
    const addFq = () => emit('update:modelValue', [...props.modelValue, { question: '', answer: '' }])

    const removeFq = (index) => emit(
        'update:modelValue',
        props.modelValue.filter((_, position) => position !== index)
    )

    const updateAt = (index, field, value) => emit(
        'update:modelValue',
        props.modelValue.map((fq, position) => position === index ? { ...fq, [field]: value } : fq)
    )

</script>
