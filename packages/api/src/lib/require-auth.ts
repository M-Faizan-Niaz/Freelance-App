import { auth } from '@/lib/auth';
import { UnauthorizedError } from '@/core/errors';

export async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}
