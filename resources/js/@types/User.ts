export interface User {
  id: number
  name: string
  email: string
  type: 'customer' | 'worker'
  isAdmin: boolean
}
