const {fileExtensionsNode, json, jsonComment, jsNode, tsNode} = require('./lib')

const tsConfigPatterns = ['tsconfig.json', 'tsconfig.*.json']

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
			files: ['*.js'],
			...jsNode,
		},
		{
			files: ['*.ts'],
			...tsNode,
		},
	],
	ignorePatterns: [
		'node_modules',
		...fileExtensionsNode.map((ext) => `!.*${ext}`), // ignore dot folders but not dot files
	],
}
