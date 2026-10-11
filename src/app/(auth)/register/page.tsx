"use client"

import { useActionState, useEffect } from "react"
import { registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Dumbbell, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, { success: false, message: "" })
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        // If there is a plan attached in the URL, pass it to the login page so they can continue purchase
        router.push(`/login${planId ? `?plan=${planId}` : ''}`)
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router, planId])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg bg-card border-border/50">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold uppercase tracking-tight">Join Paradise Gym</CardTitle>
          <CardDescription>
            Create an account to manage your membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/login${planId ? `?plan=${planId}` : ''}`} className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
