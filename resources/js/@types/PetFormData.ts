export interface PetFormData {
  id: number | null
  name: string
  breed: string
  birthdate: Date
  history: string | null
  type: { label: string; value: string }
  customer: { label: string; value: number }
}
