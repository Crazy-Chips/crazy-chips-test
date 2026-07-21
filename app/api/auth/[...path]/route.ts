import { createNeonAuth } from '@neondatabase/auth/next/server';

const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'http://localhost:3000',
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'temp_secret_for_build_purposes_only_replace_in_env',
  },
});

export const { GET, POST } = auth.handler();
