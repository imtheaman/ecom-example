import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle, ButtonProps as RNButtonProps } from 'react-native';
import { theme } from '@shared/constants';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends RNButtonProps {
	variant?: ButtonVariant;
	loading?: boolean;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	testID?: string;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	disabled = false,
	loading = false,
	style,
	textStyle,
	leftIcon,
	rightIcon,
	testID,
	accessibilityLabel,
	accessibilityHint,
	...props
}) => {
	const getButtonStyle = () => {
		switch (variant) {
			case 'secondary':
				return styles.secondaryButton;
			case 'outline':
				return styles.outlineButton;
			case 'primary':
			default:
				return styles.primaryButton;
		}
	};

	const getTextStyle = () => {
		switch (variant) {
			case 'outline':
				return styles.outlineButtonText;
			case 'secondary':
			case 'primary':
			default:
				return styles.buttonText;
		}
	};

	return (
		<TouchableOpacity
			style={[
				styles.button,
				getButtonStyle(),
				disabled && styles.disabledButton,
				style,
			]}
			testID={testID}
			onPress={onPress}
			disabled={disabled || loading}
			activeOpacity={0.8}
			accessible={true}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel || `${title} button`}
			accessibilityHint={accessibilityHint}
			accessibilityState={{ disabled: disabled || loading }}
			{...props}
		>
			{loading ? (
				<ActivityIndicator
					size="small"
					color={variant === 'outline' ? theme.colors.primary.main : theme.colors.primary.contrastText}
				/>
			) : (
				<>
					{leftIcon && <>{leftIcon}</>}
					<Text style={[getTextStyle(), textStyle]}>{title}</Text>
					{rightIcon && <>{rightIcon}</>}
				</>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.shape.borderRadius.medium,
		minWidth: 100,
	},
	primaryButton: {
		backgroundColor: theme.colors.primary.main,
	},
	secondaryButton: {
		backgroundColor: theme.colors.secondary.main,
	},
	outlineButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: theme.colors.primary.main,
	},
	disabledButton: {
		opacity: 0.6,
	},
	buttonText: {
		color: theme.colors.primary.contrastText,
		fontSize: theme.typography.fontSize.body1,
		fontWeight: theme.typography.fontWeight.medium,
		textAlign: 'center',
	},
	outlineButtonText: {
		color: theme.colors.primary.main,
		fontSize: theme.typography.fontSize.body1,
		fontWeight: theme.typography.fontWeight.medium,
		textAlign: 'center',
	},
});

export default Button;
