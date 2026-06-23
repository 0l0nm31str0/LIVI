import { NextRequest, NextResponse } from 'next/server'
import { appointmentsDb } from '@/lib/mock-db'
import { compressData } from '@/lib/compression'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const doctorId = searchParams.get('doctor_id')
  const useCompression = searchParams.get('compress') === 'true'

  let data
  if (patientId) data = appointmentsDb.byPatient(patientId)
  else if (doctorId) data = appointmentsDb.byDoctor(doctorId)
  else data = appointmentsDb.getAll()

  const payload = { success: true, data }

  if (useCompression) {
    const jsonStr = JSON.stringify(payload)
    if (Buffer.byteLength(jsonStr, 'utf-8') > 1000) {
      const result = await compressData(payload)
      return NextResponse.json({
        success: true,
        data: result.compressed,
        meta: { compressed: true, compressionRatio: result.metadata.ratio },
      })
    }
  }

  return NextResponse.json(payload)
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
