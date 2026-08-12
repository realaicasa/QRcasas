// Mock cache functions
export const TAGS = {
  WATCHLIST: 'watchlist',
  AGENTS: 'agents',
  USERS: 'users',
  PROPERTIES: 'properties',
};

export const invalidate = (options: { tags?: string[] }) => {
  // Mock implementation
  return Promise.resolve();
};
