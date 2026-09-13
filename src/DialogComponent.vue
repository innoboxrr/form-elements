<template>

    <DialogShell
        kind="dialog"
        :open="open"
        :title="title"
        :label="label"
        :size="size"
        :dismissible="dismissible"
        :close-label="closeLabel"
        @update:open="(value) => emit('update:open', value)"
        @close="emit('close')">

        <template v-if="$slots.header" #header><slot name="header" /></template>

        <template #default="scope"><slot v-bind="scope" /></template>

        <template v-if="$slots.footer" #footer="scope"><slot name="footer" v-bind="scope" /></template>

    </DialogShell>

</template>

<script setup>

    /**
     * Un diálogo modal sobre <dialog>.
     *
     *     <DialogComponent v-model:open="abierto" title="Borrar producto">
     *         ¿Seguro?
     *         <template #footer="{ close }">…</template>
     *     </DialogComponent>
     *
     * `dismissible: false` impide cerrarlo con Escape, con un clic fuera y
     * quita la X: para lo que no puede abandonarse a medias.
     */

    import DialogShell from './internal/DialogShell.vue'

    defineProps({
        open: { type: Boolean, default: false },
        title: { type: String, default: null },
        label: { type: String, default: null },
        size: { type: String, default: 'md' },
        dismissible: { type: Boolean, default: true },
        closeLabel: { type: String, default: 'Cerrar' },
    })

    const emit = defineEmits(['update:open', 'close'])

</script>
