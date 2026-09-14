import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

/**
 * Qué módulos de lenguaje ha evaluado el componente. Los mocks delegan en el
 * módulo real, así que el editor se configura de verdad; lo único que añaden
 * es el registro de que alguien los importó.
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

import CodeMirrorComponent from '../src/CodeMirrorComponent.vue'

const mounted = []

const mountEditor = (props = {}) => {
    const wrapper = mount(CodeMirrorComponent, { props, attachTo: document.body })

    mounted.push(wrapper)

    return wrapper
}

const languageOf = (wrapper) => wrapper.find('.cm-content').attributes('data-language')

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

/**
 * El piloto de la aplicación base generó un chunk de 580 kB (200 kB gzip) solo
 * para su editor del sitio, que únicamente edita JSON: el componente importaba
 * de forma estática html, css, javascript y json.
 */
describe('CodeMirrorComponent: lenguajes bajo demanda', () => {
    it('importar el componente no carga ningún lenguaje', () => {
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
