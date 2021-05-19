const path = require('path')

module.exports = {
	extends: '../../node',
	overrides: [
		{
			files: ['*.ts'],
			parserOptions: {
				project: [path.join(__dirname, 'tsconfig.json')],
			},
		},
	],
}
