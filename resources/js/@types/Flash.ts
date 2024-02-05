export interface Flash {
  message: string | null
  status: 'error' | 'info' | 'warning' | 'success' | 'loading' | null
}
