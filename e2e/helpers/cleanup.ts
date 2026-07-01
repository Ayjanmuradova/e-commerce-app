import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteProductByTitle(title: string): Promise<void> {
  try {
    await prisma.product.deleteMany({ where: { title } });
  } catch (error) {
    console.error(`Cleanup failed for "${title}":`, error);
  }
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Prisma disconnect failed:", error);
  }
}
