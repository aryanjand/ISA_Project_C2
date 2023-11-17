import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummy = await prisma.user.upsert({
    where: { email: 'dummy@mail.com' },
    update: {},
    create: {
      email: 'dummy@mail.com',
      first_name: 'Dummy',
      last_name: 'User',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

  const oscar = await prisma.user.upsert({
    where: { email: 'oscar@gmail.com' },
    update: {},
    create: {
      email: 'oscar@mail.com',
      first_name: 'Oscar',
      last_name: 'Zhu',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

  const aryan = await prisma.user.upsert({
    where: { email: 'aryan@mail.com' },
    update: {},

    create: {
      email: 'aryan@mail.com',
      first_name: 'Aryan',
      last_name: 'Rand',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
    },
  });

  console.log({ dummy, oscar, aryan });
}

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
