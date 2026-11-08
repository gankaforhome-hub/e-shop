// Content-addressed storage key: the same file always lands on the same key
export function mediaKey(checksum: string, width: number) {
  return `media/${checksum}/${width}.webp`;
}

const toPercent = (fraction: number) => `${Math.round(fraction * 100)}%`;

// Focal point (0..1) → CSS object-position, e.g. "50% 30%"
export function toObjectPosition(focalX: number, focalY: number) {
  return `${toPercent(focalX)} ${toPercent(focalY)}`;
}
