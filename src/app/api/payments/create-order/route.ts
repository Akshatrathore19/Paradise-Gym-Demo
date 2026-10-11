import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Convert price to paise (smallest currency unit for INR)
    const amount = plan.price * 100

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${session.user.id}`,
    }

    // In development without real keys, mock the order creation if keys are missing
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys missing, simulating order creation for dev purposes.")
      const mockOrderId = `order_mock_${Date.now()}`
      
      const payment = await prisma.payment.create({
        data: {
          userId: session.user.id,
          planId: plan.id,
          amount: plan.price,
          currency: "INR",
          status: "CREATED",
          razorpayOrderId: mockOrderId,
        }
      })
      
      return NextResponse.json({
        id: mockOrderId,
        amount,
        currency: "INR",
        paymentId: payment.id,
        isMock: true // indicate to frontend to simulate payment
      })
    }

    const order = await razorpay.orders.create(options)

    // Save payment record in DB with CREATED status
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        amount: plan.price,
        currency: "INR",
        status: "CREATED",
        razorpayOrderId: order.id,
      }
    })

    return NextResponse.json({ ...order, paymentId: payment.id })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
