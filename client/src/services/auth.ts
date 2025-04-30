import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';
import { getTenantConfig } from '../config/tenant';

const { clientId, realm } = getTenantConfig();

export async function login(username: string, password: string) {
	const url = `${Config.KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: clientId,
    username,
    password,
  }).toString();

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

	const json = await res.json();

	if (json.access_token) {
		await Keychain.setGenericPassword('token', json.access_token, {
      service: 'accessToken',
    });
	}

	return json;
}

export async function logout() {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
}
