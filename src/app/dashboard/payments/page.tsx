import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default async function PaymentsPage() {
  const session = await auth()
  if (!session?.user) return null

  const payments = await prisma.payment.findMany({
    where: { 
      userId: session.user.id,
      status: "SUCCESS"
    },
    include: { plan: true },
    orderBy: { paymentDate: "desc" }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">View your past transactions and download receipts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>A list of your successful payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{payment.plan?.name || 'Unknown Plan'}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {payment.razorpayPaymentId || payment.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Using a mock button for download since PDF generation is out of scope for frontend rendering, 
                          but typically this would link to an API route that returns a PDF */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download Receipt">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No payment history found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
