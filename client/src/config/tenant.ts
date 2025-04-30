import tenants from '../config/tenants.json';
import DeviceInfo from 'react-native-device-info';

export function getTenantConfig() {
  const bundleId = DeviceInfo.getBundleId();
  const tenantId = bundleId.split('.').pop()!;
  const cfg = (tenants as any)[tenantId];
  if (!cfg) throw new Error(`Unknown tenant: ${tenantId}`);
  return { tenantId, ...cfg };
}