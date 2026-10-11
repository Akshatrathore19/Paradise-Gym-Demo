import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, CreditCard, History, Settings, LogOut, Dumbbell } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Dumbbell },
    { name: "My Membership", href: "/dashboard/membership", icon: CreditCard },
    { name: "Payment History", href: "/dashboard/payments", icon: History },
    { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">Member Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={logoutAction}>
            <Button variant="destructive" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b bg-card flex justify-between items-center">
          <h2 className="font-bold uppercase tracking-tight">Member Portal</h2>
          {/* We would typically use a Sheet here for mobile menu, keeping simple for now */}
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">Logout</Button>
          </form>
        </div>
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
