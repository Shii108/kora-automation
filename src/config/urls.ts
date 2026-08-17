import { requireEnv } from './env';

export function apiUrl(path: string) {
  return new URL(path, requireEnv('API_URL')).toString();
}
