export const REFRESH_TOKEN = 'REFRESH_TOKEN';
//COMMENT the refresh cookie is only sent to the auth routes, not with every API request
export const AUTH_COOKIE_PATH = '/api/auth';
//COMMENT a separate cookie and path, so the storefront never holds a CMS session
export const CMS_REFRESH_TOKEN = 'CMS_REFRESH_TOKEN';
export const CMS_AUTH_COOKIE_PATH = '/api/auth/cms';
