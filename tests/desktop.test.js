import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { confirmAction, notify, notifyError, resetConfirmation, resetToasts } from 'innoboxrr-form-core'

vi.mock('@iconify/vue', () => ({
    Icon: {
        name: 'IconifyIcon',
        props: ['icon', 'width', 'height'],
        template: '<svg :data-icon="icon"></svg>',
    },
}))

const { default: DialogComponent } = await import('../src/DialogComponent.vue')
const { default: DrawerComponent } = await import('../src/DrawerComponent.vue')
const { default: ToastRegionComponent } = await import('../src/ToastRegionComponent.vue')
const { default: ConfirmHostComponent } = await import('../src/ConfirmHostComponent.vue')
const { default: SkeletonComponent } = await import('../src/SkeletonComponent.vue')

const mounted = []

const attach = (component, options = {}) => {
    const wrapper = mount(component, { attachTo: document.body, ...options })

    mounted.push(wrapper)

    return wrapper
}

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
    resetToasts()
    resetConfirmation()
})

const cancel = (element) => {
    const event = new Event('cancel', { cancelable: true })

    element.dispatchEvent(event)

    return event
}

describe('DialogComponent', () => {
    const factory = (props = {}, slots = {}) => attach(DialogComponent, {
        props: { title: 'Borrar producto', ...props },
        slots: { default: () => 'Contenido', ...slots },
    })

    it('abre y cierra desde open', async () => {
        const wrapper = factory({ open: false })
        const dialog = wrapper.find('dialog')

        expect(dialog.attributes('open')).toBeUndefined()
        expect(wrapper.text()).not.toContain('Contenido')

        await wrapper.setProps({ open: true })

        expect(dialog.attributes('open')).toBeDefined()
        expect(wrapper.text()).toContain('Contenido')

        await wrapper.setProps({ open: false })

        expect(dialog.attributes('open')).toBeUndefined()
    })

    it('lo titula su encabezado', () => {
        const wrapper = factory({ open: true })

        expect(wrapper.find('dialog').attributes('aria-labelledby')).toBe(wrapper.find('h2').attributes('id'))
    })

    /**
     * El que manda es el booleano: Escape pide cerrar, y es quien abrió el
     * diálogo el que lo cierra.
     */
    it('Escape pide cerrar sin cerrar por su cuenta', () => {
        const wrapper = factory({ open: true })

        expect(cancel(wrapper.find('dialog').element).defaultPrevented).toBe(true)
        expect(wrapper.emitted('update:open')).toEqual([[false]])
        expect(wrapper.find('dialog').attributes('open')).toBeDefined()
    })

    it('un clic en el fondo cierra; uno sobre la caja no', () => {
        const wrapper = factory({ open: true })
        const dialog = wrapper.find('dialog').element

        dialog.getBoundingClientRect = () => ({ left: 100, right: 400, top: 100, bottom: 300 })

        dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 200, clientY: 200 }))
        expect(wrapper.emitted('update:open')).toBeUndefined()

        dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 20, clientY: 20 }))
        expect(wrapper.emitted('update:open')).toEqual([[false]])
    })

    it('sin dismissible no se cierra con Escape ni con el fondo, y no hay X', () => {
        const wrapper = factory({ open: true, dismissible: false })
        const dialog = wrapper.find('dialog').element

        dialog.getBoundingClientRect = () => ({ left: 100, right: 400, top: 100, bottom: 300 })

        cancel(dialog)
        dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 20, clientY: 20 }))

        expect(wrapper.emitted('update:open')).toBeUndefined()
        expect(wrapper.find('button[aria-label="Cerrar"]').exists()).toBe(false)
    })

    it('la X y el pie cierran', async () => {
        const wrapper = factory({ open: true }, {
            footer: ({ close }) => h('button', { class: 'salir', onClick: close }, 'Salir'),
        })

        await wrapper.find('button[aria-label="Cerrar"]').trigger('click')
        await wrapper.find('.salir').trigger('click')

        expect(wrapper.emitted('update:open')).toEqual([[false], [false]])
        expect(wrapper.emitted('close')).toHaveLength(2)
    })

    it('sale del tema, con el tamano pedido', () => {
        const wrapper = factory({ open: true, size: 'lg' }, { footer: () => 'Pie' })

        expect(wrapper.find('dialog').classes()).toEqual(['fe-dialog', 'fe-dialog-lg'])
        expect(wrapper.find('header').classes()).toEqual(['fe-dialog-header'])
        expect(wrapper.find('.fe-dialog-body').text()).toBe('Contenido')
        expect(wrapper.find('footer').classes()).toEqual(['fe-dialog-footer'])
    })
})

