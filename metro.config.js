const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
	resolver: {
		extraNodeModules: {
			'@domain': path.resolve(__dirname, 'src/domain'),
			'@data': path.resolve(__dirname, 'src/data'),
			'@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
			'@atoms': path.resolve(__dirname, 'src/presentation/components/atoms'),
			'@molecules': path.resolve(__dirname, 'src/presentation/components/molecules'),
			'@organisms': path.resolve(__dirname, 'src/presentation/components/organisms'),
			'@templates': path.resolve(__dirname, 'src/presentation/components/templates'),
			'@navigtion': path.resolve(__dirname, 'src/presentation/navigtion'),
			'@screens': path.resolve(__dirname, 'src/presentation/screens'),
			'@presentation': path.resolve(__dirname, 'src/presentation'),
			'@shared': path.resolve(__dirname, 'src/shared'),
			'@': path.resolve(__dirname, 'src'),
		},
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
