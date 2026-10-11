import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, CreditCard, Activity } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) return null

  // Fetch active membership
  const activeMembership = await prisma.membership.findFirst({
    where: { 
      userId: session.user.id,
      status: "ACTIVE",
      endDate: { gte: new Date() }
    },
    include: { plan: true },
    orderBy: { endDate: "desc" }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Manage your gym membership and track your progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Membership Status Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Current Membership Status
            </CardTitle>
            <CardDescription>Your active plan details</CardDescription>
          </CardHeader>
          <CardContent>
            {activeMembership ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold text-lg">{activeMembership.plan.name} Plan</p>
                    <p className="text-sm text-muted-foreground">Active until {new Date(activeMembership.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    ACTIVE
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(activeMembership.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                    <p className="font-medium text-xl text-primary">
                      {Math.ceil((activeMembership.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Link href="/dashboard/membership">
                    <Button>Renew Plan</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">No Active Membership</p>
                  <p className="text-sm text-muted-foreground mt-1">You don't have an active gym membership at the moment.</p>
                </div>
                <Link href="/plans">
                  <Button className="mt-2">Purchase a Plan</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/membership" className="block">
              <Button variant="outline" className="w-full justify-start">View Membership Details</Button>
            </Link>
            <Link href="/dashboard/payments" className="block">
              <Button variant="outline" className="w-full justify-start">View Payment History</Button>
            </Link>
            <Link href="/dashboard/profile" className="block">
              <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
            </Link>
            <Link href="/contact" className="block">
              <Button variant="outline" className="w-full justify-start">Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
