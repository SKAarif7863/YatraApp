import { verifyAccessToken } from '../utils/tokens.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const decoded = verifyAccessToken(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });
  req.user = { id: decoded.sub };
  next();
}
