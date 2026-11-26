# Changelog

## 6.9.0 — 2026-11-26

### Puede afectar a quien ya lo usa

- **`engines.node` pasa de `>=20` a `>=22.12`.** Node 20 es EOL desde
  2026-04-30 y Vitest 5 exige `^22.12 || >=24`. CI ya no prueba Node 20:
  corre en 22 y 24.

### Cambiado

- **Cadena de pruebas en Vite 8 + Vitest 5.** `vite` `^7.1.0` → `^8.0.0`,
  `vitest` `^3.0.0` → `^5.0.0` y `jsdom` `^25.0.0` → `^31.0.0`, para que la
  línea base de JS del ecosistema pueda subir sin que falle el audit de este
  paquete. Solo cambian dependencias de desarrollo; el código publicado es el
  mismo. Las 134 pruebas pasan sin tocar ni la configuración ni los tests.

## 6.8.0 — 2026-09-13

### Puede afectar a quien ya lo usa

- **`CodeMirrorComponent` ya no se lleva el foco al montarse.** La nueva prop
  `autofocus` vale `false`. Antes el editor pedía el foco siempre, aunque
  estuviera al final de un formulario; quien dependa de eso tiene que pasar
  `autofocus`.

### Cambiado

- **`CodeMirrorComponent` carga el lenguaje bajo demanda.** El piloto de la
  aplicación base generó un chunk de 580 kB (200 kB gzip) para un editor del
  sitio que solo edita JSON: el componente importaba html, css, javascript,
  json y one-dark de forma estática. Ahora `lang` llega con `import()` y cada
  lenguaje es un chunk aparte. Una aplicación que solo monta el editor con
  `lang="json"` pasa de descargar 637,3 kB (222,7 kB gzip) a 498,5 kB
  (167,7 kB gzip) en modo claro; en oscuro se suman 2,7 kB (1,2 kB gzip) de
  one-dark.
- Mientras llega el lenguaje, el editor funciona como texto plano. `lang`
  admite los mismos valores que antes: `html` por defecto, `css`, `javascript`
  y `json`.
- **El editor sigue el tema de la aplicación.** Antes se pintaba siempre con
  one-dark, también en modo claro. La nueva prop `theme` vale `auto` y aplica
  la misma regla que innoboxrr-form-core: `data-theme` en `<html>` y, sin él,
  `prefers-color-scheme`, también cuando cambian en caliente. `dark` y `light`
  lo fuerzan, como en el gemelo React; `theme="dark"` recupera el aspecto de
  antes.

### Corregido

- La etiqueta nombra al editor con `aria-labelledby`, y un clic en ella lo
  enfoca. Antes un lector de pantalla anunciaba un campo sin nombre.
- Un `lang` fuera de la lista cae a `html` sin lanzar. Antes `constructor` o
  `__proto__` encontraban algo en el mapa de lenguajes y rompían el editor.
