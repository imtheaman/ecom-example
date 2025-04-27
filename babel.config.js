module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
				extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
        alias: {
					'@domain': './src/domain',
					'@data': './src/data',
					'@infrastructure': './src/infrastructure',
					'@atoms': './src/presentation/components/atoms',
					'@molecules': './src/presentation/components/molecules',
					'@organisms': './src/presentation/components/organisms',
					'@templates': './src/presentation/components/templates',
					'@navigtion': './src/presentation/navigtion',
					'@screens': './src/presentation/screens',
					'@presentation': './src/presentation',
					'@shared': './src/shared',
          '@': './src',
        },
      },
    ],
  ],
};
