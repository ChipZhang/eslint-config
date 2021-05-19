/**
 * used to turn off `import/*` rules of `eslint-config-airbnb-typescript`
 */

const config = require('eslint-config-airbnb-typescript/lib/shared')

const rules = {}
Object.keys({...config.rules, ...config.overrides[0].rules}).forEach((name) => {
	if (name.startsWith('import/')) {
		rules[name] = ['off']
	}
})

module.exports = {
	rules,
}
