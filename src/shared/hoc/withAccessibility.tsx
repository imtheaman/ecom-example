import React from 'react';
import { ViewProps } from 'react-native';
import useAccessibility from '@shared/hooks/useAccessibility';
import accessibility from '@shared/constants/accessibility';

// Add optional disabled to component props
interface ComponentWithDisabled {
  disabled?: boolean;
}

export interface AccessibilityInjectedProps {
  accessibilityProps: {
    accessible: boolean;
    accessibilityRole?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityState?: Record<string, boolean>;
  };
  accessibilityStyles: {
    fontSize?: number;
    borderWidth?: number;
    borderColor?: string;
    minHeight?: number;
    minWidth?: number;
  };
}

interface WithAccessibilityOptions {
  role?: string;
  label?: string | ((props: any) => string);
  hint?: string | ((props: any) => string);
  isTouchTarget?: boolean;
  isFocusable?: boolean;
}

const withAccessibility = <P extends object>(
  WrappedComponent: React.ComponentType<P & AccessibilityInjectedProps>,
  options: WithAccessibilityOptions = {}
) => {
  const WithAccessibilityComponent = (props: P & ViewProps & Partial<ComponentWithDisabled>) => {
    const { isScreenReaderEnabled } = useAccessibility();

    const getAccessibilityLabel = () => {
      if (typeof options.label === 'function') {
        return options.label(props);
      }
      return options.label || '';
    };

    const getAccessibilityHint = () => {
      if (typeof options.hint === 'function') {
        return options.hint(props);
      }
      return options.hint || '';
    };

    const accessibilityProps = {
      accessible: true,
      accessibilityRole: options.role || 'none',
      accessibilityLabel: getAccessibilityLabel(),
      accessibilityHint: getAccessibilityHint(),
      accessibilityState: {
        disabled: 'disabled' in props ? Boolean(props.disabled) : false,
      },
    };

    const accessibilityStyles = {
      fontSize: isScreenReaderEnabled ? 18 : undefined,
      ...options.isFocusable && {
        borderWidth: accessibility.FOCUS_INDICATOR.borderWidth,
        borderColor: accessibility.FOCUS_INDICATOR.borderColor,
      },
      ...options.isTouchTarget && {
        minHeight: accessibility.TOUCH_TARGET_SIZE.minHeight,
        minWidth: accessibility.TOUCH_TARGET_SIZE.minWidth,
      },
    };

    return (
      <WrappedComponent
        {...props}
        accessibilityProps={accessibilityProps}
        accessibilityStyles={accessibilityStyles}
      />
    );
  };

  WithAccessibilityComponent.displayName = `WithAccessibility(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAccessibilityComponent;
};

export default withAccessibility;
