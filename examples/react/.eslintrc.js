const path = require('path')

module.exports = {
	extends: '../../react',
	overrides: [
		{
			files: ['*.tsx', '*.ts'],
			parserOptions: {
				project: [path.join(__dirname, 'tsconfig.json')],
			},
		},
	],
}
