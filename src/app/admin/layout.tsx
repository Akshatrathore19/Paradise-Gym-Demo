import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  CreditCard, 
  History, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  MessageSquare,
  Image as ImageIcon,
  HelpCircle,
  Activity
} from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Plans", href: "/admin/plans", icon: CreditCard },
    { name: "Payments", href: "/admin/payments", icon: History },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Trainers", href: "/admin/trainers", icon: Activity },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card h-screen sticky top-0 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold uppercase tracking-tight text-primary">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Paradise Gym Management</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 pb-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm">
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t bg-card sticky bottom-0">
          <form action={logoutAction}>
            <Button variant="destructive" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b bg-card flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-bold uppercase tracking-tight text-primary">Admin Panel</h2>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">Logout</Button>
          </form>
        </div>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
