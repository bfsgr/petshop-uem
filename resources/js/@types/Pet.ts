import { type Customer } from './Customer.ts'

export interface Pet {
  id: number
  name: string
  breed: string
  type: 'cat' | 'dog'
  birthdate: string
  history: string
  status: boolean
  user: Customer
}
