/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    console.log(
      'Skipping seed: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are not set.',
    );
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existing) {
    // Ensure the existing user has SUPER_ADMIN role
    if (existing.role !== 'SUPER_ADMIN') {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: 'SUPER_ADMIN' },
      });
      console.log(`User ${superAdminEmail} upgraded to SUPER_ADMIN`);
    } else {
      console.log('Super Admin already exists');
    }
  } else {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    console.log('Super Admin created:', {
      email: admin.email,
      role: admin.role,
    });
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
