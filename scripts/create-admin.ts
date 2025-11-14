import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@test.com';
  const password = 'admin123';
  const name = 'Admin User';

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Delete existing user if exists
    await prisma.user.deleteMany({
      where: { email },
    });

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', user.role);
    console.log('\nYou can now log in at http://localhost:3000/auth/signin');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
