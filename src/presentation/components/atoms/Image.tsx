import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ViewStyle, } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import { theme } from '@shared/constants';

interface ImageProps extends Omit<FastImageProps, 'source'> {
	source: Source;
	fallbackSource?: Source;
	showLoadingIndicator?: boolean;
	loadingColor?: string;
	containerStyle?: ViewStyle;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

const Image: React.FC<ImageProps> = ({
	source,
	fallbackSource,
	showLoadingIndicator = false,
	loadingColor = '#1a73e8',
	containerStyle,
	onLoadStart,
	onLoad,
	onLoadEnd,
	onError,
	...props
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleLoadStart = () => {
		setIsLoading(true);
		setHasError(false);
		onLoadStart?.();
	};

	const handleLoad = (evt: any) => {
		setIsLoading(false);
		onLoad?.(evt);
	};

	const handleLoadEnd = () => {
		setIsLoading(false);
		onLoadEnd?.();
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
		onError?.();
	};

	const defaultFallback: Source = require('/src/assets/placeholder.png');

	const displaySource = source ? source : fallbackSource ?? defaultFallback;

	return (
		<View style={[styles.container, containerStyle]}>
			<FastImage
				style={[styles.image, props.style]}
				source={displaySource}
				onLoadStart={handleLoadStart}
				onLoad={handleLoad}
				onLoadEnd={handleLoadEnd}
				onError={handleError}
				accessible={true}
				accessibilityRole="image"
				accessibilityLabel={props.accessibilityLabel || 'Image'}
				accessibilityHint={props.accessibilityHint}
				{...props}
			/>
			{isLoading && showLoadingIndicator && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="small" color={loadingColor || theme.colors.primary.main} />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(255,255,255,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Image;
