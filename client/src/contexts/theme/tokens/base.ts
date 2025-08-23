export const token = {
  base: {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
    },
    typography: {
      fontFamily: 'System',
      fontWeight: { regular: '400', medium: '500', bold: '700' },
      fontSize: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 },
      lineHeight: { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40 },
    },
    borderRadius: { sm: 4, md: 8, lg: 16, pill: 50 },
    shadows: {
      sm: { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1 },
      md: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62 },
      lg: { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65 },
    },
  },

  modes: {
    light: {
      primary:        '#6200EE',
      primaryVariant: '#3700B3',
      secondary:      '#03DAC6',
      secondaryVariant:'#018786',
      background:     '#FFFFFF',
      surface:        '#FFFFFF',
      error:          '#B00020',
      onPrimary:      '#FFFFFF',
      onSecondary:    '#000000',
      onBackground:   '#000000',
      onSurface:      '#000000',
      onError:        '#FFFFFF',
      neutral100:     '#F5F5F5',
      neutral200:     '#EEEEEE',
      neutral300:     '#E0E0E0',
      neutral400:     '#BDBDBD',
      neutral500:     '#9E9E9E',
      neutral600:     '#757575',
      neutral700:     '#616161',
      neutral800:     '#424242',
      neutral900:     '#212121',
    },
    dark: {
      primary:        '#BB86FC',
      primaryVariant: '#3700B3',
      secondary:      '#03DAC6',
      secondaryVariant:'#03DAC6',
      background:     '#121212',
      surface:        '#1E1E1E',
      error:          '#CF6679',
      onPrimary:      '#000000',
      onSecondary:    '#000000',
      onBackground:   '#FFFFFF',
      onSurface:      '#FFFFFF',
      onError:        '#000000',
      neutral100:     '#1E1E1E',
      neutral200:     '#2C2C2C',
      neutral300:     '#373737',
      neutral400:     '#424242',
      neutral500:     '#616161',
      neutral600:     '#757575',
      neutral700:     '#9E9E9E',
      neutral800:     '#BDBDBD',
      neutral900:     '#E0E0E0',
    },
  }
} as const;

export type ThemeTokens = {
  base: typeof token.base;
  colors: typeof token.modes.light;
};
