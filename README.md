# innoboxrr-form-elements

Componentes Vue de la interfaz innoboxrr: los controles de formulario y las
piezas de una aplicación de escritorio —diálogos, drawers, menús, avisos,
confirmaciones, paleta de comandos, skeletons y edición en línea—.

El aspecto sale del tema de [`innoboxrr-form-core`](../form-core), y el gemelo
React [`innoboxrr-react-form-elements`](../react-form-elements) exporta
exactamente los mismos nombres: `larapack-generator` emite los mismos
componentes para los dos frameworks. Un test de paridad en cada repositorio
falla si uno se adelanta al otro.

```
npm i innoboxrr-form-elements
```

```js
import 'innoboxrr-form-core/styles'
import FormElements from 'innoboxrr-form-elements'

app.use(FormElements)   // o importa solo los que uses
```

## Formularios

`ButtonComponent`, `CheckboxInputComponent`, `ClickToEditComponent`,
`CodeInputComponent`, `CodeMirrorComponent`, `ColorPickerInputComponent`,
`CountrySelectInputComponent`, `DynamicGroupInputComponent`,
`EditorInputComponent`, `FileDropInputComponent`, `FileInputComponent`,
`FqsInputComponent`, `IconComponent`, `InputErrorComponent`,
`ModelSearchInputComponent`, `MultiCheckboxInputComponent`,
`PolymorphicInputComponent`, `RadioInputComponent`, `SelectInputComponent`,
`SelectSearchInputComponent`, `SimpleFileInputComponent`,
`SingleCheckboxInputComponent`, `StarsInputComponent`, `SwitchComponent`,
`TagsInputComponent`, `TextEditorMonoStyleInputComponent`,
`TextInputComponent`, `TextareaInputComponent`, `TimezoneSelectInputComponent`.

## Piezas de escritorio

Se apoyan en lo que ya hace el navegador, sin librerías de interfaz: `<dialog>`
con `showModal()` pone la capa superior, el fondo inerte, el foco atrapado y
Escape; el atributo `popover` pone el cierre al pulsar fuera; Floating UI coloca
los menús.

### Diálogo y drawer

```vue
<DrawerComponent v-model:open="abierto" title="Nuevo producto">
    <CreateForm @submit="guardar" />
    <template #footer="{ close }">
        <ButtonComponent variant="secondary" type="button" @click="close" value="Cancelar" />
    </template>
</DrawerComponent>
```

- `DialogComponent` (`size`: `sm`, `md`, `lg`) y `DrawerComponent` (`side`:
  `end`, `start`) tienen la misma forma: `v-model:open`, `title`, slots
  `header`, por defecto y `footer`, que reciben `{ close }`.
- **Manda `open`.** Escape, un clic en el fondo o la X emiten `update:open` con
  `false`; es quien abrió el diálogo el que lo cierra.
- `:dismissible="false"` impide cerrarlo con Escape o con el fondo y quita la X.
- **El contenido solo existe mientras está abierto**: un formulario vuelve
  limpio cada vez.

### Avisos y confirmaciones

Se montan una vez, en la raíz, y se usan desde cualquier sitio con las funciones
de `innoboxrr-form-core`:

```vue
<ToastRegionComponent />
<ConfirmHostComponent />
```

```js
import { notifySuccess, notifyError, confirmAction } from 'innoboxrr-form-core'

notifySuccess('Producto creado')

if (await confirmAction({ message: '¿Borrar el producto?', variant: 'danger' })) {
    // …
}
```

La región de avisos vive en la capa superior para seguir encima de un drawer
abierto. La confirmación empieza con el foco en cancelar.

### Menú

```vue
<MenuComponent :items="[
    { id: 'edit', label: 'Editar', icon: 'edit', action: editar },
    { separator: true },
    { id: 'delete', label: 'Eliminar', icon: 'delete', danger: true, disabled: ! puede, disabledReason: 'Sin permiso' },
]" :before-open="cargarPermisos" @select="…" />
```

- `beforeOpen` se espera antes de abrir: los permisos de una fila se resuelven
  antes de enseñar el menú, en vez de verlos habilitarse con el menú abierto.
- Un elemento sin permiso se ve deshabilitado y explica por qué; no desaparece.
- Las flechas, Inicio y Fin recorren los elementos usables. El slot `trigger`
  sustituye al botón.

### Paleta de comandos

```vue
<CommandPaletteComponent v-model:open="paleta" :items="[
    { id: 'products', label: 'Productos', group: 'Ir a', icon: 'box', action: irAProductos },
    { id: 'new', label: 'Nuevo producto', group: 'Crear', shortcut: 'N', keywords: ['alta'] },
]" />
```

Ctrl+K o Cmd+K la abren desde cualquier sitio (`hotkey` cambia la tecla, `null`
lo quita). El filtro no distingue mayúsculas ni acentos y busca también en
`group` y `keywords`.

### Skeleton y edición en línea

```vue
<SkeletonComponent :lines="3" />
<SkeletonComponent shape="circle" :width="40" />

<ClickToEditComponent :value="producto.title" :save="(title) => updateModel(producto.id, { title })" />
```

`ClickToEditComponent` confirma con Enter o al salir del campo y cancela con
Escape. Con `save`, espera a que termine: si falla se queda abierto con el
error. Emite `input` con el valor confirmado.

## Pruebas

```
npm test
```
