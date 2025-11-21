# Redis v5 Migration Guide

**Created**: 2025-11-15
**Package Version**: redis@5.9.0 (upgraded from 4.7.1)
**Status**: Ready for implementation (not yet used in codebase)

This guide documents the migration path from Redis v4 to v5 for when Redis functionality is implemented in the application.

## Overview

Redis v5 introduces breaking API changes that require code modifications when implementing Redis functionality. This project has preemptively updated to Redis v5 to avoid technical debt, but Redis features are not yet implemented.

## Breaking Changes in Redis v5

### 1. Connection API Changes

**Redis v4 (Old)**:

```typescript
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

await client.connect();
```

**Redis v5 (New)**:

```typescript
import { createClient } from 'redis';

const client = await createClient({
  url: process.env.REDIS_URL,
})
  .on('error', (err) => console.error('Redis Client Error', err))
  .connect();
```

**Key differences**:

- `createClient()` is now async-aware with better promise handling
- Connection errors should be handled with `.on('error')` event listener
- `connect()` returns a promise and can be chained

### 2. Command Execution Changes

**Redis v4 (Old)**:

```typescript
// Commands returned promises directly
await client.set('key', 'value');
const value = await client.get('key');
```

**Redis v5 (New)**:

```typescript
// Commands still return promises but with improved typing
await client.set('key', 'value');
const value = await client.get('key'); // Better TypeScript inference

// New command chaining support
await client.multi().set('key1', 'value1').set('key2', 'value2').exec();
```

**Key differences**:

- Improved TypeScript type definitions
- Better promise chain support
- Enhanced multi/transaction handling

### 3. Pub/Sub API Changes

**Redis v4 (Old)**:

```typescript
const subscriber = client.duplicate();
await subscriber.connect();

subscriber.on('message', (channel, message) => {
  console.log(`${channel}: ${message}`);
});

await subscriber.subscribe('channel');
```

**Redis v5 (New)**:

```typescript
const subscriber = client.duplicate();

await subscriber.connect();

// New message handler with better typing
await subscriber.subscribe('channel', (message, channel) => {
  console.log(`${channel}: ${message}`);
});

// Unsubscribe is now async
await subscriber.unsubscribe('channel');
```

**Key differences**:

- Message callback parameter order changed: `(message, channel)` instead of `(channel, message)`
- Subscription commands now return promises
- Better support for pattern subscriptions

### 4. Disconnect/Quit Changes

**Redis v4 (Old)**:

```typescript
await client.quit();
// or
await client.disconnect();
```

**Redis v5 (New)**:

```typescript
// quit() is now the recommended way
await client.quit();

// disconnect() still works but quit() is preferred
// quit() ensures all pending commands complete
// disconnect() forces immediate closure
```

**Key differences**:

- `quit()` is now the primary method for graceful shutdown
- Better handling of pending commands during shutdown

## Implementation Recommendations

When implementing Redis functionality in this application, follow these patterns:

### 1. Redis Client Singleton

Create a singleton Redis client for the application:

```typescript
// src/lib/database/redis.ts
import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client) {
    return client;
  }

  client = await createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  })
    .on('error', (err) => {
      console.error('Redis Client Error:', err);
    })
    .on('connect', () => {
      console.info('Redis client connected');
    })
    .connect();

  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}
```

### 2. Session Storage Pattern

For NextAuth session storage:

```typescript
// src/lib/services/sessionService.ts
import { getRedisClient } from '@/lib/database/redis';

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export async function storeSession(sessionId: string, data: object) {
  const client = await getRedisClient();
  await client.setEx(`session:${sessionId}`, SESSION_TTL, JSON.stringify(data));
}

export async function getSession(sessionId: string) {
  const client = await getRedisClient();
  const data = await client.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

export async function deleteSession(sessionId: string) {
  const client = await getRedisClient();
  await client.del(`session:${sessionId}`);
}
```

### 3. Caching Pattern

For general application caching:

```typescript
// src/lib/services/cacheService.ts
import { getRedisClient } from '@/lib/database/redis';

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const client = await getRedisClient();
  const serialized = JSON.stringify(value);

  if (ttlSeconds) {
    await client.setEx(key, ttlSeconds, serialized);
  } else {
    await client.set(key, serialized);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  const client = await getRedisClient();
  await client.del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const client = await getRedisClient();
  const keys = await client.keys(pattern);

  if (keys.length > 0) {
    await client.del(keys);
  }
}
```

## Migration Checklist

