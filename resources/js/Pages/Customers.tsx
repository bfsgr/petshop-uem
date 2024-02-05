import Layout from '../components/Layout.tsx'
import { type User } from '../@types/User.ts'

interface CustomersProps {
  user: User
}

function Customers({ user }: CustomersProps) {
  return (
    <Layout title='Clientes' user={user}>
      <p>Teste</p>
    </Layout>
  )
}

export default Customers
