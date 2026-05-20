import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    // Rate limit: max 3 OTPs per email per 10 minutes
    const recentCount = await prisma.emailOtp.count({
      where: {
        email,
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    })

    if (recentCount >= 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 10 minutes before trying again.' },
        { status: 429 }
      )
    }

    // Invalidate any existing unused OTPs for this email
    await prisma.emailOtp.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    const otp = generateOtp()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.emailOtp.create({
      data: { email, otp, expires },
    })

    await sendOtpEmail(email, otp)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    console.error('send-otp error:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Check your SMTP configuration.' }, { status: 500 })
  }
}
