/** "Ganka Admin" → "GA"; one-word names give one letter. */
export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toLocaleUpperCase())
    .join('');
}
