const cache = require('memory-cache');

const memoryCacheMiddleware = (seconds, contentType = "application/json") => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cacheContent = cache.get(key);

    res.setHeader('Content-Type', contentType);

    if (cacheContent)
      return res.send(cacheContent);

    res.sendResponse = res.send;

    res.send = (body) => {
      cache.put(key, body, seconds * 1000);
      res.sendResponse(body)
    };

    return next();
  }
};

const clientCacheMiddleware = (seconds = 60 * 60 * 24 * 7) => {
  return (req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=${seconds}`);
    return next();
  }
};

module.exports = {
  memoryCacheMiddleware,
  clientCacheMiddleware
};