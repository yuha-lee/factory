import React, { createContext, useContext } from 'react';
import { Appearance } from 'react-native';
import { tokens } from './tokens';
import { useTenant } from '../tenant/TenantContext';
import { Theme } from './types';

const ThemeContext = createContext<Theme>({} as Theme);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { tenantId } = useTenant();
  const tenantTokens = tokens.tenants[tenantId];
  const colorScheme = Appearance.getColorScheme() ?? 'light';

  const mergedTheme = {
    colors: {
      ...tokens.modes[colorScheme],
      ...tenantTokens?.colors ?? {},
    },
    spacing: {
      ...tokens.base.spacing,
      ...tenantTokens?.base?.spacing ?? {},
    },
    typography: {
      ...tokens.base.typography,
      ...tenantTokens?.base?.typography ?? {},
    },
    borderRadius: {
      ...tokens.base.borderRadius,
      ...tenantTokens?.base?.borderRadius ?? {},
    },
    shadows: {
      ...tokens.base.shadows,
      ...tenantTokens?.base?.shadows ?? {},
    },
  };

  return <ThemeContext.Provider value={mergedTheme}>
    {children}
  </ThemeContext.Provider>
};

export const useTheme = () => useContext(ThemeContext);
