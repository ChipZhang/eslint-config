const path = require('path')
const findRoot = require('find-root')
const getConfigFilesRules = require('./get-rules')

const fileExtensionsNode = ['.ts', '.js', '.json']
const fileExtensionsWeb = ['.tsx', '.ts', '.jsx', '.js', '.json']

const customJSRules = {
	'no-plusplus': ['off'],
	'no-param-reassign': ['off'],
	'max-classes-per-file': ['off'],

	'no-shadow': ['off'],
	'no-unused-vars': [
		'warn',
		{
			// 'all' | 'local'
			// 'local' ignores vars in the global scope, but this has no effect for CommonJS module or ES module
			vars: 'all',
			// 'after-used' | 'all' | 'none'
			args: 'none',
			// in `const {omit, ...data2} = data`, `omit` is ignored
			ignoreRestSiblings: true,
			// varsIgnorePattern: '^_', // unused variables pattern
			// argsIgnorePattern: '^_', // unused arguments pattern
		},
	],
	'lines-between-class-members': [
		'warn',
		'always',
		{
			exceptAfterSingleLine: true,
		},
	],
}

const customTSRules = {
	'@typescript-eslint/no-shadow': customJSRules['no-shadow'],
	'@typescript-eslint/no-unused-vars': customJSRules['no-unused-vars'],
	'@typescript-eslint/lines-between-class-members': customJSRules['lines-between-class-members'],

	'@typescript-eslint/prefer-regexp-exec': ['off'], // use `/regexp/.exec('string')` or 'string'.match(/regexp/)
	'@typescript-eslint/ban-ts-comment': [
		'warn',
		{
			'ts-expect-error': 'allow-with-description',
			'ts-ignore': 'allow-with-description',
			'ts-nocheck': 'allow-with-description',
			'ts-check': 'allow-with-description',
		},
	],
}

const customNodeRules = (isTS) => ({
	...(isTS
		? {
				'node/no-unsupported-features/es-syntax': ['off'],
				'node/no-unsupported-features/es-builtins': ['off'],
		  }
		: {}),
})

const customWebRules = (isReact) => ({
	// when there is only one export from a module
	'import/prefer-default-export': ['off'],

	...(isReact
		? {
				// for `<MyComponent {...props}/>`
				'react/jsx-props-no-spreading': ['off'],

				// for class components, enforce the state initializations to be in constructor or with a class properties
				'react/state-in-constructor': ['warn', 'never'],

				// for `class MyComponent extends React.Component { static childContextTypes = {} }`
				'react/static-property-placement': ['warn', 'static public field'],

				// allow `PropTypes.xxx.isRequired` to have default property
				'react/require-default-props': [
					'warn',
					{
						forbidDefaultForRequired: false,
					},
				],

				// allow `PropTypes.xxx.isRequired` to have default property
				'react/default-props-match-prop-types': [
					'warn',
					{
						allowRequiredDefaults: true,
					},
				],
		  }
		: {}),
})

// parser options specific for `@typescript-eslint/parser`
// may be overwritten in the final `.eslintrc` config files to match the actual needs
const parserOptionsTypescript = {
	// by default, use the `tsconfig.json` file in the project root
	// overwrite this setting to use other `tsconfig.json` files
	project: [path.join(findRoot(process.cwd()), 'tsconfig.json')],
}

// parser options specific for `@babel/eslint-parser`
// may be overwritten in the final `.eslintrc` config files to match the actual needs
const parserOptionsBabel = {
	// babelOptions: {},
	requireConfigFile: true,
	allowImportExportEverywhere: false,
}

// settings specific for `eslint-plugin-node`
// may be overwritten in the final `.eslintrc` config files to match the actual needs
const settingsNode = {
	node: {
		// without `.d.ts`, it may report `node/no-unpublished-require` error if then required JS file is compiled from TS file
		tryExtensions: ['.d.ts', ...fileExtensionsNode],
	},
}

// settings specific for `eslint-plugin-import`, `eslint-plugin-react`
// may be overwritten in the final `.eslintrc` config files to match the actual needs
const settingsWeb = (isReact) => ({
	'import/extensions': fileExtensionsWeb,
	'import/ignore': [], // if matched by a path, will not report the matching module if no exports are found
	'import/core-modules': [], // a core modules is considered that there is no real file in the file system for this module
	'import/external-module-folders': ['node_modules'], // only modules from those folders are considered as external modules

	...(isReact
		? {
				react: {version: 'detect'},
				// useful for usages like `Component.propTypes = wrapperFunc({prop: PropTypes.number})`
				propWrapperFunctions: [],
				// components used as alternatives to `<a>`, maybe useful with `react-router`?
				linkComponents: [],
		  }
		: {}),
})

