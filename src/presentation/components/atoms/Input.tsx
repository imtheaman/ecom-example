import React from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	StyleProp,
	TextStyle,
	TouchableOpacity,
	Keyboard,
	TextInputProps as RNInputProps
} from 'react-native';
import Typography from './Typography';
import { CloseIcon } from './icons';
import { theme } from '@shared/constants';

interface InputProps extends RNInputProps {
	label?: string;
	error?: string;
	inputStyle?: StyleProp<TextStyle>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	showClearButton?: boolean;
	onClear?: () => void;
	onRightIconPress?: () => void;
	accessibilityHint?: string;
}

const Input: React.FC<InputProps> = ({
	value,
	onChangeText,
	placeholder,
	label,
	error,
	secureTextEntry = false,
	style,
	inputStyle,
	leftIcon,
	rightIcon,
	showClearButton = false,
	onClear,
	onRightIconPress,
	testID,
	returnKeyType = "search",
	onSubmitEditing,
	autoCapitalize = "none",
	accessibilityHint,
	...props
}) => {
	const handleClear = () => {
		if (onClear) {
			onClear();
			Keyboard.dismiss();
		}
	};

	return (
		<View style={[styles.container, style]}>
			{label && (
				<Typography variant="label" style={styles.label}>
					{label}
				</Typography>
			)}

			<View style={[
				styles.inputContainer,
				error ? styles.inputError : null,
			]}>
				{leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

				<TextInput
					style={[
						styles.input,
						leftIcon ? styles.inputWithLeftIcon : null,
						(rightIcon || showClearButton) ? styles.inputWithRightIcon : null,
						inputStyle,
					]}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={theme.colors.grey[500]}
					secureTextEntry={secureTextEntry}
					testID={testID}
					returnKeyType={returnKeyType}
					onSubmitEditing={onSubmitEditing}
					autoCapitalize={autoCapitalize}
					accessible={true}
					accessibilityLabel={label || placeholder}
					accessibilityHint={accessibilityHint || `Enter ${label || placeholder}`}
					accessibilityState={{ disabled: props.editable === false }}
					{...props}
				/>

				{(rightIcon || (showClearButton && value && value.length > 0)) && (
					<View style={styles.rightIcon}>
						{rightIcon && (
							<TouchableOpacity onPress={onRightIconPress}
							accessible={true}
							 accessibilityRole="button"
						>
							{rightIcon}
						</TouchableOpacity>
						)}

						{showClearButton && value && value.length > 0 && (
							<TouchableOpacity
								onPress={handleClear}
								style={styles.clearButton}
								testID={`${testID}-clear-button`}
								accessible={true}
								accessibilityRole="button"
								accessibilityLabel="Clear text"
								accessibilityHint="Removes all text from the input field"
							>
								<CloseIcon color="#999" />
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>

			{error && (
				<Typography variant="caption" style={styles.errorText}>
					{error}
				</Typography>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: theme.spacing.base,
	},
	label: {
		marginBottom: theme.spacing.xs,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.grey[100],
		borderWidth: 1,
		borderColor: theme.colors.grey[300],
		borderRadius: theme.shape.borderRadius.medium,
		height: 50,
	},
	inputError: {
		borderColor: theme.colors.error.main,
	},
	input: {
		flex: 1,
		paddingHorizontal: theme.spacing.base,
		fontSize: theme.typography.fontSize.body1,
		color: theme.colors.text.primary,
		height: '100%',
	},
	inputWithLeftIcon: {
		paddingLeft: theme.spacing.md,
	},
	inputWithRightIcon: {
		paddingRight: theme.spacing.md,
	},
	leftIcon: {
		paddingLeft: theme.spacing.base,
	},
	rightIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: theme.spacing.base,
	},
	clearButton: {
		padding: theme.spacing.sm,
	},
	errorText: {
		color: theme.colors.error.main,
		marginTop: theme.spacing.xs,
	},
});

export default Input;
