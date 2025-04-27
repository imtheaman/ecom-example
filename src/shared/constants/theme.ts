export const colors = {
  primary: {
    main: '#1a73e8',
    light: '#4a9bff',
    dark: '#0d47a1',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#e91e63',
    light: '#ff6090',
    dark: '#b0003a',
    contrastText: '#ffffff'
  },
  error: {
    main: '#e53935',
    light: '#ff6f60',
    dark: '#ab000d',
    contrastText: '#ffffff'
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: '#333333',
    secondary: '#555555',
    tertiary: '#666666',
    disabled: '#9e9e9e',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    disabled: 'rgba(0, 0, 0, 0.12)'
  },
  divider: '#e0e0e0',
  shadow: '#000000',
  overlay: 'rgba(255, 255, 255, 0.8)',
};

export const typography = {
  fontSize: {
    h1: 28,
    h2: 22,
    h3: 18,
    body1: 16,
    body2: 14,
    caption: 12,
    label: 14,
    small: 12,
    medium: 16,
    large: 20,
  },
  lineHeight: {
    h1: 36,
    h2: 30,
    h3: 26,
    body1: 24,
    body2: 22,
    caption: 16,
    label: 20,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '600' as const,
    bold: 'bold' as const,
  }
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8, 
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const shape = {
  borderRadius: {
    small: 4,
    medium: 8,
    large: 10,
  }
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  }
};

const theme = {
  colors,
  typography,
  spacing,
  shape,
  shadows,
};

export default theme;
