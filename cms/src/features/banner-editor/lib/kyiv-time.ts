/**
 * Banner schedules are entered in Kyiv time, whatever the editor's or the server's time zone:
 * the shop runs in Ukraine, and the same value renders on the server and in the browser
 * (no hydration mismatch). Pure functions over `YYYY-MM-DDTHH:mm` (`<input type=datetime-local>`).
 */

export const SCHEDULE_TIME_ZONE = 'Europe/Kyiv';

const LOCAL_VALUE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SCHEDULE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Kyiv wall-clock parts of an instant. */
function kyivParts(date: Date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

/** ISO instant → `YYYY-MM-DDTHH:mm` in Kyiv; `''` for no date. */
export function isoToKyivLocal(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const { year, month, day, hour, minute } = kyivParts(new Date(iso));
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

/**
 * `YYYY-MM-DDTHH:mm` in Kyiv → ISO instant; `null` for `''` or a malformed value. The offset
 * (+02:00 or +03:00 in summer) is taken at that moment.
 */
export function kyivLocalToIso(value: string): string | null {
  const match = LOCAL_VALUE.exec(value);
  if (!match) {
    return null;
  }
  const [year, month, day, hour, minute] = match.slice(1, 6).map(Number);
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hour === undefined ||
    minute === undefined
  ) {
    return null;
  }
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  // How far Kyiv's clock is ahead of UTC at a given instant
  const offsetAt = (instant: number) => {
    const shown = kyivParts(new Date(instant));
    return (
      Date.UTC(
        shown.year,
        shown.month - 1,
        shown.day,
        shown.hour,
        shown.minute,
      ) - instant
    );
  };
  // Two passes: the first guess may sit on the other side of a daylight-saving change
  const guess = asUtc - offsetAt(asUtc);
  return new Date(asUtc - offsetAt(guess)).toISOString();
}
