export function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env and set the required value.`);
  }

  return value;
}
