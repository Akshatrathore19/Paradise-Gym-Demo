import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Calendar, CheckCircle2 } from "lucide-react"
import { CheckoutButton } from "@/components/checkout-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MembershipPage() {
  const session = await auth()
  if (!session?.user) return null

  const activeMembership = await prisma.membership.findFirst({
    where: { 
      userId: session.user.id,
      status: "ACTIVE",
      endDate: { gte: new Date() }
    },
    include: { 
      plan: {
        include: { features: true }
      }
    },
    orderBy: { endDate: "desc" }
  })

  const allPlans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { durationDays: "asc" },
    include: { features: true }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Membership</h1>
        <p className="text-muted-foreground">View your current plan and renewal options.</p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="renew">Renew / Upgrade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {activeMembership ? (
            <Card>
              <CardHeader>
                <CardTitle>Active Membership</CardTitle>
                <CardDescription>Your currently active subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 border-b pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{activeMembership.plan.name} Plan</h3>
                    <p className="text-muted-foreground mt-1">{activeMembership.plan.description}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                      ACTIVE
                    </div>
                    <p className="text-2xl font-bold">₹{activeMembership.plan.price}</p>
                    <p className="text-muted-foreground text-sm">per {activeMembership.plan.durationDays} days</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Duration Details
                    </h4>
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{new Date(activeMembership.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3 border-border">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">{new Date(activeMembership.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Included Features
                    </h4>
                    <ul className="space-y-2">
                      {activeMembership.plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <p className="text-lg font-medium">You don't have an active membership.</p>
                <p className="text-muted-foreground">Switch to the Renew/Upgrade tab to purchase a plan.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="renew">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlans.map((plan) => (
              <Card key={plan.id} className={`relative flex flex-col ${plan.isFeatured ? 'border-primary' : 'border-border/50'}`}>
                {plan.isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.durationDays} days access</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold">₹{plan.price}</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{feature.name}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-sm text-muted-foreground italic">
                        + {plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-auto">
                    <CheckoutButton 
                      planId={plan.id} 
                      amount={plan.price} 
                      planName={plan.name}
                      userName={session.user.name}
                      userEmail={session.user.email}
                      userPhone={session.user.phone || undefined} // Ideally pass phone if available
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
