export function notFound(_req, res, _next) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}
