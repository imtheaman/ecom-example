import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '@shared/constants';

interface TagIconProps {
  width?: number;
  height?: number;
  color?: string;
  accessibilityLabel?: string;
}

const TagIcon: React.FC<TagIconProps> = ({
  width = 24,
  height = 24,
  color = theme.colors.text.tertiary,
  accessibilityLabel = 'Category tag',
}) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none"
      accessibilityLabel={accessibilityLabel}
      accessible={true}
      accessibilityRole="image"
    >
      <Path
        d="M8.5 4H4C3.44772 4 3 4.44772 3 5V9.5C3 9.77614 3.11193 10.0412 3.31143 10.2407L13.2407 20.1699C13.6314 20.5607 14.2646 20.5607 14.6553 20.1699L20.1699 14.6553C20.5607 14.2646 20.5607 13.6314 20.1699 13.2407L10.2407 3.31143C10.0412 3.11193 9.77614 3 9.5 3H9H8.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TagIcon;
