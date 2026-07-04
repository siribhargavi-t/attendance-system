const memoryCache = {};

class CacheManager {
  constructor() {
    this.client = null;
    this.redisConnected = false;

    // Check if REDIS_URL exists in process.env
    if (process.env.REDIS_URL) {
      try {
        const redis = require("redis");
        this.client = redis.createClient({ url: process.env.REDIS_URL });
        this.client.connect()
          .then(() => {
            this.redisConnected = true;
            console.log("🔌 Redis connected successfully for Admin Dashboard caching.");
          })
          .catch((err) => {
            console.warn("⚠️ Redis connection failed. Falling back to in-memory cache:", err.message);
          });
      } catch (err) {
        console.warn("⚠️ Redis package loading failed. Falling back to in-memory cache.");
      }
    }
  }

  async get(key) {
    if (this.redisConnected && this.client) {
      try {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } catch (err) {
        console.warn("Redis GET error, falling back to memory:", err.message);
      }
    }

    // In-memory fallback
    const cached = memoryCache[key];
    if (cached) {
      if (cached.expiresAt > Date.now()) {
        return cached.data;
      }
      delete memoryCache[key]; // Clean up expired
    }
    return null;
  }

  async setex(key, seconds, data) {
    if (this.redisConnected && this.client) {
      try {
        await this.client.setEx(key, seconds, JSON.stringify(data));
        return;
      } catch (err) {
        console.warn("Redis SETEX error, falling back to memory:", err.message);
      }
    }

    // In-memory fallback
    memoryCache[key] = {
      data,
      expiresAt: Date.now() + (seconds * 1000)
    };
  }

  async del(key) {
    if (this.redisConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (err) {
        console.warn("Redis DEL error, falling back to memory:", err.message);
      }
    }
    delete memoryCache[key];
  }
}

module.exports = new CacheManager();
