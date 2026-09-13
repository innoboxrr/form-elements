<template>

    <DialogShell
        kind="drawer"
        :open="open"
        :title="title"
        :label="label"
        :side="side"
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
     * Un panel lateral modal sobre <dialog>: crear o editar sin salir de la
     * tabla, que sigue a la vista detrás.
     *
     *     <DrawerComponent v-model:open="abierto" title="Nuevo producto">
     *         <CreateForm @submit="…" />
     *     </DrawerComponent>
     *
     * `side="start"` lo pega a la izquierda.
     */

    import DialogShell from './internal/DialogShell.vue'

    defineProps({
        open: { type: Boolean, default: false },
        title: { type: String, default: null },
        label: { type: String, default: null },
        side: { type: String, default: 'end' },
        dismissible: { type: Boolean, default: true },
        closeLabel: { type: String, default: 'Cerrar' },
    })

    const emit = defineEmits(['update:open', 'close'])

</script>