const extendsNode = (isTS) =>
	[
		'eslint:recommended',

		'plugin:node/recommended-script',

		'airbnb-base/rules/best-practices',
		'airbnb-base/rules/errors',
		'airbnb-base/rules/node',
		'airbnb-base/rules/style',
		'airbnb-base/rules/variables',
		'airbnb-base/rules/es6',
		'airbnb-base/rules/strict',

		isTS ? 'airbnb-typescript/lib/shared' : '',
		isTS ? './rules/airbnb-typescript-no-import' : '',
		isTS ? 'plugin:@typescript-eslint/recommended' : '',
		isTS ? 'plugin:@typescript-eslint/recommended-requiring-type-checking' : '',

		'prettier',
	].filter((c) => c)

const extendsWeb = (isTS, isReact) =>
	[
		'eslint:recommended',

		'plugin:import/recommended',
		isReact ? 'plugin:import/react' : '',
		isTS ? 'plugin:import/typescript' : '',

		'airbnb-base/rules/best-practices',
		'airbnb-base/rules/errors',
		'airbnb-base/rules/style',
		'airbnb-base/rules/variables',
		'airbnb-base/rules/es6',
		'airbnb-base/rules/imports',
		'airbnb-base/rules/strict',
		!isTS ? './rules/airbnb-base-babel' : '',

		isReact ? 'plugin:react/recommended' : '',
		isReact ? 'plugin:react-hooks/recommended' : '',
		isReact ? 'plugin:jsx-a11y/recommended' : '',
		isReact ? 'airbnb/rules/react' : '',
		isReact ? 'airbnb/rules/react-hooks' : '',
		isReact ? 'airbnb/rules/react-a11y' : '',

		isTS ? 'airbnb-typescript/lib/shared' : '',
		isTS && isReact ? './rules/airbnb-typescript-react' : '',
		isTS ? 'plugin:@typescript-eslint/recommended' : '',
		isTS ? 'plugin:@typescript-eslint/recommended-requiring-type-checking' : '',

		'prettier',
	].filter((c) => c)

const configJSON = {
	extends: ['plugin:json/recommended'],
	globals: {
		__eslintConfigJSON: 'writable',
	},
}

const configJSONWithComments = {
	extends: ['plugin:json/recommended-with-comments'],
	globals: {
		__eslintConfigJSONComment: 'writable',
	},
}

const configNode = (isTS) => ({
	// extends: extendsNode(isTS),
	rules: {
		...getConfigFilesRules(extendsNode(isTS), isTS ? ['*.ts', '*.js'] : ['*.js']),
		...customJSRules,
		...(isTS ? customTSRules : {}),
		...customNodeRules(isTS),
	},
	globals: {
		[`__eslintConfig${isTS ? 'TS' : 'JS'}Node`]: 'writable',
	},
	env: {
		es2017: true, // there is no "es2018", "es2019"
		node: true,
	},
	plugins: ['node', isTS ? '@typescript-eslint' : ''].filter((p) => p),
	parser: isTS ? '@typescript-eslint/parser' : null,
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'script',
		ecmaFeatures: {
			impliedStrict: true,
			globalReturn: false,
			jsx: false,
		},
		...(isTS ? parserOptionsTypescript : {}),
	},
	settings: settingsNode,
})

const configWeb = (isTS, isReact) => ({
	// extends: extendsWeb(isTS, isReact),
	rules: {
		...getConfigFilesRules(
			extendsWeb(isTS, isReact),
			isTS ? ['*.tsx', '*.jsx', '*.ts', '*.js'] : ['*.jsx', '*.js'],
		),
		...customJSRules,
		...(isTS ? customTSRules : {}),
		...customWebRules(isReact),
	},
	globals: {
		[`__eslintConfig${isTS ? 'TS' : 'JS'}${isReact ? 'X' : 'Web'}`]: 'writable',
	},
	env: {
		es2020: true,
		browser: true,
	},
	plugins: [
		'import',
		isReact ? 'react' : '',
		isReact ? 'react-hooks' : '',
		isReact ? 'jsx-a11y' : '',
		isTS ? '@typescript-eslint' : '@babel',
	].filter((p) => p),
	parser: isTS ? '@typescript-eslint/parser' : '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true,
			globalReturn: false,
			jsx: isReact,
		},
		...(isTS ? parserOptionsTypescript : parserOptionsBabel),
	},
	settings: settingsWeb(isReact),
})

module.exports = {
	fileExtensionsNode,
	fileExtensionsWeb,

	// config for JSON files
	json: configJSON,
	jsonComment: configJSONWithComments,

	// config for files for Node.js project, no TypeScript support
	jsNode: configNode(false),

	// config for files for Node.js project, with TypeScript support
	tsNode: configNode(true),

	// config for files for web project, no TypeScript support, no React support
	jsWeb: configWeb(false, false),

	// config for files for web project, with TypeScript support, no React support
	tsWeb: configWeb(true, false),

	// config for files for web project, no TypeScript support, with React support
	jsx: configWeb(false, true),

	// config for files for web project, with TypeScript support, with React support
	tsx: configWeb(true, true),
}
