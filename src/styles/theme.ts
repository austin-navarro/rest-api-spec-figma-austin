export const theme = {
  colors: {
    primary: {
      blue: '#1CD6FF', // Primary Blue from Figma
      turquoise: '#00C2FF', // Turquoise02
    },
    grey: {
      dark: '#373737', // darkgrey
      medium: '#808080', // Grey
      light: '#F5F5F5', // Off White
    },
    black: '#000000',
    white: '#FFFFFF',
    offBlack: '#1A1A1A',
  },
  typography: {
    display: {
      30: {
        fontSize: '30px',
        lineHeight: '36px',
      },
    },
    body: {
      20: {
        fontSize: '20px',
        lineHeight: '24px',
      },
    },
    small: {
      20: {
        fontSize: '16px',
        lineHeight: '20px',
      },
    },
  },
  effects: {
    shadow: {
      default: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      popup: '0px 8px 16px rgba(0, 0, 0, 0.15)',
    },
  },
  layout: {
    grid: {
      columns: 12,
      gutter: '24px',
      margin: '24px',
    },
  },
} as const;

export type Theme = typeof theme; 