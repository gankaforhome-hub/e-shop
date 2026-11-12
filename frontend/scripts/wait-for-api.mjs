// Runs before `next build`: the build reads the API (failOnBuild), and the free Render
// instance sleeps when idle and needs up to a few minutes to start. This wakes it and waits,
// so the build doesn't fail on the 8 s request timeout of `backendGet`.
// Sets `process.exitCode` instead of calling `process.exit()`: exiting right after `fetch`
// crashes Node on Windows (libuv `UV_HANDLE_CLOSING` assertion).

const ATTEMPTS = 36;
const INTERVAL_MS = 5_000;
const REQUEST_TIMEOUT_MS = 10_000;

async function isUp(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  await response.body?.cancel();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

async function waitForApi(healthUrl) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      await isUp(healthUrl);
      console.log(`API is up: ${healthUrl}`);
      return true;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.log(`Waiting for the API (${attempt}/${ATTEMPTS}): ${reason}`);
    }
    if (attempt < ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
    }
  }
  return false;
}

const apiUrl = process.env.API_URL?.replace(/\/+$/, '');

if (!apiUrl) {
  console.error('API_URL is not set (see frontend/.env.example)');
  process.exitCode = 1;
} else if (!(await waitForApi(`${apiUrl}/server/live`))) {
  console.error(
    `API is not reachable at ${apiUrl}/server/live; the build needs it (run pnpm bdev locally)`,
  );
  process.exitCode = 1;
}
