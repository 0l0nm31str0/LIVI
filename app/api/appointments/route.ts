import { NextRequest, NextResponse } from 'next/server'
import { appointmentsDb } from '@/lib/mock-db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const doctorId = searchParams.get('doctor_id')

  let data
  if (patientId) data = appointmentsDb.byPatient(patientId)
  else if (doctorId) data = appointmentsDb.byDoctor(doctorId)
  else data = appointmentsDb.getAll()

  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const apt = appointmentsDb.create({
    patient_id: body.patient_id,
    doctor_id: body.doctor_id,
    appointment_date: body.appointment_date,
    status: 'scheduled',
    zoom_link: `https://zoom.us/j/${Math.floor(Math.random() * 999999999)}`,
    notes: body.notes ?? '',
  })
  return NextResponse.json({ success: true, data: apt }, { status: 201 })
}
