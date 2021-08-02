module.exports = {
	printWidth: 100,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: ['package.json'],
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
