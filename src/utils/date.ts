export function getAge(birthDate: Date, now = new Date()): number {
    const y = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const m = now.getUTCMonth() - birthDate.getUTCMonth();
    const d = now.getUTCDate() - birthDate.getUTCDate();
    return m < 0 || (m === 0 && d < 0) ? y - 1 : y;
  }

export function yearsSince(date: Date, now = new Date()): number {
    const y = now.getUTCFullYear() - date.getUTCFullYear();
    const m = now.getUTCMonth() - date.getUTCMonth();
    const d = now.getUTCDate() - date.getUTCDate();
    return m < 0 || (m === 0 && d < 0) ? y - 1 : y;
  }
