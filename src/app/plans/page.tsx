import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Membership Plans | Paradise Gym",
  description: "View our flexible and affordable membership plans. Choose the one that fits your fitness goals.",
}

async function getPlans() {
  try {
    return await prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
      include: { features: true }
    });
  } catch (e) {
    console.error("Failed to fetch plans", e)
    return []
  }
}

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="bg-muted py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter">Membership <span className="text-primary">Plans</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Choose the plan that best fits your fitness journey.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col rounded-none border-2 ${plan.isFeatured ? 'border-primary' : 'border-border'}`}>
                {plan.isFeatured && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-2xl uppercase tracking-tight">{plan.name}</CardTitle>
                  <CardDescription>{plan.durationDays} Days Access</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold tracking-tighter">₹{plan.price}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
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
              <div className="col-span-full text-center py-20 text-muted-foreground bg-card rounded-lg border">
                Plans are currently being updated. Please check back later or contact us.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold uppercase mb-4">Not sure which plan to choose?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Visit our gym in Sitapura, Jaipur for a quick tour and let our experts help you decide the best plan for your goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="uppercase tracking-wider">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
