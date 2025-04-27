import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import { SearchIcon, BasketIcon } from '../atoms/icons';
import { theme } from '@shared/constants';

interface EmptyViewProps extends ViewProps {
	title?: string;
	message?: string;
	iconType?: 'search' | 'basket';
	iconColor?: string;
	buttonText?: string;
	onButtonPress?: () => void;
	testID?: string;
}

const EmptyView: React.FC<EmptyViewProps> = ({
	title = 'No Data Found',
	message = 'There are no items to display',
	iconType = 'search',
	iconColor = theme.colors.primary.main,
	buttonText,
	onButtonPress,
	testID,
	...props
}) => {
	const renderIcon = () => {
		switch (iconType) {
			case 'basket':
				return <BasketIcon width={60} height={60} color={iconColor} />;
			case 'search':
			default:
				return <SearchIcon width={60} height={60} color={iconColor} />;
		}
	};

	return (
		<View style={styles.container} testID={testID} {...props}>
			{renderIcon()}
			<Typography variant="h2" style={styles.title}>
				{title}
			</Typography>
			<Typography variant="body1" style={styles.message}>
				{message}
			</Typography>
			{buttonText && onButtonPress && (
				<Button
					title={buttonText}
					onPress={onButtonPress}
					variant="outline"
					style={styles.button}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: theme.spacing.lg,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 300,
	},
	title: {
		marginTop: theme.spacing.base,
		marginBottom: theme.spacing.md,
		textAlign: 'center',
	},
	message: {
		color: theme.colors.text.tertiary,
		textAlign: 'center',
		marginBottom: theme.spacing.lg,
	},
	button: {
		minWidth: 150,
	},
});

export default EmptyView;
