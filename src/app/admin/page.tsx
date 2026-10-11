import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CreditCard, DollarSign } from "lucide-react"

export default async function AdminDashboardPage() {
  const [
    totalMembers,
    activeMembers,
    totalRevenue,
    pendingEnquiries,
    recentPayments
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.membership.count({ where: { status: "ACTIVE", endDate: { gte: new Date() } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.enquiry.count({ where: { isResolved: false } }),
    prisma.payment.findMany({
      where: { status: "SUCCESS" },
      orderBy: { paymentDate: "desc" },
      take: 5,
      include: { user: true, plan: true }
    })
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Gym statistics and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue._sum.amount?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime successful payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">Currently active subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Enquiries</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEnquiries}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{payment.user.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.plan?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.paymentDate?.toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">No recent payments.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
