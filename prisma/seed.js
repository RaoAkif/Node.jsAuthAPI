const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123456', salt)
    // Create users
    const akif = await prisma.user.upsert({
      where: { username: 'raoakif' },
      update: {},
      create: {
        username: 'raoakif',
        password: 'hashed_password',
      },
    });

    const umman = await prisma.user.upsert({
      where: { username: 'ummanwaseem' },
      update: {},
      create: {
        username: 'ummanwaseem',
        password: 'hashed_password',
      },
    });

    // Create products and images
    const product1 = await prisma.product.create({
      data: {
        name: 'Product 1',
        actual_price: '100',
        discounted_price: '80',
        category: 'CATEGORY_A',
        description: 'Description for Product 1',
        quantity: 10,
        size: 'MEDIUM',
        color: 'RED',
        images: {
          create: [
            {
              title: 'Image 1',
              src: 'image1.jpg',
            },
            {
              title: 'Image 2',
              src: 'image2.jpg',
            },
          ],
        },
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'Product 2',
        actual_price: '200',
        discounted_price: '150',
        category: 'CATEGORY_B',
        description: 'Description for Product 2',
        quantity: 5,
        size: 'LARGE',
        color: 'BLUE',
        images: {
          create: [
            {
              title: 'Image 3',
              src: 'image3.jpg',
            },
            {
              title: 'Image 4',
              src: 'image4.jpg',
            },
          ],
        },
      },
    });

    console.log({ akif, umman, product1, product2 });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
