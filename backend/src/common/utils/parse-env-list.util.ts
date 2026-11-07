//COMMENT "a, b," -> ["a", "b"]
export function parseEnvList(value?: string) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}
