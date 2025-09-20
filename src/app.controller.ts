import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  @Get('health')
  getHealth(): string {
    return 'Ngar loe ma sor twy lee pl';
  }

  @Get('redis/client')
  getRedisClient() {
    const redisClient = this.redisService.getClient();
    return {
      message: 'Redis client available',
      clientType: typeof redisClient,
      methods: Object.keys(redisClient),
    };
  }

  @Post('redis/set')
  async setRedis(@Body() body: { key: string; value: unknown; ttl?: number }) {
    const { key, value, ttl } = body;
    await this.redisService.set(key, value, ttl);
    return {
      message: 'Redis set successfully',
      key,
      value,
      ttl,
    };
  }

  @Get('redis/get/:key')
  async getRedis(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return {
      message: 'Redis get successfully',
      key,
      value,
    };
  }

  @Delete('redis/delete/:key')
  async deleteRedis(@Param('key') key: string) {
    await this.redisService.del(key);
    return {
      message: 'Redis deleted successfully',
      key,
    };
  }

  @Post('redis/bulk-set')
  async bulkSetRedis(
    @Body() body: { items: Array<{ key: string; value: unknown }> },
  ) {
    const { items } = body;
    const startTime = Date.now();

    await Promise.all(
      items.map((item) => this.redisService.set(item.key, item.value)),
    );

    const duration = Date.now() - startTime;
    return {
      message: 'Redis bulk set successfully',
      count: items.length,
      duration: `${duration}ms`,
      averageDuration: `${duration / items.length}ms`,
    };
  }

  @Get('redis/bulk-get')
  async bulkGetRedis(@Body() body: { keys: string[] }) {
    const { keys } = body;
    const startTime = Date.now();

    const results = await Promise.all(
      keys.map(async (key) => ({
        key,
        value: await this.redisService.get(key),
        found: (await this.redisService.get(key)) !== null,
      })),
    );

    const duration = Date.now() - startTime;
    return {
      message: 'Redis bulk get successfully',
      keys,
      duration: `${duration}ms`,
      results,
    };
  }
}
