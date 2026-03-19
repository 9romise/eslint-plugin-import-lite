# eslint-plugin-import-lite

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/eslint-plugin-import-lite)](https://npmx.dev/package/eslint-plugin-import-lite)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/size/eslint-plugin-import-lite)](https://npmx.dev/package/eslint-plugin-import-lite)
[![License](https://npmx.dev/api/registry/badge/license/eslint-plugin-import-lite)](https://npmx.dev/package/eslint-plugin-import-lite)

## Feature

- Zero dependencies.
- Port some useful rules that don't require a resolver from [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x).
- No need for a resolver and settings like those in [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x).
- Drop babel and flow support.

> [!NOTE]
>
> This plugin intentionally does **NOT** include binary resolvers — but contributions are welcome if you'd like to implement resolver support!

See all rules in [`src/rules`](./src/rules)

## Available Rules

- [consistent-type-specifier-style](./src/rules/consistent-type-specifier-style/README.md)
- [exports-last](./src/rules/exports-last/README.md)
- [first](./src/rules/first/README.md)
- [newline-after-import](./src/rules/newline-after-import/README.md)
- [no-default-export](./src/rules/no-default-export/README.md)
- [no-duplicates](./src/rules/no-duplicates/README.md)
- [no-mutable-exports](./src/rules/no-mutable-exports/README.md)
- [no-named-default](./src/rules/no-named-default/README.md)
- [prefer-default-export](./src/rules/prefer-default-export/README.md)

## Motivation

I extend [my own ESLint config](https://github.com/9romise/eslint-config) from [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

Recently this config dropped [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) because it introduces built-in binary resolvers and makes it heavy.

In a [discussion](https://github.com/9romise/eslint-import-resolver-oxc/issues/87#issuecomment-2945162572) about the built-in resolver, the maintainer plans to keep it as a dependency, which makes it impossible to keep the package lightweight.

But there are some useful rules and [some people (including me) want to bring the plugin back](https://github.com/antfu/eslint-config/issues/720).

## See Also

- [eslint-plugin-fast-import](https://npmx.dev/package/eslint-plugin-fast-import) - An ESLint plugin using a novel algorithm combined with the OXC Rust parser.

## Credits

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x) - source codes [MIT](https://github.com/un-ts/eslint-plugin-import-x/blob/master/LICENSE)
- [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic) - project structure and scripts [MIT](https://github.com/eslint-stylistic/eslint-stylistic/blob/main/LICENSE)

## License

[MIT](./LICENSE) License &copy; 2025-PRESENT [Vida Xie](https://github.com/9romise)
