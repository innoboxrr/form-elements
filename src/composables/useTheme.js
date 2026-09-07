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
 * La clase de un control según el tema, dejando que `customClass` mande.
 *
 * @param {string} token
 * @param {() => (string|null|undefined)} customClass
 * @returns {import('vue').ComputedRef<string>}
 */
export function useThemeClass(token, customClass) {
    const theme = useTheme()

    return computed(() => {
        const custom = typeof customClass === 'function' ? customClass() : customClass

        return custom ?? (theme.value[token] ?? '')
    })
}
