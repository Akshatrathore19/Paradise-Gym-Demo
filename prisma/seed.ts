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

  // Seed Facilities
  const facilities = [
    {
      title: "Olympic Free Weights & Heavy Lifting Arena",
      description: "Equipped with competition-spec Olympic barbells, rubber bumper plates, power racks, deadlift platforms, and dumbbells ranging up to 50kg for intense hypertrophy and powerlifting.",
      icon: "Dumbbell",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Advanced Cardio Theatre",
      description: "State-of-the-art interactive commercial treadmills, stair climbers, rowing machines, and assault bikes equipped with heart rate biometric tracking and HIIT programs.",
      icon: "Activity",
      imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "CrossFit & Functional Training Arena",
      description: "A wide high-density turf zone with heavy sled push tracks, battle ropes, plyometric jump boxes, gymnastics rings, medicine balls, and kettlebell racks.",
      icon: "Flame",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Pin & Plate-Loaded Machine Circuit",
      description: "Biomechanical isolateral machines targeting chest, back, shoulders, arms, and legs safely with smooth pulley action and premium ergonomic cushions.",
      icon: "Layers",
      imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Calisthenics & Mobility Studio",
      description: "Dedicated cushioned flooring area for bodyweight calisthenics, pull-up rigs, Swedish ladders, resistance bands, yoga mats, and recovery foam rollers.",
      icon: "Maximize2",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Steam Bath & Hydro-Therapy Showers",
      description: "Relaxing eucalyptus-infused steam chambers and temperature-controlled power showers designed for rapid post-workout muscle rejuvenation and stress relief.",
      icon: "Sparkles",
      imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Biometric Smart Lockers & Changing Lounges",
      description: "Keyless secure digital RFID lockers, full-length vanity mirrors, modern grooming stations, and hygienic private changing suites.",
      icon: "ShieldCheck",
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "Paradise Nutrition & Protein Shake Bar",
      description: "Refuel right after your workout with custom whey protein smoothies, BCAAs, pre-workout energizers, hydration electrolytes, and healthy meal preps.",
      icon: "Coffee",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
    {
      title: "1-on-1 Personal Training & Biometrics Lab",
      description: "Private consultations, comprehensive InBody body composition analysis (BMI, muscle mass, body fat percentage), and customized programming by certified master trainers.",
      icon: "Trophy",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
      isActive: true,
    },
  ]

  for (const facility of facilities) {
    const existing = await prisma.facility.findFirst({
      where: { title: facility.title },
    })

    if (!existing) {
      await prisma.facility.create({
        data: facility,
      })
      console.log(`Created facility: ${facility.title}`)
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
