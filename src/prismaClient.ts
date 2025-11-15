import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 */
declare global {
    var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client Instance
 */
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
