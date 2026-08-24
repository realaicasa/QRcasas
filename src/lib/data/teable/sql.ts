// Mock Teable SQL helpers
export const lit = (value: any) => {
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (value === null) {
    return 'NULL';
  }
  return String(value);
};

export const qi = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;
