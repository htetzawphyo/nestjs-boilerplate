import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,
  ) {
    this.redisClient.on('connect', () => {
      this.logger.log('Redis client connected');
    });
    this.redisClient.on('error', (error) => {
      this.logger.error('Redis client error', error);
    });
    this.redisClient.on('end', () => {
      this.logger.log('Redis client disconnected');
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  getClient(): Redis.Redis {
    return this.redisClient;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<'OK' | null> {
    const stringifiedValue = JSON.stringify(value);
    if (ttl) {
      return this.redisClient.set(key, stringifiedValue, 'EX', ttl);
    }
    return this.redisClient.set(key, stringifiedValue);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async expire(key: string, ttl: number): Promise<number> {
    return this.redisClient.expire(key, ttl);
  }

  async invalidateCache(cachePrefix: string) {
    try {
      const keys = await this.redisClient.keys(`${cachePrefix}:*`);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
        this.logger.log(
          `Invalidated ${keys.length} cache keys with prefix ${cachePrefix}`,
        );
      }
    } catch (error) {
      this.logger.error('Error invalidating cache', error);
      throw error;
    }
  }

  async checkRedisHealth() {
    try {
      await this.redisClient.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis client is not healthy', error);
      return false;
    }
  }
}
