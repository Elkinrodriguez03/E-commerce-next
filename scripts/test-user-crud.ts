import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testUserCRUD() {
  console.log('=== USER CRUD TEST ===\n');

  // =====================
  // CREATE
  // =====================
  console.log('--- CREATE ---');

  const hashedPassword = await bcrypt.hash('securePass123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: hashedPassword,
    },
  });
  console.log('Created user 1:', { id: user1.id, email: user1.email, name: user1.name });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
    },
  });
  console.log('Created user 2:', { id: user2.id, email: user2.email, name: user2.name });

  // =====================
  // READ - Get All
  // =====================
  console.log('\n--- READ ALL ---');

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  console.log(`Found ${allUsers.length} users:`);
  allUsers.forEach(u => console.log(`  - ${u.email} (${u.name})`));

  // =====================
  // READ - Get by ID
  // =====================
  console.log('\n--- READ BY ID ---');

  const foundUser = await prisma.user.findUnique({
    where: { id: user1.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  console.log('Found user by ID:', foundUser);

  // =====================
  // READ - Get by Email
  // =====================
  console.log('\n--- READ BY EMAIL ---');

  const foundByEmail = await prisma.user.findUnique({
    where: { email: 'bob@example.com' },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  console.log('Found user by email:', foundByEmail);

  // =====================
  // UPDATE
  // =====================
  console.log('\n--- UPDATE ---');

  const updatedUser = await prisma.user.update({
    where: { id: user1.id },
    data: {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
    },
    select: {
      id: true,
      email: true,
      name: true,
      updatedAt: true,
    },
  });
  console.log('Updated user:', updatedUser);

  // =====================
  // UPDATE - Password
  // =====================
  console.log('\n--- UPDATE PASSWORD ---');

  const newHash = await bcrypt.hash('newPassword456', 10);
  const updatedPassword = await prisma.user.update({
    where: { id: user1.id },
    data: { password: newHash },
    select: { id: true, email: true },
  });
  console.log('Updated password for:', updatedPassword.email);

  // Verify new password works
  const userWithPassword = await prisma.user.findUnique({
    where: { id: user1.id },
  });
  const passwordValid = await bcrypt.compare('newPassword456', userWithPassword!.password);
  console.log('New password valid:', passwordValid);

  // =====================
  // DELETE
  // =====================
  console.log('\n--- DELETE ---');

  await prisma.user.delete({
    where: { id: user2.id },
  });
  console.log('Deleted user:', user2.email);

  // Verify deletion
  const deletedUser = await prisma.user.findUnique({
    where: { id: user2.id },
  });
  console.log('User still exists:', deletedUser !== null);

  // =====================
  // CLEANUP
  // =====================
  console.log('\n--- CLEANUP ---');

  await prisma.user.delete({ where: { id: user1.id } });
  console.log('Cleaned up test users');

  // Final count
  const finalCount = await prisma.user.count();
  console.log(`Total users remaining: ${finalCount}`);

  console.log('\n=== ALL CRUD TESTS PASSED ===');
}

testUserCRUD()
  .catch(e => {
    console.error('Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
