let PrismaClient: any

try {
  // Try the standard import first
  PrismaClient = require("@prisma/client").PrismaClient
} catch (error) {
  // Fallback for environments where the module might not be available
  console.warn("Prisma Client not available, using mock")
  PrismaClient = class MockPrismaClient {
    user = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    }
    organization = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    }
    lab = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    }
    labRun = {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    }
    organizationMember = {
      findFirst: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    }
    organizationInvitation = {
      findFirst: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
    }
    publishRequest = {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
