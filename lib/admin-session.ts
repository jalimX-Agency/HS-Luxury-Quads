import { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'hs_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;
const encoder = new TextEncoder();

export interface AdminSession {
  userId: string;
  email: string;
}

interface SessionPayload extends AdminSession {
  exp: number;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET must be configured');
  }

  return secret;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signPayload(payload: string) {
  const key = await getHmacKey(getSessionSecret());
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payload: string, signature: string) {
  const key = await getHmacKey(getSessionSecret());

  try {
    const signatureBytes = fromBase64Url(signature);
    return crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payload));
  } catch {
    return false;
  }
}

function encodePayload(data: SessionPayload) {
  return toBase64Url(encoder.encode(JSON.stringify(data)));
}

function decodePayload(payload: string): SessionPayload | null {
  try {
    const bytes = fromBase64Url(payload);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(session: AdminSession) {
  const payload = encodePayload({
    userId: session.userId,
    email: session.email,
    exp: Date.now() + SESSION_TTL_MS,
  });

  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

export async function parseAdminSessionToken(token: string | undefined | null): Promise<AdminSession | null> {
  if (!token) return null;

  const [payload, signature] = token.split('.');

  if (!payload || !signature || !(await verifyPayload(payload, signature))) {
    return null;
  }

  const data = decodePayload(payload);

  if (
    !data ||
    typeof data.exp !== 'number' ||
    data.exp <= Date.now() ||
    typeof data.userId !== 'string' ||
    typeof data.email !== 'string'
  ) {
    return null;
  }

  return {
    userId: data.userId,
    email: data.email,
  };
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  return parseAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(maxAge = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
