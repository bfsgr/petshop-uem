export interface JobFormData {
  id: number | null
  bath: true
  groom: boolean
  customer: { label: string; value: number }
  pet: { label: string; value: number }
  worker: { label: string; value: number }
  date: Date
}
