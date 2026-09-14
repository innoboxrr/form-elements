import { onScopeDispose, shallowRef } from 'vue'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * El esquema de color con el que innoboxrr-form-core pinta la aplicación.
 *
 * form-core lo decide solo en CSS (tokens.css): `data-theme` en la raíz manda
 * en las dos direcciones, y sin él decide `prefers-color-scheme`. Un
 * componente que pinta sus colores desde JavaScript, como CodeMirror, tiene
 * que aplicar la misma regla; si no, se queda oscuro en una aplicación clara.
 *
 * @returns {'dark'|'light'}
 */
export function readColorScheme() {
    if (typeof document === 'undefined') {
        return 'light'
    }

    const explicit = document.documentElement.getAttribute('data-theme')

    if (explicit === 'dark' || explicit === 'light') {
        return explicit
    }

    return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches
        ? 'dark'
        : 'light'
}

/**
 * El esquema de color como referencia reactiva: cambia cuando la aplicación
 * cambia `data-theme` o cuando el sistema cambia de preferencia.
 *
 * @returns {import('vue').ShallowRef<'dark'|'light'>}
 */
export function useColorScheme() {
    const scheme = shallowRef(readColorScheme())

    if (typeof document === 'undefined') {
        return scheme
    }

    const update = () => {
        scheme.value = readColorScheme()
    }

    const observer = typeof MutationObserver === 'function' ? new MutationObserver(update) : null

    observer?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const media = typeof window.matchMedia === 'function' ? window.matchMedia(DARK_QUERY) : null

    media?.addEventListener?.('change', update)

    onScopeDispose(() => {
        observer?.disconnect()
        media?.removeEventListener?.('change', update)
    })

    return scheme
}
