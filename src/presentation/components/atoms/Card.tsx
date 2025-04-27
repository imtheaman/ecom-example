import React from 'react';
import { 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
	ViewProps,
  TouchableOpacity, 
  AccessibilityRole
} from 'react-native';
import { theme } from '@shared/constants';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 2,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
	...props
}) => {
  const cardContent = (
    <View 
      style={[
        styles.card, 
        { elevation }, 
        style
      ]}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole || 'none'}
			{...props}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint || 'Activates this card'}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.shape.borderRadius.large,
    padding: 0,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
});

export default Card;
