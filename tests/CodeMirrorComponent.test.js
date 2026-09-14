import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { EditorView } from 'codemirror'

/**
 * Qué módulos de lenguaje o de tema ha evaluado el componente. Los mocks
 * delegan en el módulo real, así que el editor se configura de verdad; lo
 * único que añaden es el registro de que alguien los importó.
 *
 * Los módulos se cachean por archivo de pruebas: una vez cargado un lenguaje,
 * sigue cargado en las pruebas siguientes. Por eso cada prueba mira lo que se
 * añade al registro, y el orden de las pruebas importa.
 */
const imported = vi.hoisted(() => [])

vi.mock('@codemirror/lang-html', async (importOriginal) => {
    imported.push('html')
    return importOriginal()
})

vi.mock('@codemirror/lang-css', async (importOriginal) => {
    imported.push('css')
    return importOriginal()
})

vi.mock('@codemirror/lang-javascript', async (importOriginal) => {
    imported.push('javascript')
    return importOriginal()
})

vi.mock('@codemirror/lang-json', async (importOriginal) => {
    imported.push('json')
    return importOriginal()
})

vi.mock('@codemirror/theme-one-dark', async (importOriginal) => {
    imported.push('one-dark')
    return importOriginal()
})

import CodeMirrorComponent from '../src/CodeMirrorComponent.vue'

const mounted = []

const mountEditor = (props = {}) => {
    const wrapper = mount(CodeMirrorComponent, { props, attachTo: document.body })

    mounted.push(wrapper)

    return wrapper
}

const languageOf = (wrapper) => wrapper.find('.cm-content').attributes('data-language')

const isDark = (wrapper) => wrapper.vm.view.state.facet(EditorView.darkTheme)

/** Da tiempo a que resuelva un import() y a que Vue repinte. */
const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await flushPromises()
}

/**
 * Un matchMedia de mentira: jsdom no trae uno. Devuelve la función que avisa
 * de un cambio en la preferencia del sistema.
 */
const preferDark = (dark) => {
    const listeners = new Set()
    let matches = dark

    vi.stubGlobal('matchMedia', (query) => ({
        get matches() {
            return query === '(prefers-color-scheme: dark)' && matches
        },
        media: query,
        addEventListener: (_event, listener) => listeners.add(listener),
        removeEventListener: (_event, listener) => listeners.delete(listener),
    }))

    return (next) => {
        matches = next
        listeners.forEach((listener) => listener({ matches: next }))
    }
}

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
    document.documentElement.removeAttribute('data-theme')
    vi.unstubAllGlobals()
})

/**
 * El piloto de la aplicación base generó un chunk de 580 kB (200 kB gzip) solo
 * para su editor del sitio, que únicamente edita JSON: el componente importaba
 * de forma estática html, css, javascript, json y el tema one-dark.
 */
describe('CodeMirrorComponent: lenguajes bajo demanda', () => {
    it('importar el componente no carga ningún lenguaje ni el tema oscuro', () => {
        expect(imported).toEqual([])
    })

    it('el editor funciona como texto plano mientras llega el lenguaje', async () => {
        const wrapper = mountEditor({ lang: 'css', modelValue: 'a { color: red }' })

        expect(wrapper.find('.cm-editor').exists()).toBe(true)
        expect(wrapper.find('.cm-content').text()).toBe('a { color: red }')
        expect(languageOf(wrapper)).toBeUndefined()

        await vi.waitFor(() => expect(languageOf(wrapper)).toBe('css'))
    })

    it('carga solo el lenguaje pedido', async () => {
        const before = imported.length

        const wrapper = mountEditor({ lang: 'json', modelValue: '{"a":1}' })

        await vi.waitFor(() => expect(languageOf(wrapper)).toBe('json'))

        expect(imported.slice(before)).toEqual(['json'])
    })

    it('un lenguaje que llega tarde no pisa al que se pidió después', async () => {
        const wrapper = mountEditor({ lang: 'javascript' })

        await wrapper.setProps({ lang: 'json' })
        await vi.waitFor(() => expect(imported).toContain('javascript'))
        await flushPromises()

        expect(languageOf(wrapper)).toBe('json')
    })

    it('cambiar lang reconfigura el editor ya montado', async () => {
        const wrapper = mountEditor({ lang: 'json' })

        await vi.waitFor(() => expect(languageOf(wrapper)).toBe('json'))

        await wrapper.setProps({ lang: 'javascript' })

        await vi.waitFor(() => expect(languageOf(wrapper)).toBe('javascript'))
    })

    /**
     * La lista es cerrada: `constructor` o `__proto__` existen en cualquier
     * objeto, y antes acababan llamados como si fueran un lenguaje.
     */
    it.each(['cobol', 'constructor', '__proto__'])('"%s" cae a html sin lanzar', async (lang) => {
        const wrapper = mountEditor({ lang })

        expect(wrapper.find('.cm-editor').exists()).toBe(true)

        await vi.waitFor(() => expect(languageOf(wrapper)).toBe('html'))
    })
})

