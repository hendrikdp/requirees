module.exports = function babelConfig(api) {
	api.cache(true);
	return {
		presets: [
			[
				'@babel/env',
				{
					modules: false,
					targets: {
						browsers: '> 1%, IE 11, not op_mini all, not dead',
						node: 8
					},
					useBuiltIns: false
				}
			]
		],
		env: {
			test: {
				presets: ['@babel/preset-env']
			}
		}
	};
};
