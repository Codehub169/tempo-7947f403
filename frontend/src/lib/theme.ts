import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Define a basic color scale generator for simplicity
const generateColorScale = (baseColor: string) => ({
  50: `${baseColor}1A`, // Example alpha, real app might need proper tint/shade generation
  100: `${baseColor}33`,
  200: `${baseColor}4D`,
  300: `${baseColor}66`,
  400: `${baseColor}80`,
  500: baseColor, // Base color
  600: baseColor, // Darker shades would be needed for real contrast
  700: baseColor,
  800: baseColor,
  900: baseColor,
});

const colors = {
  brand: {
    // Example: if you want a 'brand' colorScheme
    ...generateColorScale('#0056B3'),
  },
  'crm-primary': '#0056B3',
  'crm-primary-hover': '#004494', // A slightly darker shade for hover
  'crm-secondary': '#F8F9FA',
  'crm-accent': '#28A745',
  'crm-accent-hover': '#218838',
  'crm-text-dark': '#212529',
  'crm-text-light': '#6C757D',
  'crm-border': '#DEE2E6',
  'crm-input-bg': '#E9ECEF',
  'crm-input-bg-dark': '#2D3748', // For dark mode inputs
  'crm-bg-light': '#FFFFFF',
  'crm-bg-dark': '#1A202C', 
  'crm-card-bg-light': '#FFFFFF',
  'crm-card-bg-dark': '#2D3748', // Slightly lighter than main dark bg

  // State colors (can be used directly or as color schemes)
  'crm-success': '#28A745',
  'crm-warning': '#FFC107',
  'crm-error': '#DC3545',

  // Extended color schemes for Chakra components
  // These allow using colorScheme="crmPrimary" for buttons etc.
  crmPrimary: generateColorScale('#0056B3'),
  crmAccent: generateColorScale('#28A745'),
  // Add other color schemes if needed (e.g., crmError, crmWarning)
  gray: {
    50: '#F8F9FA', // crm-secondary
    100: '#E9ECEF', // crm-input-bg
    200: '#DEE2E6', // crm-border
    // ... more shades of gray
    700: '#6C757D', // crm-text-light
    800: '#212529', // crm-text-dark
  },
};

const fonts = {
  heading: 'Poppins, sans-serif',
  body: 'Inter, sans-serif',
};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const styles = {
  global: (props: any) => ({
    body: {
      fontFamily: 'body',
      color: mode('crm-text-dark', 'whiteAlpha.900')(props),
      bg: mode('crm-secondary', 'crm-bg-dark')(props),
      lineHeight: 'base',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: 'heading',
      fontWeight: 'semibold',
      color: mode('crm-text-dark', 'whiteAlpha.900')(props),
    },
    '*::placeholder': {
      color: mode('gray.400', 'whiteAlpha.400')(props),
    },
    '*, *::before, &::after': {
      borderColor: mode('crm-border', 'whiteAlpha.300')(props),
      wordWrap: 'break-word',
    },
    // Custom scrollbar for a more premium feel
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: mode('gray.100', 'gray.700')(props),
      borderRadius: '8px',
    },
    '::-webkit-scrollbar-thumb': {
      background: mode('crm-primary', 'crmAccent.300')(props),
      borderRadius: '8px',
      '&:hover': {
        background: mode('#004494', 'crmAccent.400')(props),
      },
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md', // Consistent border radius
    },
    variants: {
      solid: (props: any) => {
        if (props.colorScheme === 'crmPrimary') {
          return {
            bg: 'crm-primary',
            color: 'white',
            _hover: {
              bg: 'crm-primary-hover',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            },
            _active: {
              bg: 'crm-primary-hover',
            }
          };
        }
        if (props.colorScheme === 'crmAccent') {
          return {
            bg: 'crm-accent',
            color: 'white',
            _hover: {
              bg: 'crm-accent-hover',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            },
            _active: {
              bg: 'crm-accent-hover',
            }
          };
        }
        return {};
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'crm-primary',
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: 'crm-primary',
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'crm-primary',
    },
  },
  Card: { // Assuming you use a Card component or style Boxes as Cards
    baseStyle: (props: any) => ({
      bg: mode('crm-card-bg-light', 'crm-card-bg-dark')(props),
      borderRadius: 'xl',
      boxShadow: mode('lg', 'dark-lg')(props),
      borderWidth: '1px',
      borderColor: mode('crm-border', 'gray.700')(props),
      p: 6, // Default padding for cards
    }),
  },
  Modal: {
    baseStyle: (props: any) => ({
      dialog: {
        bg: mode('crm-card-bg-light', 'crm-card-bg-dark')(props),
        borderRadius: 'xl',
        boxShadow: mode('2xl', 'dark-lg')(props),
      },
      overlay: {
        backdropFilter: 'blur(5px)',
      }
    }),
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});
