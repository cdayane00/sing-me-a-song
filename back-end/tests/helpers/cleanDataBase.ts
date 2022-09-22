import { prisma } from '../../src/database';

const cleanDataBase = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
};
export default cleanDataBase;
