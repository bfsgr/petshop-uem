export interface JobFormData {
  id: number | null
  bath: true
  groom: boolean
  customer: { label: string; value: number }
  pet: { label: string; value: number }
  worker: { label: string; value: number }
  date: Date
  accepted_at: string | null
  rejected_at: string | null
  preparing_at: string | null
  bath_started_at: string | null
  groom_started_at: string | null
  finished_at: string | null
  notified_at: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}
