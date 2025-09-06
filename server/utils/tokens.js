import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const accessTtlSeconds = 15 * 60; // 15 minutes
const refreshTtlDays = 7; // 7 days

export function signAccessToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return jwt.sign(payload, secret, { expiresIn: accessTtlSeconds });
}

export function signRefreshToken() {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);
  return { token, expiresAt };
}

export function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;
  try { return jwt.verify(token, secret); } catch { return null; }
}

export function getRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? 'none' : 'lax');
  return {
    httpOnly: true,
    secure: isProd || sameSite === 'none',
    sameSite,
    path: '/api/auth/refresh',
    maxAge: refreshTtlDays * 24 * 60 * 60 * 1000,
  };
}
