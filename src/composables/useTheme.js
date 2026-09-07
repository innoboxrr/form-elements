import { computed, onScopeDispose, shallowRef } from 'vue'
import { getTheme, onThemeChange } from 'innoboxrr-form-core'

/**
 * El tema, como referencia reactiva.
 *
 * El tema es estado de módulo, fuera de Vue: sin la suscripción, llamar a
 * `setTheme` con la aplicación ya montada no repintaría nada.
 *
 * @returns {import('vue').ShallowRef<Record<string, string>>}
 */
export function useTheme() {
    const theme = shallowRef(getTheme())

    const stop = onThemeChange((next) => {
        theme.value = { ...next }
    })

    onScopeDispose(stop)

    return theme
}

/**
 * Lo que puede llegar como token o como clase: un valor, un ref o un getter.
 *
 * @param {unknown} value
 */
const read = (value) => {
    if (typeof value === 'function') {
        return value()
    }

    // Un ref de Vue: se acepta para que un componente pueda elegir el token en
    // tiempo de ejecución, como hace ButtonComponent con `variant`.
    return (value && typeof value === 'object' && 'value' in value) ? value.value : value
}

/**
 * La clase de un control según el tema, dejando que `customClass` mande.
 *
 * @param {string|import('vue').Ref<string>|(() => string)} token
 * @param {string|null|undefined|import('vue').Ref|(() => (string|null|undefined))} customClass
 * @returns {import('vue').ComputedRef<string>}
 */
export function useThemeClass(token, customClass) {
    const theme = useTheme()

    return computed(() => {
        const custom = read(customClass)

        return custom ?? (theme.value[read(token)] ?? '')
    })
}
