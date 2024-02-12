export interface CustomerFormData {
  id: number | null
  name: string
  email: string
  phone: string
  cpf: string
  birthdate: Date
  cep: string
  street: string
  number: string
  district: string
  city: string
  state: string
  address_info: string | null
}
