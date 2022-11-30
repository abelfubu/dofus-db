import { PrismaClient } from '@prisma/client';
import * as data from './harvest-data.json';

const prisma = new PrismaClient();

function mapType(item: string): number {
  return {
    monster: 0,
    boss: 1,
    archi: 2,
  }[item];
}

async function main() {
  for (const item of data) {
    await prisma.harvest.create({
      data: {
        name: item.name,
        image: item.image,
        level: item.level,
        subzone: item.subzone,
        zone: item.zone,
        step: item.step,
        type: mapType(item.type),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
