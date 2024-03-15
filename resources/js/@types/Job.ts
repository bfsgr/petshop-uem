import { type Pet } from './Pet.ts'
import { type Worker } from './Worker.ts'

export interface Job {
  id: number
  bath: boolean
  groom: boolean
  date: string
  pet_id: number
  worker_id: number
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
  pet: Pet
  worker: Worker
}
