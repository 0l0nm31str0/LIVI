import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/config'

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({
      success: true,
      data: { url: '/patient/billing?demo=true' },
    })
  }

  try {
    const { customerId } = await req.json()
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'customerId required' }, { status: 400 })
    }

    const { getStripe } = await import('@/lib/stripe/client')
    const stripe = getStripe()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/patient/billing`,
    })

    return NextResponse.json({ success: true, data: { url: session.url } })
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
