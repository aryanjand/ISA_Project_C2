import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummy = await prisma.user.upsert({
    where: { username: 'dummyuser' },
    update: {},
    create: {
      username: 'dummyuser',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

  const aryan = await prisma.user.upsert({
    where: { username: 'aryanjand' },
    update: {},
    create: {
      username: 'aryanjand',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

  const brian = await prisma.user.upsert({
    where: { username: 'briankim' },
    update: {},

    create: {
      username: 'briankim',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

}

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
