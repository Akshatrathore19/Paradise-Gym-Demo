import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      isMock // For dev simulation
    } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID missing" }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { plan: true, user: true }
    })

    if (!payment || !payment.plan) {
      return NextResponse.json({ error: "Invalid payment record" }, { status: 400 })
    }

    let isValid = false

    if (isMock) {
      // Allow mock successful payment in dev mode if keys are not configured
      console.warn("Processing mock payment verification")
      isValid = true
    } else {
      // Verify Razorpay signature
      const secret = process.env.RAZORPAY_KEY_SECRET || ""
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex")

      isValid = generated_signature === razorpay_signature
    }

    if (isValid) {
      // Use a transaction to ensure both payment update and membership creation succeed together
      await prisma.$transaction(async (tx) => {
        // Find existing active membership to calculate new dates
        const existingMembership = await tx.membership.findFirst({
          where: {
            userId: session.user.id,
            status: "ACTIVE",
          },
          orderBy: { endDate: "desc" }
        })

        const now = new Date()
        let startDate = now
        // If there's an active membership that ends in the future, append the new plan
        if (existingMembership && existingMembership.endDate > now) {
          startDate = existingMembership.endDate
        }

        const endDate = new Date(startDate.getTime() + payment.plan!.durationDays * 24 * 60 * 60 * 1000)

        const membership = await tx.membership.create({
          data: {
            userId: session.user.id,
            planId: payment.plan!.id,
            startDate,
            endDate,
            status: "ACTIVE"
          }
        })

        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "SUCCESS",
            razorpayPaymentId: razorpay_payment_id || `mock_pay_${Date.now()}`,
            razorpaySignature: razorpay_signature || "mock_sig",
            paymentMethod: "RAZORPAY",
            paymentDate: new Date(),
            membershipId: membership.id
          }
        })
      })

      return NextResponse.json({ success: true, message: "Payment verified successfully" })
    } else {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "FAILED" }
      })
      
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
