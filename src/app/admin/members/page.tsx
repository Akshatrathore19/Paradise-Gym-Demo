import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    where: { role: "MEMBER" },
    include: {
      memberships: {
        where: { status: "ACTIVE", endDate: { gte: new Date() } },
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage registered gym members.</p>
        </div>
        <Button>Add Member Manually</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Active Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const activeMembership = member.memberships[0]
                const isActive = !!activeMembership

                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name || "N/A"}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone || "N/A"}</TableCell>
                    <TableCell>
                      {isActive ? activeMembership.plan.name : "None"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
