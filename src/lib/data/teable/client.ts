// Mock Teable client implementation
export const getTeableConfig = () => ({});

export class TeableClient {
  constructor(_config?: unknown) {}

  async runSql<T>(_sql?: string, _params?: unknown[]): Promise<T[]> {
    return [] as T[];
  }

  async createRecord(_table: string, _data: unknown): Promise<{ id: string }> {
    return { id: "mock-id" };
  }

  async updateRecord(_table: string, _id: string, _data: unknown): Promise<{ id: string }> {
    return { id: _id };
  }
}

export type SqlRow = Record<string, unknown>;
export const qiTable = (table: string) => `"${table}"`;
