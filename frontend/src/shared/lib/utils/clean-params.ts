export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== 'any' &&
        value !== '' &&
        (Array.isArray(value) ? value.some(v => v !== null) : value !== null),
    ),
  );
}
