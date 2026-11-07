const isProduction = process.env.NODE_ENV === 'production';

//INFO Read at request time: `next build` needs neither of these variables.
function readEnv(name: string, developmentFallback: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  }
  if (isProduction) {
    throw new Error(`${name} is not set`);
  }
  return developmentFallback;
}

export const getApiUrl = () => readEnv('API_URL', 'http://localhost:3001/api');

export const getCmsOrigin = () =>
  new URL(readEnv('CMS_URL', 'http://localhost:3030')).origin;

export const isSecureCookies = () => isProduction;
