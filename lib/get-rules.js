const path = require('path')
const _ = require('lodash')

function beautify(value) {
	let jsBeautify
	try {
		jsBeautify = require('js-beautify') // eslint-disable-line global-require, node/no-unpublished-require
	} catch (e) {} // eslint-disable-line no-empty

	if (!jsBeautify) {
		return JSON.stringify(value)
	}

	return jsBeautify(JSON.stringify(value))
}

function assert(condition, ...msg) {
	if (!condition) {
		throw msg
	}
}

function debug(...msg) {
	const DEBUG = process.env.DEBUG || ''
	switch (DEBUG.toLowerCase()) {
		case '':
		case '0':
		case 'n':
		case 'no':
		case 'off':
			return
		default:
			// use `console.warn` to print to stderr
			console.warn(...msg) // eslint-disable-line no-console
	}
}

function getConfigFileRules(rules, dir, configFile, exts) {
	const errMsg = `Unexpected base config to extend \`${configFile}\`, an update needed for \`${__filename}\`, please report this to the author`

	let pluginConfigName
	if (configFile.startsWith('.')) {
		configFile = path.join(dir, configFile)
	} else if (!path.isAbsolute(configFile)) {
		const parts = configFile.replace(/\\/g, '/').split('/')

		if (parts[0] !== 'eslint') {
			let prefix = 'eslint-config'
			if (parts[0].startsWith('plugin:')) {
				parts[0] = parts[0].substr('plugin:'.length)
				prefix = 'eslint-plugin'
				assert(parts.length >= 2, errMsg)
				pluginConfigName = parts.pop()
			}

			if (!parts[0].startsWith('@')) {
				if (!parts[0].startsWith(`${prefix}-`)) {
					parts[0] = `${prefix}-${parts[0]}`
				}
			} else {
				if (parts.length === 1) {
					parts.push(prefix)
				}
				if (parts[1] !== prefix && !parts[1].startsWith(`${prefix}-`)) {
					parts[1] = `${prefix}-${parts[1]}`
				}
			}
		}

		configFile = require.resolve(parts.join('/'))
	}

	debug(`Extending ESLint config \`${configFile}\`${pluginConfigName ? ` (${pluginConfigName})` : ''}`)
	let config = require(configFile) // eslint-disable-line global-require
	assert(config && config.constructor === Object, errMsg)
	if (pluginConfigName) {
		assert(config.configs && config.configs.constructor === Object, errMsg)
		config = config.configs[pluginConfigName]
		assert(config && config.constructor === Object, errMsg)
	}
	const configWORules = {...config}
	delete configWORules.rules
	debug('Config (without rules):', beautify(configWORules))

	if (config.rules) {
		assert(config.rules.constructor === Object, errMsg)
		const r = Object.keys(config.rules)
		debug(`Rules (${r.length}):`, r.join(' '))
		Object.assign(rules, config.rules)
	}

	if (config.overrides) {
		assert(Array.isArray(config.overrides), errMsg)
		config.overrides.forEach((o) => {
			if (o.files && o.rules) {
				assert(Array.isArray(o.files), errMsg)
				if (exts.some((ext) => o.files.includes(ext))) {
					assert(o.rules.constructor === Object, errMsg)
					const r = Object.keys(o.rules)
					debug(`Override \`${o.files}\` matched`)
					debug(`Rules (${r.length}):`, r.join(' '))
					Object.assign(rules, o.rules)
				} else {
					debug(`Override \`${o.files}\` not matched`)
				}
			}
		})
	}

	if (config.extends) {
		assert(Array.isArray(config.extends), errMsg)
		config.extends.forEach((extended) => getConfigFileRules(rules, path.dirname(configFile), extended, exts))
	}

	return rules
}

/**
 * get only `rules` from ESLint config files,
 * and ignoring `globals`, `env`, `plugins`, `parser`, `parserOptions`, `settings`, `ignorePatterns` ..., thus no messing up
 * @param {string[]} configFiles an array of ESLint config files
 * @param {string[]} exts an array of file extensions to match, used when there is `overrides` in config files
 * @returns {Object} the merged rules, not using deep merge, but simple replacement,
 * i.e. when there are multiple config files defining the same rule, the latter one will be chosen
 */
module.exports = function getConfigFilesRules(configFiles, exts) {
	const rules = {}
	configFiles.forEach((f) => {
		if (f === 'eslint:recommended') {
			f = 'eslint/conf/eslint-recommended'
		}
		debug(`Getting config for \`${f}\``)
		getConfigFileRules(rules, __dirname, f, exts)
	})
	return _.cloneDeep(rules) // without cloning, it may fails
}
