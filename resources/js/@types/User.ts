export interface User {
  id: number
  name: string
  email: string
  type: 'App\\Models\\Customer' | 'App\\Models\\Worker'
  isAdmin: boolean
}
