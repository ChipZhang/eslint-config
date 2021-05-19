const {fileExtensionsWeb, json, jsonComment, jsNode, jsWeb, tsWeb, jsx, tsx} = require('./lib')

const tsConfigPatterns = ['tsconfig.json', 'tsconfig.*.json']
const configJSPatterns = ['.*rc.js', '*.config.js']

module.exports = {
	root: true, // do not load `.eslintrc.*` files in parent folders up to the root directory
	overrides: [
		{
			files: ['*.json'],
			excludedFiles: tsConfigPatterns,
			...json,
		},
		{
			files: tsConfigPatterns,
			...jsonComment,
		},
		{
			files: configJSPatterns,
			...jsNode,
		},
		{
			files: ['*.js'],
			excludedFiles: configJSPatterns,
			...jsWeb,
		},
		{
			files: ['*.ts'],
			...tsWeb,
		},
		{
			files: ['*.jsx'],
			...jsx,
		},
		{
			files: ['*.tsx'],
			...tsx,
		},
	],
	ignorePatterns: [
		'node_modules',
		...fileExtensionsWeb.map((ext) => `!.*${ext}`), // ignore dot folders but not dot files
	],
}
