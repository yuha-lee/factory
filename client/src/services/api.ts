import axios, { AxiosHeaders } from 'axios';
import Config from 'react-native-config';

const API = axios.create({ baseURL: Config.API_BASE_URL });
API.interceptors.request.use(config => {
  const headers = new AxiosHeaders(config.headers);
  const token = Config.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  config.headers = headers;
  return config;
});

export async function fetchTheme(tenantId: string) {
  return API.get(`/get-theme/${tenantId}`)
    .then(r => r.data)
    .catch(error => console.log(`API Error: ${error.response}`));
}

export async function fetchSchema(tenantId: string, screen: string) {
  const url = `/get-ui-schema/${tenantId}/${screen}`;
  
  return API.get(url)
    .then(r => r.data)
    .catch((error) => console.log(`API Error: ${error.response?.status} - ${error.response?.statusText}`));
}

export default API;