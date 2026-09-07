<template>

    <div v-if="showForm">

        <!-- model_id -->
        <SelectSearchInputComponent
            :custom-class="customClass"
            :input-label="labelStr"
            :placeholder="placeholderStr"
            :ajax="true"
            :filterable="false"
            :method="method"
            :route="route"
            :q="q"
            :search-params="searchParams"
            :reduce="reduce"
            :get-option-label="getOptionLabel"
            :min-search-length="0"
            :multiple="multiple"
            :noOptionsText="noOptionsText"
            :debounce-time="debounceTime"
            @search="setOptions"
            v-model="modelId" />

    </div>

</template>

<script setup>

    import { computed, ref, watch } from 'vue'

    import SelectSearchInputComponent from './SelectSearchInputComponent.vue'

    const props = defineProps({

        customClass: {
            type: String,
            required: false,
            default: null
        },

        hideOnEmit: {
            type: Boolean,
            default: false
        },

        labelStr: {
            type: String,
            required: true,
        },

        placeholderStr: {
            type: String,
            required: true,
        },

        route: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            default: 'get',
        },

        q: {
            type: String,
            default: 'id'
        },

        // Vue 3 exige factoria en los defaults de objeto.
        externalFilters: {
            type: Object,
            default: () => ({})
        },

        reduce: {
            type: Function,
            default: option => option.id
        },

        getOptionLabel: {
            type: Function,
            default: option => `ID: ${option.id}`
        },

        multiple: {
            type: Boolean,
            default: false
        },

        noOptionsText: {
            type: String,
            default: 'Nothing results found',
        },

        debounceTime: {
            type: Number,
            default: 300 // valor por defecto en milisegundos
        }

    })

    /**
     * Se declaraba 'select' pero se emitia 'selected', asi que quien escuchaba
     * @select no recibia nada nunca. Se declara el que de verdad se emite.
     */
    const emit = defineEmits(['submit', 'selected'])

    const options = ref([])
    const modelId = ref([])
    const showForm = ref(true)

    // Antes se copiaban en mounted(), asi que un cambio posterior en los
    // filtros del padre no llegaba a la busqueda.
    const searchParams = computed(() => ({ ...props.externalFilters }))

    const setOptions = (newOptions) => {
        options.value = newOptions
    }

    watch(modelId, (value) => {

        emit('submit', value)

        if (Number.isInteger(value) && value > 0) {
            showForm.value = ! props.hideOnEmit
        }

        if (props.multiple || value == null) {
            return
        }

        const selected = options.value?.find((option) => option.id === value)

        if (selected) {
            emit('selected', selected)
        }

    })

</script>
