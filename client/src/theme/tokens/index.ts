import { ThemeTokens, token } from './base';

export const tokens = {
  base: token.base,
  modes: token.modes,
  tenants: {} as Record<string, ThemeTokens>
};

export type Tokens = typeof tokens;