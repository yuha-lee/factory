import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';

const API = axios.create({ baseURL: Config.API_BASE_URL });

API.interceptors.request.use(
  async config => {
    const creds = await Keychain.getGenericPassword({ service: 'accessToken' });
    if (creds) {
      config.headers!['Authorization'] = `Bearer ${creds.password}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

export async function fetchTheme(tenantId: string) {
  return API.get(`/api/themes/${tenantId}`).then(r => r.data);
}

export async function fetchSchema(tenantId: string, screen: string) {
  return API.get(`/api/ui/${tenantId}/${screen}`).then(r => r.data);
}

export default API;