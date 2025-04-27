export const TOUCH_TARGET_SIZE = {
  minHeight: 44,
  minWidth: 44,
  minSpacing: 8
};

export const TEXT_SCALE = {
  smaller: 0.85,
  normal: 1,
  larger: 1.15,
  extraLarge: 1.3,
  jumbo: 1.5
};

export const FOCUS_INDICATOR = {
  borderWidth: 2,
  borderColor: '#4a9bff',
  borderRadius: 4
};

export const ANIMATION_TIMING = {
  standard: 300,
  reducedMotion: 0
};

export const CONTRAST_RATIO = {
  normalText: 4.5,
  largeText: 3,
  uiComponents: 3
};

export const SCREEN_READER_TEXT = {
  priceFormat: (price: number, currency: string) => 
    `${price} ${currency}`,
  
  imageAlt: {
    productThumb: (name: string) => `Product thumbnail for ${name}`,
    actionIcon: (action: string) => `${action} button`
  }
};

export const FOCUS_ORDER = {
  NAVIGATION: 1,
  SEARCH: 2,
  MAIN_CONTENT: 3,
  ACTIONS: 4,
  FOOTER: 5
};

export const SEMANTIC_ROLES = {
  productCard: 'article',
  productList: 'list',
  productItem: 'listitem',
  navigation: 'navigation',
  search: 'search',
  button: 'button'
};

export default {
  TOUCH_TARGET_SIZE,
  TEXT_SCALE,
  FOCUS_INDICATOR,
  ANIMATION_TIMING,
  CONTRAST_RATIO,
  SCREEN_READER_TEXT,
  FOCUS_ORDER,
  SEMANTIC_ROLES
};
