import { NextRequest, NextResponse } from 'next/server'
import { usersDb } from '@/lib/mock-db'
import { MOCK_PASSWORDS } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } }, { status: 400 })
  }

  const user = usersDb.findByEmail(email)
  if (!user || MOCK_PASSWORDS[email] !== password) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  })
}
