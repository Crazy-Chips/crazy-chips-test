import { authClient } from './auth-client';

export function useSession() {
  const session = authClient.useSession();
  
  const status = session.isPending
    ? 'loading'
    : session.data
    ? 'authenticated'
    : 'unauthenticated';
    
  const data = session.data
    ? {
        user: {
          id: session.data.user.id,
          name: session.data.user.name,
          email: session.data.user.email,
          image: session.data.user.image,
        },
        expires: new Date(session.data.session.expiresAt).toISOString(),
      }
    : null;

  return {
    data,
    status,
    update: async () => {},
  };
}

export async function signOut(options?: { callbackUrl?: string }) {
  await authClient.signOut();
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl;
  } else {
    window.location.reload();
  }
}

export async function signIn(provider: string, options?: any) {
  if (provider === 'google') {
    return await authClient.signIn.social({
      provider: 'google',
      callbackURL: options?.callbackUrl || '/',
    });
  }
  if (provider === 'apple') {
    return await authClient.signIn.social({
      provider: 'apple',
      callbackURL: options?.callbackUrl || '/',
    });
  }
  if (provider === 'customer-credentials') {
    try {
      const result = await authClient.signIn.email({
        email: options.identifier,
        password: options.password,
      });
      if (result.error) {
        return { error: result.error.message || 'Invalid credentials' };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Invalid credentials' };
    }
  }
  return { error: 'Unsupported provider' };
}
