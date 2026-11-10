// Server-only entry: keeps the DAL out of client bundles that import `@/entities/banner`
export {
  getAdminBanner,
  getAdminBanners,
  getBannerLinkTargets,
} from './api/get-admin-banners';
