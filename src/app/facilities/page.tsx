import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { 
  Dumbbell, 
  Activity, 
  Flame, 
  Layers, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Coffee, 
  Trophy, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Wind,
  Sparkle,
  Compass
} from "lucide-react"

export const metadata = {
  title: "Facilities | Paradise Gym Sitapura",
  description: "Explore the 10,000+ sq. ft. world-class fitness facilities at Paradise Gym, Sitapura, Jaipur. Free weights, cardio theatre, CrossFit arena, steam rooms, and more.",
}

const FALLBACK_FACILITIES = [
  {
    id: "f-1",
    title: "Olympic Free Weights & Heavy Lifting Arena",
    description: "Equipped with competition-spec Olympic barbells, rubber bumper plates, power racks, deadlift platforms, and dumbbells ranging up to 50kg for intense hypertrophy and strength training.",
    icon: "Dumbbell",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
    features: ["Dumbbells up to 50kg", "Olympic Barbells & Bumpers", "3 Power Racks & Deadlift Jacks", "Adjustable Benches"],
    category: "Strength",
  },
  {
    id: "f-2",
    title: "Advanced Cardio Theatre",
    description: "State-of-the-art interactive commercial treadmills, stair climbers, rowing machines, and assault bikes equipped with heart rate biometric tracking and HIIT programs.",
    icon: "Activity",
    imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop",
    features: ["Interactive Commercial Treadmills", "Stair Climbers & Rowers", "Assault & Spin Bikes", "Biometric HR Monitors"],
    category: "Cardio",
  },
  {
    id: "f-3",
    title: "CrossFit & Functional Training Arena",
    description: "A wide high-density turf zone with heavy sled push tracks, battle ropes, plyometric jump boxes, gymnastics rings, medicine balls, and kettlebell racks.",
    icon: "Flame",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    features: ["Sprint & Sled Turf Track", "Battle Ropes & Plyo Boxes", "Competition Kettlebells", "Gymnastic Ring Rigs"],
    category: "Functional",
  },
  {
    id: "f-4",
    title: "Pin & Plate-Loaded Machine Circuit",
    description: "Biomechanical isolateral machines targeting chest, back, shoulders, arms, and legs safely with smooth pulley action and premium ergonomic cushions.",
    icon: "Layers",
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
    features: ["Dual Cable Cross Crossovers", "Hack Squats & Leg Press", "Iso-Lateral Lat Pulldown", "Chest & Shoulder Press"],
    category: "Machines",
  },
  {
    id: "f-5",
    title: "Calisthenics & Mobility Studio",
    description: "Dedicated cushioned flooring area for bodyweight calisthenics, pull-up rigs, Swedish ladders, resistance bands, yoga mats, and recovery foam rollers.",
    icon: "Maximize2",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    features: ["Multi-grip Pull-up Station", "Swedish Wall Bars", "Trigger Point Foam Rollers", "Mobility Stretch Mats"],
    category: "Mobility",
  },
  {
    id: "f-6",
    title: "Steam Bath & Hydro-Therapy Showers",
    description: "Relaxing eucalyptus-infused steam chambers and temperature-controlled power showers designed for rapid post-workout muscle rejuvenation and stress relief.",
    icon: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop",
    features: ["Eucalyptus Steam Sauna", "High-Pressure Showers", "Hygienic Sanitized Suites", "Rapid Muscle Recovery"],
    category: "Wellness",
  },
  {
    id: "f-7",
    title: "Biometric Smart Lockers & Changing Lounges",
    description: "Keyless secure digital RFID lockers, full-length vanity mirrors, modern grooming stations, and hygienic private changing suites.",
    icon: "ShieldCheck",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
    features: ["RFID Digital Lockers", "Vanity & Hair Grooming", "Air Conditioned Lounges", "Individual Private Stalls"],
    category: "Amenities",
  },
  {
    id: "f-8",
    title: "Paradise Nutrition & Protein Shake Bar",
    description: "Refuel right after your workout with custom whey protein smoothies, BCAAs, pre-workout energizers, hydration electrolytes, and healthy meal preps.",
    icon: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    features: ["Fresh Whey Protein Shakes", "Pre-workout Fuel Shots", "Electrolytes & Hydration", "Healthy Snack Nutrition"],
    category: "Nutrition",
  },
  {
    id: "f-9",
    title: "1-on-1 Personal Training & Biometrics Lab",
    description: "Private consultations, comprehensive InBody body composition analysis (BMI, muscle mass, body fat percentage), and customized programming by certified master trainers.",
    icon: "Trophy",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
    features: ["InBody Body Composition Scan", "Tailored Workout Routines", "Posture & Movement Screen", "Certified Master Coaches"],
    category: "Coaching",
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dumbbell,
  Activity,
  Flame,
  Layers,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Coffee,
  Trophy,
}

async function getFacilities() {
  try {
    const dbFacilities = await prisma.facility.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    })
    
    if (dbFacilities.length > 0) {
      return dbFacilities.map((f, idx) => {
        const fallback = FALLBACK_FACILITIES.find(
          (fb) => fb.title.toLowerCase().includes(f.title.toLowerCase()) || f.title.toLowerCase().includes(fb.title.toLowerCase())
        ) || FALLBACK_FACILITIES[idx % FALLBACK_FACILITIES.length]

        return {
          id: f.id,
          title: f.title,
          description: f.description || fallback.description,
          icon: f.icon || fallback.icon,
          imageUrl: f.imageUrl || fallback.imageUrl,
          features: fallback.features,
          category: fallback.category,
        }
      })
    }
  } catch (error) {
    console.error("Database query failed, using fallback facilities", error)
  }

  return FALLBACK_FACILITIES
}

