const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 120,
});

const limiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.connection.remoteAddress);
    next();
  } catch (error) {
    res.set({
      "Retry-After": error.msBeforeNext / 1000,
      "X-RateLimit-Reset": new Date(Date.now() + error.msBeforeNext),
    });
    return res.status(429).send({ error: "too many requests try again later" });
  }
};

module.exports = limiter;
