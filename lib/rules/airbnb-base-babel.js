/**
 * add prefix `@babel/` to the names of the rules when using `@babel/eslint-plugin`
 */

const bestPracticeRules = require('eslint-config-airbnb-base/rules/best-practices').rules
const styleRules = require('eslint-config-airbnb-base/rules/style').rules

module.exports = {
	rules: {
		'new-cap': 'off',
		'no-invalid-this': 'off',
		'no-unused-expressions': 'off',
		'object-curly-spacing': 'off',
		'semi': 'off',

		'@babel/new-cap': styleRules['new-cap'],
		'@babel/no-invalid-this': bestPracticeRules['no-invalid-this'],
		'@babel/no-unused-expressions': bestPracticeRules['no-unused-expressions'],
		'@babel/object-curly-spacing': styleRules['object-curly-spacing'],
		'@babel/semi': styleRules.semi,
	},
}
