import redisClient from "./redis";

// Menyimpan data (Set)
export const setCache = async (key: string, data: any, ttlSeconds = 86400) => {
  try {
    // Perbedaan penulisan EX di ioredis
    await redisClient.set(key, data, "EX", ttlSeconds);
  } catch (error) {
    console.error("Gagal menyimpan cache:", error);
  }
};

// Mengambil data (Get)
export const getCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return cachedData;
    }

    return null;
  } catch (error) {
    console.error("Gagal mengambil cache:", error);
    return null;
  }
};

// Menghapus data cache tertentu
export const clearCache = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Gagal menghapus cache:", error);
  }
};

// Menghapus semua cache dengan prefix tertentu
export const clearCachePrefix = async (prefix: string) => {
  try {
    const stream = redisClient.scanStream({
      match: `${prefix}*`,
      count: 100,
    });

    const keysToDelete: string[] = [];
    for await (const keys of stream) {
      if (keys.length) {
        keysToDelete.push(...keys);
      }
    }

    if (keysToDelete.length > 0) {
      await redisClient.del(...keysToDelete);
    }
  } catch (error) {
    console.error("Gagal menghapus cache prefix:", error);
  }
};

// ============ FUNGSI BARU UNTUK JSON CACHING ============

// Menyimpan data JSON dengan TTL
export const setCacheJSON = async (
  key: string,
  data: any,
  ttlSeconds = 18000, // Default 5 jam
) => {
  try {
    const serialized = JSON.stringify(data);
    await redisClient.set(key, serialized, "EX", ttlSeconds);
  } catch (error) {
    console.error("Gagal menyimpan cache JSON:", error);
  }
};

// Mengambil data JSON
export const getCacheJSON = async <T = any>(key: string): Promise<T | null> => {
  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    return null;
  } catch (error) {
    console.error("Gagal mengambil cache JSON:", error);
    return null;
  }
};

// Menyimpan data ke hash (berguna untuk menyimpan banyak field dalam satu key)
export const setCacheHash = async (
  key: string,
  field: string,
  data: any,
  ttlSeconds = 18000, // Default 5 jam
) => {
  try {
    const serialized = JSON.stringify(data);
    await redisClient.hset(key, field, serialized);
    await redisClient.expire(key, ttlSeconds);
  } catch (error) {
    console.error("Gagal menyimpan cache hash:", error);
  }
};

// Mengambil data dari hash
export const getCacheHash = async <T = any>(
  key: string,
  field: string,
): Promise<T | null> => {
  try {
    const cachedData = await redisClient.hget(key, field);

    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    return null;
  } catch (error) {
    console.error("Gagal mengambil cache hash:", error);
    return null;
  }
};

// Menghapus field dari hash
export const clearCacheHash = async (key: string, field?: string) => {
  try {
    if (field) {
      await redisClient.hdel(key, field);
    } else {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error("Gagal menghapus cache hash:", error);
  }
};
