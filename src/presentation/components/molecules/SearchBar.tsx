import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Keyboard } from 'react-native';
import Input from '../atoms/Input';
import { SearchIcon } from '../atoms/icons';
import { theme } from '@shared/constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search products...',
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const handleSubmitEditing = () => {
    Keyboard.dismiss();
  };

  return (
    <View 
      style={[styles.container, style]} 
      testID={testID}
      accessible={true}
      accessibilityRole="search"
      accessibilityLabel={accessibilityLabel || 'Search bar'}
      accessibilityHint={accessibilityHint || 'Enter text to search products'}
    >
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<SearchIcon width={20} height={20} color={theme.colors.text.tertiary} />}
        showClearButton={true}
        onClear={onClear}
        style={styles.input}
        inputStyle={styles.inputText}
        testID={`${testID}-input`}
        returnKeyType="search"
        onSubmitEditing={handleSubmitEditing}
        autoCapitalize="none"
        accessibilityHint="Type to search for products"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  input: {
    marginBottom: 0,
  },
  inputText: {
    height: 46,
  },
});

export default SearchBar;
