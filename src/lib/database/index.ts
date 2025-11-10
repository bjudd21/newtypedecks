// Database connection and utilities
import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// In development, store the client on the global object to prevent
// multiple instances during hot reloading
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection test function
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.warn('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown function
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.warn('🔌 Database disconnected');
}
