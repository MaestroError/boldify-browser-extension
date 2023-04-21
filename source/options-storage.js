import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		FontWeight: 500,
		selectors: ['article', '.text', '.post', '#post', '.story'],
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
