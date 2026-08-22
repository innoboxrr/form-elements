# Form Elements

**Composable form inputs for Vue — validation, masking and i18n already wired.**

A form is never just an input. It is an input plus its label, its error state, its mask, its help text and its translation. This package ships those as one unit so a form is a description of your data, not a pile of markup.

```vue
<template>
  <FormText   v-model="user.name"  label="Full name" rules="required|min:3" />
  <FormEmail  v-model="user.email" label="Email"     rules="required|email" />
  <FormTel    v-model="user.phone" label="Phone"     :country="'MX'" />
  <FormSelect v-model="user.role"  label="Role"      :options="roles" />
</template>
```

---

## What is included

| Component | For |
|---|---|
| `FormText` · `FormTextarea` | Text and long-form input |
| `FormEmail` · `FormPassword` | Typed inputs with matching validation defaults |
| `FormSelect` · `FormMultiselect` | Single and multiple choice, searchable |
| `FormTel` | International phone with country handling |
| `FormDate` · `FormNumber` | Dates and numeric input with masking |
| `FormFile` | Uploads with preview and size/type constraints |

**Validation built in.** Rules use the same syntax as [`innoboxrr-js-validator`](https://github.com/innoboxrr/js-validator), which mirrors Laravel — so the rules read the same on both sides of the wire.

**Translation ready.** Labels, placeholders and error messages resolve through your i18n layer.

---

## Install

```bash
npm install innoboxrr-form-elements
```

Register globally, or import the components you need.

---

## Built by

[Innobox R&R](https://github.com/innoboxrr) — extracted from production applications. Part of a catalogue of 52 open-source packages on Packagist and npm.

**[innobox.systems](https://innobox.systems)**
