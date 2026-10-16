/**
 * Client-safe entry (no `server-only` DAL): season types for code that runs in
 * the browser. Server reads (`getSeasons`) live in `./index`.
 */
export { type SeasonSlug } from './model/season';
