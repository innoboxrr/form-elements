<template>

    <div>

        <input
            v-if="edit"
            ref="input"
            class="fe-input"
            type="text"
            :value="valueLocal"
            @keyup.esc="cancel"
            @keyup.enter="confirm" />

        <p v-else @click="startEditing">

            {{ valueLocal }}

        </p>

    </div>

</template>

<script setup>

    import { nextTick, ref, watch } from 'vue'

    const props = defineProps({
        value: {
            default: ''
        }
    })

    const emit = defineEmits(['input'])

    const edit = ref(false)
    const valueLocal = ref(props.value)
    const input = ref(null)

    watch(() => props.value, (value) => {
        valueLocal.value = value
    })

    /**
     * El autofoco lo hacia una directiva local con el hook `inserted`, que es
     * de Vue 2 (en Vue 3 se llama `mounted`), asi que nunca llegaba a
     * ejecutarse. Con una ref el foco no depende de ningun hook.
     */
    const startEditing = async () => {
        edit.value = true

        await nextTick()

        input.value?.focus()
    }

    const cancel = () => {
        valueLocal.value = props.value
        edit.value = false
    }

    const confirm = (event) => {
        valueLocal.value = event.target.value
        edit.value = false

        emit('input', valueLocal.value)
    }

</script>
