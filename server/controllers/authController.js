import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import passport from 'passport';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken, getRefreshCookieOptions } from '../utils/tokens.js';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function userResponse(u) {
  return { id: u._id.toString(), email: u.email, name: u.name };
}

export async function register(req, res) {
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name });
  const accessToken = signAccessToken({ sub: user._id.toString() });
  const { token: refreshToken, expiresAt } = signRefreshToken();
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(refreshToken), expiresAt });
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());
  res.status(201).json({ user: userResponse(user), accessToken });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = signAccessToken({ sub: user._id.toString() });
  const { token: refreshToken, expiresAt } = signRefreshToken();
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(refreshToken), expiresAt });
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());
  res.json({ user: userResponse(user), accessToken });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: userResponse(user) });
}

export async function refresh(req, res) {
  const token = req.cookies.refresh_token || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });
  const tokenHash = hashToken(token);
  const record = await RefreshToken.findOne({ tokenHash });
  if (!record || record.revoked || record.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  const user = await User.findById(record.user);
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
  // rotate
  record.revoked = true;
  await record.save();
  const accessToken = signAccessToken({ sub: user._id.toString() });
  const { token: newRefresh, expiresAt } = signRefreshToken();
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(newRefresh), expiresAt, replacedByTokenHash: record.tokenHash });
  res.cookie('refresh_token', newRefresh, getRefreshCookieOptions());
  res.json({ accessToken });
}

export async function logout(req, res) {
  const token = req.cookies.refresh_token || req.body.refreshToken;
  if (token) {
    const tokenHash = hashToken(token);
    await RefreshToken.updateOne({ tokenHash }, { $set: { revoked: true } });
  }
  res.clearCookie('refresh_token', getRefreshCookieOptions());
  res.json({ success: true });
}

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

export function googleCallback(req, res) {
  const user = req.user;
  const accessToken = signAccessToken({ sub: user._id.toString() });
  const { token: refreshToken, expiresAt } = signRefreshToken();
  RefreshToken.create({ user: user._id, tokenHash: hashToken(refreshToken), expiresAt }).catch(() => {});
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());
  const redirect = process.env.GOOGLE_REDIRECT_SUCCESS || '';
  if (redirect) return res.redirect(redirect);
  res.json({ user: userResponse(user), accessToken });
}
