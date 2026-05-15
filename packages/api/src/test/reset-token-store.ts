const store = new Map<string, string>();

export const resetTokenStore = {
  set: (email: string, token: string) => store.set(email, token),
  get: (email: string) => store.get(email) ?? null,
  clear: () => store.clear(),
  delete: (email: string) => store.delete(email),
};
