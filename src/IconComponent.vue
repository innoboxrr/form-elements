<template>

    <Icon
        :icon="resolved"
        :width="size"
        :height="size"
        :class="customClass"
        aria-hidden="true" />

</template>

<script setup>

    /**
     * Un icono, por nombre semantico.
     *
     *     <IconComponent name="plus" />
     *     <IconComponent name="mdi:home" :size="24" />
     *
     * El nombre se resuelve contra el mapa de innoboxrr-form-core, asi que
     * cambiar el juego de iconos de todo el proyecto es un `setIcons()` en el
     * arranque y no tocar un solo componente.
     *
     * Es `aria-hidden` a proposito: un icono decorativo junto a su texto no
     * debe leerse dos veces. Cuando el icono es la unica pista —un boton solo
     * con icono— la etiqueta va en el `aria-label` del boton, que es donde el
     * lector la espera.
     */

    import { computed } from 'vue'
    import { Icon } from '@iconify/vue'
    import { iconFor, onIconChange } from 'innoboxrr-form-core'
    import { ref, onScopeDispose } from 'vue'

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        size: {
            type: [Number, String],
            default: null,
        },
        customClass: {
            type: String,
            default: null,
        },
    })

    // Un cambio de mapa en caliente tiene que repintar lo ya montado; sin esto
    // `setIcons()` solo afectaria a lo que se montara despues.
    const version = ref(0)

    onScopeDispose(onIconChange(() => version.value++))

    const resolved = computed(() => {
        version.value

        return iconFor(props.name)
    })

</script>
