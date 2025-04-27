import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BasketIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const BasketIcon: React.FC<BasketIconProps> = ({
  width = 24,
  height = 24,
  color = '#1a73e8',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6H5.5L7.5 17H18.5L21 8H7.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 21C9.32843 21 10 20.3284 10 19.5C10 18.6716 9.32843 18 8.5 18C7.67157 18 7 18.6716 7 19.5C7 20.3284 7.67157 21 8.5 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 21C18.3284 21 19 20.3284 19 19.5C19 18.6716 18.3284 18 17.5 18C16.6716 18 16 18.6716 16 19.5C16 20.3284 16.6716 21 17.5 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BasketIcon;