export default async function FacilitiesPage() {
  const facilities = await getFacilities()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header Section */}
      <section className="relative py-24 bg-gradient-to-b from-card via-card to-background border-b overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,88,12,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkle className="w-3.5 h-3.5 fill-primary" />
            World-Class Fitness Infrastructure
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
            Engineered For <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">Peak Performance</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Step into 10,000+ sq. ft. of elite training equipment, dedicated athletic zones, and luxury recovery spaces in Sitapura, Jaipur.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2 uppercase font-semibold tracking-wide">
                Book a Free Tour
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline" className="uppercase font-semibold tracking-wide">
                View Membership Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="border-b bg-card/60 backdrop-blur py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-background/50 border border-border/60">
              <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">10,000+</div>
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Sq. Ft. Floor Area</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/60">
              <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">60+</div>
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Biomechanical Machines</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/60">
              <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">100%</div>
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Climate Controlled AC</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/60">
              <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">24/7</div>
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">CCTV & Smart Lockers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-3">
              Explore Our <span className="text-primary">Zones & Amenities</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need for strength, hypertrophy, stamina, functional athleticism, and post-workout rejuvenation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => {
              const IconComponent = (facility.icon && iconMap[facility.icon]) || Dumbbell

              return (
                <Card 
                  key={facility.id} 
                  className="group overflow-hidden border-border/60 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col bg-card"
                >
                  {/* Image Container with Badge and Overlay */}
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${facility.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Category Tag */}
                    {facility.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur border border-white/10 uppercase tracking-wide">
                          {facility.category}
                        </span>
                      </div>
                    )}

                    {/* Floating Icon */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-white">
                      <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {facility.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {facility.description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    {facility.features && facility.features.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                          Highlights
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                          {facility.features.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hygiene, Safety & Standards Section */}
      <section className="py-16 bg-card border-t border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/60">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Sanitized Every 2 Hours</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every machine, barbell, and bench is wiped down with hospital-grade disinfectant throughout the day.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/60">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Fresh Air Circulation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Industrial HVAC ventilation systems ensuring constant oxygen circulation and cool temperatures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/60">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Trainer On Duty Always</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Floor trainers always present to correct posture, spot heavy lifts, and ensure safe workout practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/15 via-primary/5 to-background border-t">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Ready to Experience It in Person?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
            Visit Paradise Gym in Sitapura, Jaipur for a guided facility walkthrough, body composition test, and workout trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto uppercase font-bold tracking-wide">
                Get Directions & Visit
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline" className="w-full sm:w-auto uppercase font-bold tracking-wide">
                Explore Membership Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