/**
 * El editor se pintaba siempre con one-dark, también en una aplicación en modo
 * claro. Ahora sigue a innoboxrr-form-core: `data-theme` en <html> manda, y sin
 * él decide `prefers-color-scheme`. Es la misma regla que tokens.css.
 */
describe('CodeMirrorComponent: tema', () => {
    it('en claro no carga one-dark ni pinta oscuro', async () => {
        preferDark(false)

        const wrapper = mountEditor({ lang: 'json' })

        await settle()

        expect(isDark(wrapper)).toBe(false)
        expect(imported).not.toContain('one-dark')
    })

    it('sin data-theme sigue la preferencia del sistema', async () => {
        preferDark(true)

        const wrapper = mountEditor({ lang: 'json' })

        await vi.waitFor(() => expect(isDark(wrapper)).toBe(true))

        expect(imported).toContain('one-dark')
    })

    it('data-theme="dark" en la raíz pinta oscuro', async () => {
        preferDark(false)
        document.documentElement.setAttribute('data-theme', 'dark')

        const wrapper = mountEditor({ lang: 'json' })

        await vi.waitFor(() => expect(isDark(wrapper)).toBe(true))
    })

    it('data-theme="light" gana sobre un sistema en oscuro', async () => {
        preferDark(true)
        document.documentElement.setAttribute('data-theme', 'light')

        const wrapper = mountEditor({ lang: 'json' })

        await settle()

        expect(isDark(wrapper)).toBe(false)
    })

    it('cambiar el tema de la aplicación repinta el editor ya montado', async () => {
        const changeSystem = preferDark(false)

        const wrapper = mountEditor({ lang: 'json' })

        await settle()
        expect(isDark(wrapper)).toBe(false)

        document.documentElement.setAttribute('data-theme', 'dark')
        await vi.waitFor(() => expect(isDark(wrapper)).toBe(true))

        document.documentElement.removeAttribute('data-theme')
        await vi.waitFor(() => expect(isDark(wrapper)).toBe(false))

        changeSystem(true)
        await vi.waitFor(() => expect(isDark(wrapper)).toBe(true))
    })

    it('la prop theme manda sobre la aplicación, como en React', async () => {
        preferDark(false)
        document.documentElement.setAttribute('data-theme', 'dark')

        const light = mountEditor({ lang: 'json', theme: 'light' })

        await settle()
        expect(isDark(light)).toBe(false)

        document.documentElement.setAttribute('data-theme', 'light')

        const dark = mountEditor({ lang: 'json', theme: 'dark' })

        await vi.waitFor(() => expect(isDark(dark)).toBe(true))
    })

    it('sigue exponiendo la vista de CodeMirror', () => {
        const wrapper = mountEditor({ lang: 'json' })

        expect(wrapper.vm.view).toBeInstanceOf(EditorView)
    })
})

/**
 * El piloto de la aplicación base encontró que el editor se llevaba el foco al
 * montarse, aunque estuviera al final de un formulario, y que su etiqueta no
 * nombraba a nada: un lector de pantalla anunciaba un campo de texto sin nombre.
 *
 * Se espía `focus` en vez de mirar `document.activeElement` porque jsdom no
 * enfoca un elemento contenteditable como lo hace un navegador.
 */
describe('CodeMirrorComponent: foco y etiqueta', () => {
    afterEach(() => vi.restoreAllMocks())

    it('no se lleva el foco al montarse', async () => {
        const focus = vi.spyOn(EditorView.prototype, 'focus')

        mountEditor({ lang: 'json', label: 'Configuración del sitio' })

        await settle()

        expect(focus).not.toHaveBeenCalled()
    })

    it('autofocus lo pide de forma explícita', async () => {
        const focus = vi.spyOn(EditorView.prototype, 'focus')

        const wrapper = mountEditor({ lang: 'json', autofocus: true })

        await settle()

        expect(focus).toHaveBeenCalled()
        expect(focus.mock.contexts[0]).toBe(wrapper.vm.view)
    })

    it('la etiqueta nombra al editor', () => {
        const wrapper = mountEditor({ lang: 'json', label: 'Configuración del sitio' })

        const id = wrapper.find('label').attributes('id')

        expect(id).toBeTruthy()
        expect(wrapper.find('.cm-content').attributes('aria-labelledby')).toBe(id)
        expect(document.getElementById(id).textContent.trim()).toBe('Configuración del sitio')
    })

    it('sin etiqueta el editor no apunta a una vacía', () => {
        const wrapper = mountEditor({ lang: 'json' })

        expect(wrapper.find('.cm-content').attributes('aria-labelledby')).toBeUndefined()
    })

    it('un clic en la etiqueta enfoca el editor, como con un input', async () => {
        const wrapper = mountEditor({ lang: 'json', label: 'Configuración del sitio' })

        await settle()

        const focus = vi.spyOn(EditorView.prototype, 'focus')

        await wrapper.find('label').trigger('click')

        expect(focus).toHaveBeenCalledTimes(1)
    })
})
