import Layout from '../components/Layout.tsx'
import { type User } from '../@types/User.ts'

interface PetsProps {
  user: User
}

function Pets({ user }: PetsProps) {
  return (
    <Layout title='Pets' user={user}>
      <p>Teste</p>
    </Layout>
  )
}

export default Pets
