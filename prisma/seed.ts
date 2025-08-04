import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await new BcryptHasher().hash('123456');

  await prisma.user.create({
    data: {
      name: 'Teste User',
      email: 'teste@email.com',
      password: hashedPassword,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
