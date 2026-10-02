const cache = new Map();
const CACHE_TTL = 60 * 1000;

function getCacheKey(request) {
  return request.originalUrl;
}

function cacheMiddleware(request, response, next) {
  const key = getCacheKey(request);
  const entry = cache.get(key);

  if (entry && entry.expiresAt > Date.now()) {
    response.set('X-Cache', 'HIT');
    return response.json(entry.value);
  }

  if (entry) {
    cache.delete(key);
  }

  response.set('X-Cache', 'MISS');
  const originalJson = response.json.bind(response);

  response.json = (value) => {
    cache.set(key, {
      value,
      expiresAt: Date.now() + CACHE_TTL,
    });
    return originalJson(value);
  };

  return next();
}

function clearCache() {
  cache.clear();
}

module.exports = { cacheMiddleware, clearCache, CACHE_TTL };
