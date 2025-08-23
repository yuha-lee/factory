import axios from 'axios';
import Config from 'react-native-config';

const API = axios.create({ baseURL: Config.API_BASE_URL });
API.interceptors.request.use(config => Promise.resolve(config));

export async function fetchTheme(tenantId: string) {
  return API.get(`/api/themes/${tenantId}`).then(r => r.data);
}

export async function fetchSchema(tenantId: string, screen: string) {
  return API.get(`/api/ui/${tenantId}/${screen}`)
    .then(r => r.data)
    .catch((error) => console.log(error));
}

export default API;