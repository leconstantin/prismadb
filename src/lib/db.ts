// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()
    .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY }))
    .$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
