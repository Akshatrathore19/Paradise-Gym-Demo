import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Trophy, Users, Clock, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

async function getPlans() {
  try {
    return await prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
      take: 3,
      include: { features: true },
    });
  } catch (e) {
    console.error("Database connection failed, using fallback data", e);
    return [];
  }
}

export default async function Home() {
  const plans = await getPlans();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        {/* Placeholder image, should be replaced with actual Cloudinary image in prod */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 uppercase drop-shadow-lg">
              Train Hard. <span className="text-primary">Stay Strong.</span><br />Be Your Best.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
              Welcome to Paradise Gym in Sitapura, Jaipur. The ultimate fitness destination with state-of-the-art equipment and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/plans">
                <Button size="lg" className="text-lg px-8 py-6 h-auto uppercase tracking-wide">
                  Join Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto uppercase tracking-wide bg-black/40 backdrop-blur border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Get Directions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">Why Choose Paradise Gym?</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Dumbbell, title: "Modern Equipment", desc: "Top-tier strength and cardio machines for optimal workouts." },
              { icon: Trophy, title: "Expert Trainers", desc: "Professional guidance to help you reach your fitness goals faster." },
              { icon: ShieldCheck, title: "Clean Environment", desc: "Hygienic, well-maintained space ensuring your safety and health." },
              { icon: Clock, title: "Flexible Timings", desc: "Open early morning to late evening to fit your busy schedule." },
              { icon: Users, title: "Community", desc: "Join a supportive community of fitness enthusiasts." },
              { icon: MapPin, title: "Prime Location", desc: "Conveniently located in the heart of Sitapura, Jaipur." },
            ].map((item, i) => (
              <Card key={i} className="bg-background border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/facilities">
              <Button size="lg" variant="outline" className="uppercase font-semibold tracking-wide">
                Explore All Facilities & Amenities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative rounded-lg overflow-hidden h-[400px] w-full">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold uppercase">About Paradise Gym</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground">
                Located in Sitapura, Jaipur, Paradise Gym is built for those who take their fitness seriously. 
                Founded by Siddharth Meena, our philosophy is simple: consistency, hard work, and the right guidance.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether your goal is weight loss, muscle gain, or overall wellness, we provide the 
                environment and equipment you need to succeed.
              </p>
              <Link href="/about">
                <Button variant="outline" className="mt-4">Read More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      <section className="py-20 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">Membership Plans</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Choose the plan that best fits your fitness journey. No hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative flex flex-col ${plan.isFeatured ? 'border-primary shadow-lg shadow-primary/20 scale-105 z-10' : 'border-border/50'}`}>
                {plan.isFeatured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold uppercase rounded-full tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 flex-1 flex flex-col pt-10">
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold">₹{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.durationDays} days</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/register?plan=${plan.id}`} className="mt-auto block">
                    <Button className="w-full" variant={plan.isFeatured ? "default" : "outline"}>
                      Choose Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            
            {plans.length === 0 && (
              <div className="col-span-3 text-center py-10 text-muted-foreground">
                Plans are currently being updated. Please check back later or contact us.
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/plans">
              <Button size="lg">View All Plans</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
