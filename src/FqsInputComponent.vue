<!-- FqsInputComponent.vue -->
<template>
    <div>
        <h4 class="fe-group-title fe-mb-sm">
            {{ labels.title }}
        </h4>
        <div
            v-for="(fq, index) in modelValue"
            :key="index"
            class="fe-card fe-card-sm fe-card-body fe-mb">
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
                type="button"
                class="fe-button-danger fe-button-sm"
                @click.prevent="removeFq(index)">
                {{ labels.remove }}
            </button>
        </div>
        <button
            type="button"
            class="fe-button"
            @click.prevent="addFq">
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
