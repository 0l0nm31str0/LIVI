import { NextRequest, NextResponse } from 'next/server'
import { prescriptionsDb, medicalHistoryDb, medicationsDb } from '@/lib/mock-db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const doctorId = searchParams.get('doctor_id')
  const pharmacyId = searchParams.get('pharmacy_id')

  let data
  if (patientId) data = prescriptionsDb.byPatient(patientId)
  else if (doctorId) data = prescriptionsDb.byDoctor(doctorId)
  else if (pharmacyId) data = prescriptionsDb.byPharmacy(pharmacyId)
  else data = prescriptionsDb.getAll()

  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const history = medicalHistoryDb.byPatient(body.patient_id)
  if (history) {
    const medication = medicationsDb.findById(body.medication_id)
    if (medication) {
      const allergyKeywords = history.allergies.toLowerCase().split(/[\s,()]+/)
      const medIngredient = medication.active_ingredient.toLowerCase()
      const hasConflict = allergyKeywords.some(
        (kw) => kw.length > 3 && medIngredient.includes(kw)
      )
      if (hasConflict) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'ALLERGY_CONFLICT',
              message: `Patient may be allergic to ${medication.name}. Check allergies: ${history.allergies}`,
            },
          },
          { status: 422 }
        )
      }
    }
  }

  const rx = prescriptionsDb.create({
    patient_id: body.patient_id,
    doctor_id: body.doctor_id,
    appointment_id: body.appointment_id ?? '',
    medication_id: body.medication_id,
    dosage: body.dosage,
    quantity: body.quantity,
    refills: body.refills ?? 0,
    special_instructions: body.special_instructions ?? '',
    status: 'pending',
    pharmacy_id: body.pharmacy_id ?? null,
    prescribed_date: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, data: rx }, { status: 201 })
}
