// Server-only entry: keeps the DAL out of client bundles that import `@/entities/user`
export { getCurrentUser } from './api/get-current-user';
