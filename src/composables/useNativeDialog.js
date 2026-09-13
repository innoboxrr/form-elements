import { onMounted, ref, watch } from 'vue'

/**
 * Abre y cierra un <dialog> desde un booleano, que es como lo piensa quien lo
 * usa: `v-model:open`.
 *
 * El elemento del navegador pone lo que antes había que programar —la capa
 * superior, el fondo inerte, el foco atrapado, Escape y la devolución del foco
 * al cerrar—, pero guarda su propio estado abierto. Aquí el que manda es el
 * booleano: Escape, un clic fuera o un cierre nativo solo piden cerrar, y es
 * quien abrió el diálogo el que decide.
 *
 * Donde no hay showModal() —jsdom, un navegador antiguo— se cae al atributo
 * `open`, que al menos lo muestra.
 *
 * @param {{ open: () => boolean, dismissible: () => boolean, requestClose: () => void }} options
 */
export function useNativeDialog({ open, dismissible, requestClose }) {
    /** @type {import('vue').Ref<HTMLDialogElement|null>} */
    const dialog = ref(null)

    const sync = (value) => {
        const element = dialog.value

        if (! element) {
            return
        }

        const isOpen = element.hasAttribute('open')

        if (value && ! isOpen) {
            typeof element.showModal === 'function' ? element.showModal() : element.setAttribute('open', '')
        }

        if (! value && isOpen) {
            typeof element.close === 'function' ? element.close() : element.removeAttribute('open')
        }
    }

    onMounted(() => sync(open()))

    watch(open, (value) => sync(value), { flush: 'post' })

    /**
     * Escape. Se cancela lo que haría el navegador para que el estado no se
     * separe del booleano.
     */
    const onCancel = (event) => {
        event.preventDefault()

        if (dismissible()) {
            requestClose()
        }
    }

    /**
     * Un cierre que no pasó por el booleano: un <form method="dialog">, por
     * ejemplo.
     */
    const onClose = () => {
        if (open()) {
            requestClose()
        }
    }

    /**
     * Un clic en el fondo llega con el propio <dialog> como destino y fuera de
     * su caja. Dentro de la caja, aunque el destino sea el diálogo, es un clic
     * en su contenido.
     */
    const onClick = (event) => {
        const element = dialog.value

        if (! element || event.target !== element || ! dismissible()) {
            return
        }

        const box = element.getBoundingClientRect()

        const inside = event.clientX >= box.left
            && event.clientX <= box.right
            && event.clientY >= box.top
            && event.clientY <= box.bottom

        if (! inside) {
            requestClose()
        }
    }

    return { dialog, onCancel, onClose, onClick }
}
