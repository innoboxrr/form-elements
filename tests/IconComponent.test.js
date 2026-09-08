import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defaultIcons, resetIcons, setIcons } from 'innoboxrr-form-core'

/**
 * El `Icon` de @iconify/vue es un componente funcional que dibuja un `<svg>`
 * vacio cuando no tiene los datos del icono —y en las pruebas no los tiene,
 * porque los pide por red—. Con un doble se comprueba lo que este componente
 * si decide: que nombre resuelve y con que atributos lo pinta.
 */
vi.mock('@iconify/vue', () => ({
    Icon: {
        name: 'IconifyIcon',
        props: ['icon', 'width', 'height'],
        template: '<svg :data-icon="icon" :width="width" :height="height"></svg>',
    },
}))

const { default: IconComponent } = await import('../src/IconComponent.vue')

afterEach(() => resetIcons())

const factory = (props = {}) => mount(IconComponent, { props: { name: 'plus', ...props } })

const iconOf = (wrapper) => wrapper.find('svg').attributes('data-icon')

describe('IconComponent', () => {
    it('resuelve el nombre semantico contra el mapa', () => {
        expect(iconOf(factory())).toBe(defaultIcons.plus)
    })

    /**
     * El mapa es para lo que se repite. Un icono suelto se pasa entero sin
     * tener que darlo de alta.
     */
    it('deja pasar un nombre de Iconify tal cual', () => {
        expect(iconOf(factory({ name: 'mdi:home' }))).toBe('mdi:home')
    })

    it('un cambio de mapa en caliente repinta lo ya montado', async () => {
        const wrapper = factory()

        setIcons({ plus: 'lucide:plus' })
        await wrapper.vm.$nextTick()

        expect(iconOf(wrapper)).toBe('lucide:plus')
    })

    it('el tamano es opcional y se pasa a lo alto y a lo ancho', () => {
        const svg = factory({ size: 24 }).find('svg')

        expect(svg.attributes('width')).toBe('24')
        expect(svg.attributes('height')).toBe('24')
    })

    /**
     * Un icono decorativo junto a su texto no debe leerse dos veces. Cuando el
     * icono es la unica pista, la etiqueta va en el aria-label del boton que
     * lo contiene.
     */
    it('se oculta a los lectores de pantalla', () => {
        expect(factory().attributes('aria-hidden')).toBe('true')
    })

    it('admite una clase propia para el caso puntual', () => {
        expect(factory({ customClass: 'text-red-600' }).classes()).toContain('text-red-600')
    })
})
