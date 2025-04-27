import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '@shared/constants';

interface CloseIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  width = 24,
  height = 24,
  color = theme.colors.grey[500],
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5" />
      <Path
        d="M15 9L9 15M9 9L15 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CloseIcon;
