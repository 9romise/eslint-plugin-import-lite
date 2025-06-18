# import-lite/consistent-type-specifier-style

Origin docs: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/consistent-type-specifier-style.md

## Changes

- Resolve https://github.com/un-ts/eslint-plugin-import-x/issues/221.
  - Rename `prefer-top-level` to `top-level`, `prefer-inline` to `inline`.
  - Add new option `prefer-top-level`, allow `import { Foo, type Bar } from 'Foo'`, don't allow `import { type Foo } from 'Foo'`. More detail see .
- Drop flow support.
