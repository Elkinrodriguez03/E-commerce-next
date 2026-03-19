import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create demo customer
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ecommerce.com' },
    update: { role: 'CUSTOMER' },
    create: {
      email: 'demo@ecommerce.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('Created demo customer:', demoUser.email);

  // Create demo seller
  const demoSeller = await prisma.user.upsert({
    where: { email: 'seller@ecommerce.com' },
    update: { role: 'SELLER' },
    create: {
      email: 'seller@ecommerce.com',
      name: 'Demo Seller',
      password: hashedPassword,
      role: 'SELLER',
    },
  });
  console.log('Created demo seller:', demoSeller.email);

  // Create sample seller products
  const sampleProducts = [
    {
      sellerId: demoSeller.id,
      title: 'Handmade Leather Wallet',
      description:
        'Premium handcrafted leather wallet with multiple card slots and a coin pocket. Made from genuine full-grain leather.',
      price: 49.99,
      image: 'https://fakestoreapi.com/img/81Zt42iIapL._AC_SX679_.jpg',
      category: 'accessories',
      stock: 25,
      status: 'ACTIVE' as const,
    },
    {
      sellerId: demoSeller.id,
      title: 'Wireless Noise-Cancelling Headphones',
      description:
        'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
      price: 129.99,
      image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
      category: 'electronics',
      stock: 15,
      status: 'ACTIVE' as const,
    },
    {
      sellerId: demoSeller.id,
      title: 'Organic Cotton T-Shirt',
      description:
        'Soft organic cotton t-shirt available in multiple colors. Sustainably sourced and ethically manufactured.',
      price: 24.99,
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      category: "men's clothing",
      stock: 50,
      status: 'ACTIVE' as const,
    },
    {
      sellerId: demoSeller.id,
      title: 'Smart Home LED Bulb (Draft)',
      description:
        'WiFi-enabled smart LED bulb with 16 million colors and voice assistant support. Energy efficient.',
      price: 19.99,
      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
      category: 'electronics',
      stock: 0,
      status: 'DRAFT' as const,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: {
        id: `seed-${product.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
      },
      update: {},
      create: {
        id: `seed-${product.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
        ...product,
      },
    });
  }
  console.log(`Created ${sampleProducts.length} sample products`);

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
