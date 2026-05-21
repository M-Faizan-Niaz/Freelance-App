export type NavUser = {
  name: string;
  email: string;
  image?: string | null;
};

export type ApiError = {
  data?: { error?: { message?: string } };
};
