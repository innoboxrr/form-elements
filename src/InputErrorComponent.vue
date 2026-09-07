<template>
    <div v-if="hasErrors">
        <p v-for="error in errors[type]" :key="error" :class="theme.error">{{ error }}</p>
    </div>
</template>

<script setup>

    import { computed } from 'vue'
    import { useTheme } from './composables/useTheme.js'

    const props = defineProps({
        errors: {
            type: [Object, Array],
            required: true
        },
        type: {
            type: String,
            required: true
        }
    })

    const theme = useTheme()

    const hasErrors = computed(() => Boolean(props.errors?.[props.type]?.length))

</script>

<style scoped>
    /* Estilos personalizados para los mensajes de error */
    p {
        margin: -20px 0 0 2px;
        font-size: 0.8em;
    }
</style>
