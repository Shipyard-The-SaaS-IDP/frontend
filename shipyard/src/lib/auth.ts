import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

/** Server-side: fetch the current user from the backend using the cookie. */
export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('shipyard_token')?.value;
  if (!token) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Cookie: `shipyard_token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Client-side: clear auth cookie and redirect to /signup. */
export function signOut() {
  document.cookie = 'shipyard_token=; path=/; max-age=0';
  window.location.href = '/signup';
}
