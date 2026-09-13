import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@iconify/vue', () => ({
    Icon: {
        name: 'IconifyIcon',
        props: ['icon', 'width', 'height'],
        template: '<svg :data-icon="icon"></svg>',
    },
}))

/**
 * Floating UI mide el DOM, y jsdom no tiene medidas. Se comprueba que el menú
 * le pide la posición y aplica la que recibe.
 */
vi.mock('@floating-ui/dom', () => ({
    autoUpdate: vi.fn((reference, floating, update) => {
        update()

        return () => {}
    }),
    computePosition: vi.fn(() => Promise.resolve({ x: 10, y: 20 })),
    flip: vi.fn(),
    offset: vi.fn(),
    shift: vi.fn(),
}))

const { default: MenuComponent } = await import('../src/MenuComponent.vue')

const mounted = []

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

const items = () => [
    { id: 'show', label: 'Ver', icon: 'show', action: vi.fn() },
    { id: 'edit', label: 'Editar', icon: 'edit', shortcut: 'E' },
    { separator: true },
    { group: 'Peligro' },
    { id: 'delete', label: 'Eliminar', icon: 'delete', danger: true, disabled: true, disabledReason: 'Sin permiso' },
]

const factory = (props = {}) => {
    const wrapper = mount(MenuComponent, { props: { items: items(), ...props }, attachTo: document.body })

    mounted.push(wrapper)

    return wrapper
}

const trigger = (wrapper) => wrapper.find('button[aria-haspopup="menu"]')
const menu = (wrapper) => wrapper.find('[popover]')

describe('MenuComponent', () => {
    it('empieza cerrado', () => {
        const wrapper = factory()

        expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
        expect(menu(wrapper).attributes('hidden')).toBeDefined()
    })

    it('abre junto al boton y lleva el foco al primer elemento usable', async () => {
        const wrapper = factory()

        await trigger(wrapper).trigger('click')
        await flushPromises()

        expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
        expect(menu(wrapper).attributes('hidden')).toBeUndefined()
        expect(menu(wrapper).attributes('style')).toContain('left: 10px')
        expect(document.activeElement.textContent).toContain('Ver')
    })

    it('elegir un elemento lo ejecuta, lo emite y cierra', async () => {
        const wrapper = factory()

        await trigger(wrapper).trigger('click')
        await flushPromises()
        await wrapper.findAll('[role="menuitem"]')[0].trigger('click')

        const [[chosen]] = wrapper.emitted('select')

        expect(chosen.id).toBe('show')
        expect(chosen.action).toHaveBeenCalledWith(chosen)
        expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
    })

    /**
     * Quien no tiene permiso tiene que saber que la acción existe y por qué
     * no puede usarla.
     */
    it('un elemento sin permiso se ve, se explica y no hace nada', async () => {
        const wrapper = factory()

        await trigger(wrapper).trigger('click')
        await flushPromises()

        const eliminar = wrapper.findAll('[role="menuitem"]')[2]

        expect(eliminar.attributes('aria-disabled')).toBe('true')
        expect(eliminar.attributes('data-tooltip')).toBe('Sin permiso')
        expect(eliminar.classes()).toEqual(['fe-menu-item', 'fe-menu-item-danger'])

        await eliminar.trigger('click')

        expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('pinta separadores, etiquetas y atajos con el tema', async () => {
        const wrapper = factory()

        expect(wrapper.find('[role="separator"]').classes()).toEqual(['fe-menu-separator'])
        expect(wrapper.find('[role="presentation"]').text()).toBe('Peligro')
        expect(wrapper.find('kbd').classes()).toEqual(['fe-kbd'])
        expect(menu(wrapper).classes()).toEqual(['fe-menu'])
    })

    it('las flechas recorren solo lo que se puede usar', async () => {
        const wrapper = factory()

        await trigger(wrapper).trigger('click')
        await flushPromises()

        await menu(wrapper).trigger('keydown', { key: 'ArrowDown' })
        expect(document.activeElement.textContent).toContain('Editar')

        // Eliminar está deshabilitado: después de Editar se vuelve a Ver.
        await menu(wrapper).trigger('keydown', { key: 'ArrowDown' })
        expect(document.activeElement.textContent).toContain('Ver')

        await menu(wrapper).trigger('keydown', { key: 'End' })
        expect(document.activeElement.textContent).toContain('Editar')
    })

    /**
     * Abrir con todo deshabilitado y habilitarlo después hace parpadear lo que
     * no se puede hacer. Por eso se espera antes de abrir.
     */
    it('espera a beforeOpen antes de abrir', async () => {
        let release
        const beforeOpen = vi.fn(() => new Promise((resolve) => { release = resolve }))
        const wrapper = factory({ beforeOpen })

        await trigger(wrapper).trigger('click')

        expect(beforeOpen).toHaveBeenCalled()
        expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
        expect(trigger(wrapper).attributes('disabled')).toBeDefined()

        release()
        await flushPromises()

        expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    })

    it('Escape cierra', async () => {
        const wrapper = factory()

        await trigger(wrapper).trigger('click')
        await flushPromises()
        await menu(wrapper).trigger('keydown', { key: 'Escape' })

        expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
    })
})
