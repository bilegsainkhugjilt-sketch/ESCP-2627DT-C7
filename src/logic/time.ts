/** "HH:MM" → minutes after midnight */
export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** minutes after midnight → "HH:MM" */
export function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function overlaps(a: [number, number], b: [number, number], gap = 0): boolean {
  return a[0] < b[1] + gap && b[0] < a[1] + gap;
}
