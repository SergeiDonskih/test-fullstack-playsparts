import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL']! }),
});

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.$executeRaw`
    INSERT INTO app_users (email, password_hash, role)
    VALUES
      (${'user@test.com'}, ${passwordHash}, ${'user'}),
      (${'admin@test.com'}, ${passwordHash}, ${'admin'})
    ON CONFLICT (email) DO NOTHING
  `;
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
