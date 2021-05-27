# An ESLint shareable config based on Airbnb, added JSON / Babel / TypeScript / Prettier support

## Overview

- Separate configs for Node.js 12.0+ projects and React projects.

  - The Node.js specific rules are provided by `eslint-plugin-node`.

  - The React specific rules are provided by `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.

  - The ES2015+ import/export syntax specific rules are provided by `eslint-plugin-import`.

- Rules are mainly based on `eslint-config-airbnb-base`, and `eslint-config-airbnb`,
  but with some custom tweaks for the ease of coding, and:

  - Added JSON support, by `eslint-plugin-json`.

  - Added Babel syntax support for React projects (`*.js`, `*.jsx` files only), by `@babel/eslint-parser`, and `@babel/eslint-plugin`.

  - Added TypeScript support, by `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, and `eslint-config-airbnb-typescript`.

  - Added Prettier support, by `eslint-config-prettier`.

## Install

You can install this package as a development dependency:

```shell
npm i -D eslint @chipzhang/eslint-config
```

This will also automatically install the needed ESLint configs (`eslint-config-*`) and some ESLint plugins (`eslint-config-*`),
but not ESLint itself, parsers and plugins for TypeScript and Babel support.
You should manually install the peer dependencies as follows:

- ESLint itself: `eslint: ^7.5.0`

- TypeScript support for both Node.js and React projects:
  `typescript: ^4.2.4`, `@typescript-eslint/eslint-plugin: ^4.4.1`, `@typescript-eslint/parser: ^4.4.1`

- Babel support for React projects:
  `@babel/core: ^7.11.0`, `@babel/eslint-parser: ^7.11.0`, `@babel/eslint-plugin: ^7.11.0`

## Configuration

Add [one of the supported configuration file format](https://eslint.org/docs/user-guide/configuring/configuration-files)
to your project, then extends it as per your project type.

- If your project is a Node.js 12.0+ project, i.e. code is run in Node.js:

```json
{"extends": "@chipzhang/eslint-config/node"}
```

- Or your project is a React project, i.e. code is run in browsers:

```json
{"extends": "@chipzhang/eslint-config/react"}
```

You can further customize this configuration file if you need TypeScript or Babel support.

### Configure TypeScript Support

If you have TypeScript files in your project, you can specify the path of TypeScript config files, like follows:

```json
{
  "parserOptions": {
    "project": ["/path/to/tsconfig.json", "/path/to/tsconfig.another.json"]
  }
}
```

If you don't set this option, by default, the extended config will use file `tsconfig.json` in the project root directory.
`@chipzhang/eslint-config/node` only treats `*.ts` files as TypeScript files,
while `@chipzhang/eslint-config/react` treats `*.ts` and `*.tsx` files as TypeScript files.

### Configure Babel Support

If your project is a React project,
the extended config uses TypeScript parser (`@typescript-eslint/parser`) for `*.ts` and `*.tsx` files,
but Babel parser (`@babel/eslint-parser`) for `*.js` and `*.jsx` files instead, to support TC39 experimental syntax.
The config by default requires [a Babel configuration file](https://babeljs.io/docs/en/config-files) in your project.
You can disable loading the Babel configuration file and provide custom Babel config directly, like follows:

```json
{
  "parserOptions": {
    "babelOptions": {
      "mySetting": "value"
    },
    "requireConfigFile": false
  }
}
```

## Details for Node.js projects

```json
{"extends": "@chipzhang/eslint-config/node"}
```

The extended config targets code that is run in Node.js version 12.0+.
It supports ECMA version 2019, and uses different parsers, rules, and settings for different file extensions.

- For `*.json` files, it uses rules provided by `eslint-plugin-json`.
  Comments are disallowed except for `tsconfig.json`, `tsconfig.*.json`.

- For `*.js` files, it supports CommonJS module syntax,
  uses ESLint default parser,
  and rules mainly from `eslint-config-airbnb-base`, with some tweaks.

- For `*.ts` files, it supports ES module syntax,
  uses parser `@typescript-eslint/parser`,
  and rules mainly from `eslint-config-airbnb-base` and `eslint-config-airbnb-typescript`, with some tweaks.

The extended config ignores files in `node_modules` folder and dot folders, but not dot files,
to enable linting configuration files like `.*rc.json` or `.*rc.js`.
You can use `ignorePatterns` in your ESLint configuration file to tune this behavior.

## Details for React projects

```json
{"extends": "@chipzhang/eslint-config/react"}
```

The extended config targets code that will be transpiled by Babel or TypeScript, then run in browsers.
It supports ECMA version 2020, ES module syntax, and uses different parsers, rules, and settings for different file extensions.

- For `*.json` files, it uses rules provided by `eslint-plugin-json`.
  Comments are disallowed except for `tsconfig.json`, `tsconfig.*.json`.

- For `*.js` files, it does not support TypeScript syntax or JSX syntax,
  uses parser `@babel/eslint-parser`,
  and rules mainly from `eslint-config-airbnb-base`, with some tweaks.

- For `*.ts` files, it supports TypeScript syntax, but no JSX syntax,
  uses parser `@typescript-eslint/parser`,
  and rules mainly from `eslint-config-airbnb-base` and `eslint-config-airbnb-typescript`, with some tweaks.

- For `*.jsx` files, it supports JSX syntax, but no TypeScript syntax,
  uses parser `@babel/eslint-parser`,
  and rules mainly from `eslint-config-airbnb`, with some tweaks.

- For `*.tsx` files, it supports both TypeScript syntax and JSX syntax,
  uses parser `@typescript-eslint/parser`,
  and rules mainly from `eslint-config-airbnb` and `eslint-config-airbnb-typescript`, with some tweaks.

The extended config ignores files in `node_modules` folder and dot folders, but not dot files,
to enable linting configuration files like `.*rc.json` or `.*rc.js`.
Moreover, files like `.*rc.js` and `*.config.js` are treated as Node.js script file, rather than a React module file.
You can use `ignorePatterns` in your ESLint configuration file to tune this behavior.

## TODO

Perhaps, separate this package into several packages targeting different environments, to reduce the installed dependencies.

## License

GNU AFFERO GENERAL PUBLIC LICENSE Version 3
