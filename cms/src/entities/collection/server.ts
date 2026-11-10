// Server-only entry: keeps the DAL out of client bundles that import `@/entities/collection`
export {
  getAdminCollection,
  getAdminCollections,
  getAdminSeasons,
  getSeasons,
} from './api/get-admin-collections';
