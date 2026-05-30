export type ContactLogEntry = { date: string; memo?: string };

export function logContact(personId: string, memo?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `contactLog_${personId}`,
    JSON.stringify({ date: new Date().toISOString().slice(0, 10), memo: memo || undefined })
  );
}

export function getRecentContact(personId: string): ContactLogEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`contactLog_${personId}`);
    return raw ? (JSON.parse(raw) as ContactLogEntry) : null;
  } catch {
    return null;
  }
}

export function daysSince(dateStr: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return Math.max(
    0,
    Math.floor((new Date(today).getTime() - new Date(dateStr).getTime()) / 86400000)
  );
}
