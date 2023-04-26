import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		fontWeight: 600,
		selectors: ['article', '.article', '.post', '#post', '.story', '.content', '#main-content', '#content'],
		auto: false
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
