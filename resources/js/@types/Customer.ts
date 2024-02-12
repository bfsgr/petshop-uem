export interface Customer {
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
    cpf: string
    birthdate: Date
    cep: string
    street: string
    number: string
    district: string
    city: string
    state: string
    address_info: string
    created_at: string
    updated_at: string
  }
}
