import Layout from '../components/Layout.tsx'
import { type User } from '../@types/User.ts'

interface HomeProps {
  user: User
}

function Home({ user }: HomeProps) {
  return (
    <Layout title='Histórico' user={user}>
      <p>Teste</p>
    </Layout>
  )
}

export default Home
