import Layout from '../components/Layout.tsx'

interface HomeProps {
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

function Home({ user }: HomeProps) {
  return (
    <Layout title='Histórico' user={user}>
      <p>Teste</p>
    </Layout>
  )
}

export default Home
