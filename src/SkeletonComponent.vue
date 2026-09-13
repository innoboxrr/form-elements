<template>

    <div aria-hidden="true" :data-shape="shape">
        <span
            v-for="n in count"
            :key="n"
            :class="[skeletonClass, shapeClass]"
            :style="styleFor(n)" />
    </div>

</template>

<script setup>

    /**
     * La forma de lo que va a llegar, mientras llega.
     *
     *     <SkeletonComponent :lines="3" />
     *     <SkeletonComponent shape="circle" width="3rem" />
     *     <SkeletonComponent shape="block" height="12rem" />
     *
     * Es aria-hidden: lo que anuncia la carga a un lector es el aria-busy del
     * contenedor que la espera, no cada rectángulo.
     */

    import { computed } from 'vue'
    import { useThemeClass } from './composables/useTheme.js'

    const props = defineProps({
        shape: { type: String, default: 'text' },
        lines: { type: Number, default: 1 },
        width: { type: [String, Number], default: null },
        height: { type: [String, Number], default: null },
    })

    const TOKENS = { text: 'skeletonText', circle: 'skeletonCircle', block: 'skeletonBlock' }

    const skeletonClass = useThemeClass('skeleton')
    const shapeClass = useThemeClass(() => TOKENS[props.shape] ?? 'skeletonText')

    const count = computed(() => (props.shape === 'text' ? Math.max(1, props.lines) : 1))

    const size = (value) => (typeof value === 'number' ? `${value}px` : value)

    const styleFor = (n) => {
        // Varias líneas iguales se leen como una tabla; la última más corta,
        // como un párrafo.
        const last = props.shape === 'text' && count.value > 1 && n === count.value

        return {
            width: last ? '60%' : size(props.width) ?? undefined,
            height: size(props.height) ?? undefined,
        }
    }

</script>
