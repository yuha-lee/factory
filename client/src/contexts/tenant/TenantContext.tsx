import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import tenants from './tenants.json';
import DeviceInfo from 'react-native-device-info';
import Spinner from '../../components/Spinner';

type TenantConfig = {
  tenantId: string;
};

const TenantContext = createContext<TenantConfig | null>(null);

type TenantProviderProps = {
  children: ReactNode;
};

export function TenantProvider({ children }: TenantProviderProps) {
  const [config, setConfig] = useState<TenantConfig | null>(null);

  useEffect(() => {
    const bundleId = DeviceInfo.getBundleId();
    const tenantId = bundleId.split('.').pop()!;
    const cfg = (tenants as any)[tenantId];

    if (!cfg) {
      throw new Error(`Unknown tenant: ${tenantId}`);
    }

    setConfig({ tenantId, ...cfg });
  }, []);

  if (!config) {
    return;
  }

  return (
    <TenantContext.Provider value={config}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant() must be used within a TenantProvider');
  }
  return ctx;
}
