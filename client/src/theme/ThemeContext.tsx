import React, { createContext, useContext } from 'react';
import { Appearance } from 'react-native';
import { tokens } from './tokens';
import { getTenantConfig } from '../config/tenant';

const colorScheme = Appearance.getColorScheme() ?? 'light';
const { tenantId } = getTenantConfig();
const tenantTokens = tokens.tenants[tenantId];

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

const ThemeContext = createContext(mergedTheme);
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ThemeContext.Provider value={mergedTheme}>
    {children}
  </ThemeContext.Provider>
);
export const useTheme = () => useContext(ThemeContext);
