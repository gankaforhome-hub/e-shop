export function isVideoUrl(url: string | unknown): boolean {
  if (typeof url !== 'string') {
    return false;
  }
  const cleanUrl = (url.split('?')[0] || '').toLowerCase();
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl);
}
