const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

function isRemoteTarget(value: string) {
  const target = new URL(value);
  return !localHosts.has(target.hostname);
}

export default function globalSetup() {
  const targetsRemoteEnvironment =
    isRemoteTarget(process.env.API_URL!) || isRemoteTarget(process.env.USER_URL!);

  if (targetsRemoteEnvironment && process.env.ALLOW_REMOTE_TESTS !== 'true') {
    throw new Error(
      [
        'Remote test execution is blocked.',
        'The configured API_URL or USER_URL points outside localhost.',
        'Set ALLOW_REMOTE_TESTS=true only for an approved CI deployment or an intentional manual run.',
      ].join(' '),
    );
  }
}
