import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Image from '../atoms/Image';
import { theme } from '@shared/constants';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
	images: string[];
	height?: number;
	autoPlay?: boolean;
	autoPlayInterval?: number;
	onImagePress?: (index: number) => void;
	testID?: string;
	accessibilityLabel?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
	images,
	height = 300,
	autoPlay = true,
	autoPlayInterval = 3000,
	onImagePress,
	testID,
	accessibilityLabel,
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const flatListRef = useRef<FlatList>(null);

	React.useEffect(() => {
		let interval: NodeJS.Timeout;

		if (autoPlay && images.length > 1) {
			interval = setInterval(() => {
				const nextIndex = (activeIndex + 1) % images.length;
				flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
				setActiveIndex(nextIndex);
			}, autoPlayInterval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [activeIndex, autoPlay, autoPlayInterval, images.length]);

	const handleScroll = (event: any) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollPosition / width);
		setActiveIndex(index);
	};

	const renderDotIndicator = () => {
		return (
			<View style={styles.pagination} accessibilityLabel="Image indicator">
				{images.map((_, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.dot,
							activeIndex === index ? styles.activeDot : styles.inactiveDot,
						]}
						onPress={() => {
							flatListRef.current?.scrollToIndex({ index, animated: true });
							setActiveIndex(index);
						}}
						accessible={true}
						accessibilityRole="button"
						accessibilityState={{ selected: activeIndex === index }}
						accessibilityLabel={`Show image ${index + 1} of ${images.length}`}
					/>
				))}
			</View>
		);
	};

	if (!images || images.length === 0) {
		return (
			<View 
				style={[styles.container, { height }]} 
				testID={testID}
				accessible={true}
				accessibilityLabel="No product images available"
				accessibilityRole="image"
			>
				<Image
					source={{ uri: '/src/assets/placeholder.png' }}
					style={{ width, height }}
					resizeMode='cover'
					accessibilityLabel="Placeholder image"
				/>
			</View>
		);
	}

	return (
		<View 
			style={[styles.container, { height }]} 
			testID={testID}
			accessible={true}
			accessibilityLabel={accessibilityLabel || `Product image carousel with ${images.length} images`}
			accessibilityRole="image"
			accessibilityHint={images.length > 1 ? "Swipe left or right to view more product images" : undefined}
		>
			<FlatList
			ref={flatListRef}
			data={images}
			renderItem={({ item, index }) => (
			<TouchableOpacity
			activeOpacity={onImagePress ? 0.8 : 1}
			onPress={() => onImagePress && onImagePress(index)}
			 accessible={true}
			accessibilityRole="image"
			accessibilityLabel={`Product image ${index + 1} of ${images.length}`}
			accessibilityHint={onImagePress ? "Double tap to view larger image" : undefined}
			>
			<Image
			  source={{ uri: item }}
			   style={{ width, height }}
								resizeMode="cover"
								accessible={false}
							/>
						</TouchableOpacity>
					)}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={handleScroll}
				keyExtractor={(item, index) => `${item}-${index}`}
			/>
			{images.length > 1 && renderDotIndicator()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	pagination: {
		position: 'absolute',
		bottom: 15,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	activeDot: {
		backgroundColor: theme.colors.background.default,
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	inactiveDot: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
	},
});

export default ImageCarousel;
