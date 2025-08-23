import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { tokens } from './tokens/';
import { useTenant } from '../tenant/TenantContext';
import { Theme } from './types';
import { fetchTheme } from '../../services/api';

const ThemeContext = createContext<Theme>({} as Theme);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { tenantId } = useTenant();
  const [theme, setTheme] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTheme(tenantId)
      .then(theme => setTheme(theme))
      .catch(error => setError(error.message || 'Failed to load theme'));
  }, [tenantId]);

  const colorScheme = Appearance.getColorScheme() ?? 'light';

  const mergedTheme = {
    colors: {
      ...tokens.modes[colorScheme],
      ...theme?.colors ?? {},
    },
    spacing: {
      ...tokens.base.spacing,
      ...theme?.base?.spacing ?? {},
    },
    typography: {
      ...tokens.base.typography,
      ...theme?.base?.typography ?? {},
    },
    borderRadius: {
      ...tokens.base.borderRadius,
      ...theme?.base?.borderRadius ?? {},
    },
    shadows: {
      ...tokens.base.shadows,
      ...theme?.base?.shadows ?? {},
    },
  };

  return <ThemeContext.Provider value={mergedTheme}>
    {children}
  </ThemeContext.Provider>
};

export const useTheme = () => useContext(ThemeContext);
