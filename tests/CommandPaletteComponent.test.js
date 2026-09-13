import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@iconify/vue', () => ({
    Icon: {
        name: 'IconifyIcon',
        props: ['icon', 'width', 'height'],
        template: '<svg :data-icon="icon"></svg>',
    },
}))

const { default: CommandPaletteComponent } = await import('../src/CommandPaletteComponent.vue')

const mounted = []

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

const items = () => [
    { id: 'products', label: 'Productos', group: 'Ir a', icon: 'box', action: vi.fn() },
    { id: 'settings', label: 'Configuración', group: 'Ir a' },
    { id: 'new', label: 'Nuevo producto', group: 'Crear', shortcut: 'N', keywords: ['alta'] },
]

const factory = (props = {}) => {
    const wrapper = mount(CommandPaletteComponent, { props: { open: true, items: items(), ...props }, attachTo: document.body })

    mounted.push(wrapper)

    return wrapper
}

const options = (wrapper) => wrapper.findAll('[role="option"]')

describe('CommandPaletteComponent', () => {
    it('muestra todo, agrupado en el orden en que llega', () => {
        const wrapper = factory()

        expect(wrapper.findAll('[role="presentation"]').map((group) => group.text())).toEqual(['Ir a', 'Crear'])
        expect(options(wrapper).map((option) => option.find('span').text())).toEqual(['Productos', 'Configuración', 'Nuevo producto'])
        expect(options(wrapper)[2].find('kbd').text()).toBe('N')
        expect(wrapper.find('dialog').classes()).toEqual(['fe-dialog', 'fe-command'])
    })

    /**
     * Quien escribe «configuracion» busca «Configuración».
     */
    it('filtra sin distinguir mayusculas ni acentos, y por palabras clave', async () => {
        const wrapper = factory()
        const input = wrapper.find('input')

        await input.setValue('CONFIGURACION')
        expect(options(wrapper).map((option) => option.text())).toEqual(['Configuración'])

        await input.setValue('alta')
        expect(options(wrapper)).toHaveLength(1)
        expect(options(wrapper)[0].text()).toContain('Nuevo producto')
    })

    it('sin coincidencias lo dice', async () => {
        const wrapper = factory()

        await wrapper.find('input').setValue('zzz')

        expect(options(wrapper)).toHaveLength(0)
        expect(wrapper.find('.fe-command-empty').text()).toBe('Sin resultados')
    })

    it('las flechas mueven la seleccion y el buscador la anuncia', async () => {
        const wrapper = factory()
        const input = wrapper.find('input')

        expect(options(wrapper)[0].attributes('aria-selected')).toBe('true')

        await input.trigger('keydown', { key: 'ArrowDown' })

        expect(options(wrapper)[1].attributes('aria-selected')).toBe('true')
        expect(input.attributes('aria-activedescendant')).toBe(options(wrapper)[1].attributes('id'))

        await input.trigger('keydown', { key: 'ArrowUp' })
        await input.trigger('keydown', { key: 'ArrowUp' })

        expect(options(wrapper)[2].attributes('aria-selected')).toBe('true')
    })

    it('Enter ejecuta lo seleccionado y cierra', async () => {
        const wrapper = factory()

        await wrapper.find('input').trigger('keydown', { key: 'Enter' })

        const [[chosen]] = wrapper.emitted('select')

        expect(chosen.id).toBe('products')
        expect(chosen.action).toHaveBeenCalledWith(chosen)
        expect(wrapper.emitted('update:open')).toEqual([[false]])
    })

    it('un clic tambien elige', async () => {
        const wrapper = factory()

        await options(wrapper)[1].trigger('click')

        expect(wrapper.emitted('select')[0][0].id).toBe('settings')
    })

    it('Ctrl+K pide abrirla desde cualquier sitio', async () => {
        const wrapper = factory({ open: false })

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))

        expect(wrapper.emitted('update:open')).toEqual([[true]])
    })

    it('sin hotkey no hay atajo', () => {
        const wrapper = factory({ open: false, hotkey: null })

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))

        expect(wrapper.emitted('update:open')).toBeUndefined()
    })

    it('al volver a abrirla el buscador esta vacio', async () => {
        const wrapper = factory()

        await wrapper.find('input').setValue('zzz')
        await wrapper.setProps({ open: false })
        await wrapper.setProps({ open: true })
        await flushPromises()

        expect(wrapper.find('input').element.value).toBe('')
        expect(options(wrapper)).toHaveLength(3)
    })
})
