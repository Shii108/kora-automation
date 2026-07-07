const defaultApiUrl = 'http://localhost:8000';

export function apiUrl(path: string) {
  const baseUrl = process.env.API_URL || process.env.BASE_URL || defaultApiUrl;
  return new URL(path, baseUrl).toString();
}
