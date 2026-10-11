"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  planId: string
  amount: number
  planName: string
  userName: string | null | undefined
  userEmail: string | null | undefined
  userPhone: string | null | undefined
}

export function CheckoutButton({ planId, amount, planName, userName, userEmail, userPhone }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      if (data.isMock) {
        // Handle mock payment in development
        toast.info("Simulating payment in development mode...")
        await verifyPayment({
          razorpay_order_id: data.id,
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_signature: "mock_signature",
        }, data.paymentId, true)
        return
      }

      const resScript = await loadRazorpayScript()

      if (!resScript) {
        toast.error("Razorpay SDK failed to load. Are you online?")
        setIsLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: data.currency,
        name: "Paradise Gym",
        description: `Purchase ${planName} Plan`,
        order_id: data.id,
        handler: async function (response: any) {
          await verifyPayment(response, data.paymentId, false)
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: userPhone || "",
        },
        theme: {
          color: "#e11d48", // Primary color (red-600 approx)
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed. Please try again.")
        setIsLoading(false)
      })
      rzp.open()

    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout")
      setIsLoading(false)
    }
  }

  const verifyPayment = async (paymentResponse: any, paymentId: string, isMock: boolean) => {
    toast.loading("Verifying payment...")
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentResponse,
          paymentId,
          isMock,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.dismiss()
        toast.success("Payment successful! Membership activated.")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.dismiss()
        toast.error(data.error || "Payment verification failed")
        setIsLoading(false)
      }
    } catch (error) {
      toast.dismiss()
      toast.error("An error occurred while verifying payment")
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} className="w-full">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pay Securely with Razorpay"}
    </Button>
  )
}
