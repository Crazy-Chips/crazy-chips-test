import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  
  // Set up WebSocket constructor for serverless environments (Node.js does not have native WebSocket)
  neonConfig.webSocketConstructor = ws

  // Use Neon serverless WebSocket connection pool configuration
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Lazily initialize PrismaClient using a Proxy to avoid build-time errors when DATABASE_URL is not set
let prismaInstance: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      prismaInstance = globalForPrisma.prisma || createPrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance
      }
    }
    const value = Reflect.get(prismaInstance, prop)
    if (typeof value === 'function') {
      return value.bind(prismaInstance)
    }
    return value
  }
})