describe('DrawerComponent', () => {
    const factory = (props = {}) => attach(DrawerComponent, {
        props: { title: 'Nuevo producto', open: true, ...props },
        slots: { default: () => h('input', { id: 'nombre' }) },
    })

    it('es un dialog con la forma del drawer', () => {
        const wrapper = factory()

        expect(wrapper.find('dialog').classes()).toEqual(['fe-drawer'])
        expect(wrapper.find('header').classes()).toEqual(['fe-drawer-header'])
        expect(wrapper.find('h2').classes()).toEqual(['fe-drawer-title'])
    })

    it('se pega a la izquierda con side="start"', () => {
        expect(factory({ side: 'start' }).find('dialog').classes()).toEqual(['fe-drawer', 'fe-drawer-start'])
    })

    /**
     * Un formulario que se abre dos veces tiene que volver limpio.
     */
    it('el contenido se desmonta al cerrar', async () => {
        const wrapper = factory()

        expect(wrapper.find('#nombre').exists()).toBe(true)

        await wrapper.setProps({ open: false })

        expect(wrapper.find('#nombre').exists()).toBe(false)
    })
})

describe('ToastRegionComponent', () => {
    it('pinta los avisos de notify y los quita al cerrarlos', async () => {
        const wrapper = attach(ToastRegionComponent)

        notify({ message: 'Guardado', title: 'Producto', variant: 'success' })
        await nextTick()

        const toast = wrapper.find('[role="status"]')

        expect(toast.text()).toContain('Producto')
        expect(toast.text()).toContain('Guardado')
        expect(toast.classes()).toEqual(['fe-toast', 'fe-toast-success'])

        await wrapper.find('button[aria-label="Cerrar"]').trigger('click')

        expect(wrapper.findAll('.fe-toast')).toHaveLength(0)
    })

    it('un error se anuncia como alerta', async () => {
        const wrapper = attach(ToastRegionComponent)

        notifyError('No se pudo guardar')
        await nextTick()

        expect(wrapper.find('[role="alert"]').text()).toContain('No se pudo guardar')
    })

    it('vive en la capa superior, como region con nombre', () => {
        const wrapper = attach(ToastRegionComponent)

        expect(wrapper.attributes('popover')).toBe('manual')
        expect(wrapper.attributes('role')).toBe('region')
        expect(wrapper.attributes('aria-label')).toBe('Avisos')
        expect(wrapper.classes()).toEqual(['fe-toast-region'])
    })
})

describe('ConfirmHostComponent', () => {
    it('pregunta lo que pide confirmAction y devuelve la respuesta', async () => {
        const wrapper = attach(ConfirmHostComponent)

        const answer = confirmAction({ message: '¿Borrar el producto?', variant: 'danger', confirmLabel: 'Borrar' })
        await flushPromises()

        expect(wrapper.find('dialog').attributes('open')).toBeDefined()
        expect(wrapper.text()).toContain('¿Borrar el producto?')

        const [cancelar, borrar] = wrapper.findAll('footer button')

        expect(cancelar.text()).toBe('Cancelar')
        expect(borrar.text()).toBe('Borrar')
        expect(borrar.classes()).toEqual(['fe-button-danger'])

        await borrar.trigger('click')

        await expect(answer).resolves.toBe(true)

        await flushPromises()

        expect(wrapper.find('dialog').attributes('open')).toBeUndefined()
    })

    it('cerrar con Escape cuenta como cancelar', async () => {
        const wrapper = attach(ConfirmHostComponent)

        const answer = confirmAction('¿Seguro?')
        await flushPromises()

        cancel(wrapper.find('dialog').element)

        await expect(answer).resolves.toBe(false)
    })

    /**
     * Un Enter por inercia no debe borrar nada.
     */
    it('el foco empieza en cancelar', async () => {
        const wrapper = attach(ConfirmHostComponent)

        confirmAction('¿Seguro?')
        await flushPromises()

        expect(wrapper.findAll('footer button')[0].attributes('autofocus')).toBeDefined()
    })
})

describe('SkeletonComponent', () => {
    it('varias lineas, la ultima mas corta', () => {
        const spans = mount(SkeletonComponent, { props: { lines: 3 } }).findAll('span')

        expect(spans).toHaveLength(3)
        expect(spans[0].classes()).toEqual(['fe-skeleton', 'fe-skeleton-text'])
        expect(spans[2].attributes('style')).toContain('width: 60%')
    })

    it('un circulo con su tamano', () => {
        const spans = mount(SkeletonComponent, { props: { shape: 'circle', width: 48 } }).findAll('span')

        expect(spans).toHaveLength(1)
        expect(spans[0].classes()).toEqual(['fe-skeleton', 'fe-skeleton-circle'])
        expect(spans[0].attributes('style')).toContain('width: 48px')
    })

    it('se oculta a los lectores de pantalla', () => {
        expect(mount(SkeletonComponent).attributes('aria-hidden')).toBe('true')
    })
})
