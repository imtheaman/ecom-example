import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface AlertIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const AlertIcon: React.FC<AlertIconProps> = ({
  width = 24,
  height = 24,
  color = '#e53935',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path
        d="M12 8V12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="16" r="1" fill={color} />
    </Svg>
  );
};

export default AlertIcon;
