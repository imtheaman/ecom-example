import React from 'react';
import { ActivityIndicator, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Typography from './Typography';
import { theme } from '@shared/constants';

interface SpinnerProps {
	size?: 'small' | 'large';
	color?: string;
	text?: string;
	fullScreen?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
	size = 'large',
	color = theme.colors.primary.main,
	text,
	fullScreen = false,
	style,
	testID,
}) => {
	return (
		<View
			style={[
				styles.container,
				fullScreen && styles.fullScreen,
				style
			]}
			testID={testID}
		>
			<ActivityIndicator size={size} color={color} />
			{text && (
				<Typography variant="body2" style={styles.text}>
					{text}
				</Typography>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: theme.spacing.lg,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fullScreen: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colors.overlay,
		zIndex: 999,
	},
	text: {
		marginTop: theme.spacing.md,
		color: theme.colors.text.tertiary,
	},
});

export default Spinner;