When implementing Redis functionality, follow this checklist:

- [ ] Create Redis client singleton in `src/lib/database/redis.ts`
- [ ] Implement connection error handling with `.on('error')` listener
- [ ] Use async/await for all Redis operations
- [ ] Implement graceful shutdown with `client.quit()`
- [ ] Add Redis health check to `/api/health` endpoint
- [ ] Implement session storage service (if using Redis for sessions)
- [ ] Implement caching service (if using Redis for caching)
- [ ] Add Redis connection tests
- [ ] Update environment configuration documentation
- [ ] Configure Redis connection pooling if needed
- [ ] Implement pub/sub functionality if needed (use new message handler signature)
- [ ] Add monitoring for Redis connection status
- [ ] Document Redis usage patterns in developer guide

## Testing Redis v5

### Unit Tests

```typescript
// __tests__/lib/database/redis.test.ts
import { getRedisClient, disconnectRedis } from '@/lib/database/redis';

describe('Redis Client', () => {
  afterEach(async () => {
    await disconnectRedis();
  });

  it('should connect to Redis', async () => {
    const client = await getRedisClient();
    expect(client.isOpen).toBe(true);
  });

  it('should store and retrieve data', async () => {
    const client = await getRedisClient();
    await client.set('test:key', 'test-value');
    const value = await client.get('test:key');
    expect(value).toBe('test-value');
    await client.del('test:key');
  });

  it('should handle expiration', async () => {
    const client = await getRedisClient();
    await client.setEx('test:expire', 1, 'expires-soon');

    const value1 = await client.get('test:expire');
    expect(value1).toBe('expires-soon');

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const value2 = await client.get('test:expire');
    expect(value2).toBeNull();
  });
});
```

### Integration Tests

```typescript
// __tests__/lib/services/sessionService.test.ts
import {
  storeSession,
  getSession,
  deleteSession,
} from '@/lib/services/sessionService';
import { disconnectRedis } from '@/lib/database/redis';

describe('Session Service', () => {
  afterAll(async () => {
    await disconnectRedis();
  });

  it('should store and retrieve session', async () => {
    const sessionId = 'test-session-123';
    const sessionData = { userId: '456', email: 'test@example.com' };

    await storeSession(sessionId, sessionData);
    const retrieved = await getSession(sessionId);

    expect(retrieved).toEqual(sessionData);

    await deleteSession(sessionId);
  });
});
```

## Environment Variables

Ensure these environment variables are configured:

```bash
# Redis connection string
REDIS_URL=redis://localhost:6379

# Production example with authentication
# REDIS_URL=redis://username:password@hostname:6379

# Redis TLS example
# REDIS_URL=rediss://hostname:6380
```

## Performance Considerations

### Connection Pooling

Redis v5 handles connection pooling internally. No additional configuration needed for basic usage.

### Pipeline Operations

For bulk operations, use pipelining:

```typescript
const client = await getRedisClient();

// More efficient than individual commands
const pipeline = client.multi();
for (let i = 0; i < 1000; i++) {
  pipeline.set(`key:${i}`, `value${i}`);
}
await pipeline.exec();
```

### Memory Management

Monitor Redis memory usage and configure eviction policies:

```bash
# In redis.conf or via CONFIG SET
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Troubleshooting

### Common Issues

**Issue**: Connection timeout errors
**Solution**: Check `REDIS_URL` configuration and Redis server status

**Issue**: Commands hanging indefinitely
**Solution**: Ensure Redis client is connected before executing commands

**Issue**: Memory leaks
**Solution**: Always call `client.quit()` in cleanup/shutdown handlers

**Issue**: Type errors with Redis commands
**Solution**: Ensure `@types/redis` is installed (included with redis@5.9.0)

## Additional Resources

- [Redis v5 Release Notes](https://github.com/redis/node-redis/releases)
- [Redis v4 to v5 Migration Guide](https://github.com/redis/node-redis/blob/master/docs/v4-to-v5.md)
- [Redis v5 Documentation](https://github.com/redis/node-redis/tree/master/docs)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

## Status

✅ **Package Updated**: redis@5.9.0 installed
⏳ **Implementation Pending**: Redis not yet used in codebase
📋 **Ready to Implement**: Use this guide when implementing Redis features

---

**Note**: This is a preparatory update. The codebase currently has Redis as a dependency but does not yet implement Redis functionality. When implementing Redis features (sessions, caching, etc.), refer to this guide for v5-compatible patterns.
