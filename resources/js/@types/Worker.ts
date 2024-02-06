export interface Worker {
  id: number
  name: string
  email: string
  phone: string
  type: string
  status: string
  email_verified_at: string
  created_at: string
  updated_at: string
  subclass: {
    id: number
    role: 'employee' | 'manager'
    hired_at: string
    fired_at: string | null
    created_at: string
    updated_at: string
  }
}
