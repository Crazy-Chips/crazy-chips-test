import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@crazychips.co.uk' },
    update: {},
    create: {
      email: 'admin@crazychips.co.uk',
      password: hashedPassword,
      name: 'Crazy Chips Admin',
    },
  })

  // Create menu items
  const menuItems = [
    {
      name: 'Classic Chips',
      description: 'Golden, crispy chips seasoned with sea salt. A classic done right.',
      price: 2.50,
      category: 'Chips',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
      featured: true,
      extras: [
        { id: 'e1', name: 'Extra Salt', price: 0 },
        { id: 'e2', name: 'Curry Sauce', price: 0.50 },
        { id: 'e3', name: 'Gravy', price: 0.75 },
      ],
    },
    {
      name: 'Large Chips',
      description: 'Extra portion of our legendary chips. Feed the hunger.',
      price: 3.50,
      category: 'Chips',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
      featured: false,
      extras: [
        { id: 'e1', name: 'Extra Salt', price: 0 },
        { id: 'e2', name: 'Curry Sauce', price: 0.50 },
        { id: 'e3', name: 'Gravy', price: 0.75 },
      ],
    },
    {
      name: 'Cheesy Chips',
      description: 'Crispy chips smothered in melted cheddar cheese. Pure comfort.',
      price: 3.50,
      category: 'Chips',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
      featured: true,
    },
    {
      name: 'Loaded Chips',
      description: 'Chips loaded with cheese, bacon bits, jalapeños, and sour cream.',
      price: 4.50,
      category: 'Chips',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
      featured: true,
    },
    {
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty, cheddar cheese, lettuce, tomato, pickles, and our secret sauce.',
      price: 5.50,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      featured: true,
      extras: [
        { id: 'b1', name: 'Extra Patty', price: 2.00 },
        { id: 'b2', name: 'Bacon', price: 1.00 },
        { id: 'b3', name: 'Jalapeños', price: 0.50 },
      ],
    },
    {
      name: 'Double Smash Burger',
      description: 'Two smashed beef patties, double cheese, caramelised onions, signature sauce.',
      price: 7.50,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      featured: true,
      extras: [
        { id: 'b2', name: 'Bacon', price: 1.00 },
        { id: 'b3', name: 'Jalapeños', price: 0.50 },
      ],
    },
    {
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken fillet, sriracha mayo, slaw, pickles, brioche bun.',
      price: 6.00,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
      featured: true,
      extras: [
        { id: 'b3', name: 'Jalapeños', price: 0.50 },
        { id: 'b4', name: 'Extra Mayo', price: 0.25 },
      ],
    },
    {
      name: 'Plant-Based Burger',
      description: 'Our house plant patty, vegan cheese, lettuce, tomato, vegan mayo.',
      price: 6.50,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=800&q=80',
      featured: false,
    },
    {
      name: 'Onion Rings',
      description: 'Thick-cut onion rings in a crispy golden batter. 6 pieces.',
      price: 2.50,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
      featured: false,
    },
    {
      name: 'Coleslaw',
      description: 'Creamy homemade coleslaw with a hint of mustard.',
      price: 1.50,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&q=80',
      featured: false,
    },
    {
      name: 'Gravy',
      description: 'Rich, thick beef gravy. Perfect for dipping.',
      price: 1.00,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
      featured: false,
    },
    {
      name: 'Chicken Strips',
      description: 'Crispy buttermilk chicken strips with dipping sauce. 4 pieces.',
      price: 4.50,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80',
      featured: true,
    },
    {
      name: 'Coca-Cola',
      description: 'Ice cold Coca-Cola. 330ml can.',
      price: 1.50,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80',
      featured: false,
    },
    {
      name: 'Fanta Orange',
      description: 'Fizzy Fanta Orange. 330ml can.',
      price: 1.50,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=800&q=80',
      featured: false,
    },
    {
      name: 'Still Water',
      description: 'Evian still water. 500ml.',
      price: 1.00,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
      featured: false,
    },
    {
      name: 'Milkshake',
      description: 'Thick hand-spun milkshake. Choose from vanilla, chocolate, or strawberry.',
      price: 3.00,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
      featured: false,
    },
    {
      name: 'Chips & Burger Combo',
      description: 'Classic Cheeseburger + Large Chips + any regular drink. Great value.',
      price: 7.50,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      featured: true,
    },
    {
      name: 'Family Box',
      description: '4 burgers, 4 large chips, 4 drinks, and 2 sides. Feed the whole crew.',
      price: 18.00,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80',
      featured: false,
    },
    {
      name: 'Crazy Deal of the Day',
      description: "Today's special deal — ask in store or check our socials. Changes daily.",
      price: 4.99,
      category: 'Deals',
      imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80',
      featured: true,
    },
    {
      name: 'Student Deal',
      description: 'Chips + Chicken Strips + drink for students. Show valid student ID.',
      price: 5.99,
      category: 'Deals',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80',
      featured: false,
    },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: (await prisma.menuItem.findFirst({ where: { name: item.name } }))?.id || 'nonexistent' },
      update: {},
      create: item,
    })
  }

  // Create promo codes
  await prisma.promoCode.upsert({
    where: { code: 'CRAZY10' },
    update: {},
    create: {
      code: 'CRAZY10',
      discountPercent: 10,
      active: true,
    },
  })

  await prisma.promoCode.upsert({
    where: { code: 'NEWCUSTOMER' },
    update: {},
    create: {
      code: 'NEWCUSTOMER',
      discountPercent: 15,
      active: true,
      usageLimit: 100,
    },
  })

  console.log('Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
