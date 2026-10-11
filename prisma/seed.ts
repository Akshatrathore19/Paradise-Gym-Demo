import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create Gym Settings
  const existingSettings = await prisma.gymSettings.findUnique({
    where: { id: 'singleton' },
  })

  if (!existingSettings) {
    await prisma.gymSettings.create({
      data: {
        id: 'singleton',
        gymName: 'Paradise Gym',
        ownerName: 'Siddharth Meena',
        address: 'Sitapura, Jaipur, Rajasthan, India',
        phone: '919876543210',
        heroHeading: 'Train Hard. Stay Strong. Be Your Best.',
        heroDescription: 'Join the most premium fitness center in Sitapura, Jaipur.',
      },
    })
    console.log('Created gym settings.')
  }

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@paradisegym.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'SecurePassword123!'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await prisma.user.create({
      data: {
        name: 'Gym Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log(`Created admin user: ${adminEmail}`)
  }

  const plans = [
    { name: 'Monthly', durationDays: 30, price: 1500, features: ['Cardio', 'Strength Training', 'Free Weights'], isFeatured: false },
    { name: 'Quarterly', durationDays: 90, price: 3500, features: ['Cardio', 'Strength Training', 'Free Weights', 'Diet Plan'], isFeatured: true },
    { name: 'Half-Yearly', durationDays: 180, price: 6000, features: ['Cardio', 'Strength Training', 'Free Weights', 'Diet Plan', 'Locker'], isFeatured: false },
    { name: 'Yearly', durationDays: 365, price: 9999, features: ['All Facilities', 'Personal Training Discount', 'Locker', 'Merchandise'], isFeatured: true },
  ]

  for (const plan of plans) {
    const existingPlan = await prisma.membershipPlan.findFirst({
      where: { name: plan.name },
    })

    if (!existingPlan) {
      await prisma.membershipPlan.create({
        data: {
          name: plan.name,
          durationDays: plan.durationDays,
          price: plan.price,
          isFeatured: plan.isFeatured,
          features: {
            create: plan.features.map(f => ({ name: f }))
          }
        }
      })
      console.log(`Created plan: ${plan.name}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
