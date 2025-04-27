import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  getFontSize: (size: number) => number;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  isScreenReaderEnabled: false,
  isReduceMotionEnabled: false,
  getFontSize: (size: number) => size,
});

interface ProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider = (props: ProviderProps) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotionEnabled);
    
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    
    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged', 
      setIsReduceMotionEnabled
    );
    
    return () => {
      screenReaderListener.remove();
      reduceMotionListener.remove();
    };
  }, []);
  
  const getFontSize = (size: number): number => {
    return size;
  };
  
  const value = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    getFontSize,
  };
  
  return React.createElement(
    AccessibilityContext.Provider,
    { value },
    props.children
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default useAccessibility;
