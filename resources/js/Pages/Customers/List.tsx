import Layout from '../../components/Layout.tsx'
import { type User } from '../../@types/User.ts'
import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Edit2, Search } from 'lucide-react'
import Table from 'rc-table'
import { Link as RouterLink } from '@inertiajs/react'
import htmr from 'htmr'
import { type Pagination } from '../../@types/Pagination.ts'
import { type Customer } from '../../@types/Customer.ts'
import { useEffect } from 'react'
import { type Flash } from '../../@types/Flash.ts'
import { formatPhone } from '../../utils/phone.ts'
import { formatCpfPartials } from '../../utils/cpf.ts'

interface CustomersProps {
  user: User
  customers: Pagination<Customer>
  flash: Flash
}

function Customers({ user, customers, flash }: CustomersProps) {
  const toast = useToast()

  useEffect(() => {
    if (flash.status !== null) {
      toast({
        title: flash.message,
        status: flash.status,
        isClosable: true,
        duration: flash.status === 'success' ? 5000 : null,
      })
    }
  }, [flash, toast])

  function handleEdit(customer: Customer) {
    console.log('Edit', customer)
  }

  const headers = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
    },
    {
      title: 'Celular',
      dataIndex: 'phone',
    },
    {
      title: 'Situação',
      dataIndex: 'status',
    },
    {
      title: '',
      dataIndex: 'action',
    },
  ]

  const rows = customers.data.map((customer) => ({
    key: customer.id,
    id: customer.id,
    name: customer.name,
    cpf: formatCpfPartials(customer.subclass.cpf),
    phone: formatPhone(customer.phone),
    fired_at: customer.status,
    action: (
      <IconButton
        size='sm'
        aria-label='Editar'
        icon={<Edit2 size='16px' />}
        onClick={() => {
          handleEdit(customer)
        }}
      />
    ),
  }))

  return (
    <Layout title='Clientes' user={user}>
      <Stack spacing={6}>
        <HStack>
          <InputGroup>
            <InputLeftElement color='gray.500'>
              <Search width='16px' />
            </InputLeftElement>
            <Input placeholder='Pesquise' />
          </InputGroup>
          <Link></Link>
          <Button as={RouterLink} flexShrink={0} href='/clientes/cadastro'>
            Cadastrar cliente
          </Button>
        </HStack>
        <Table
          className='custom-table'
          emptyText='Sem dados'
          columns={headers}
          data={rows}
        />
        <HStack
          px='px'
          py={1}
          w='full'
          justify='space-between'
          color='gray.700'
        >
          <Text>
            Exibindo de {customers.data.length} de {customers.total}
          </Text>
          <HStack spacing={3}>
            {customers.links.map((link) => (
              <Link
                key={link.label}
                as={RouterLink}
                href={link.url ?? '#'}
                color={link.active ? 'blue.500' : 'currentColor'}
              >
                {htmr(link.label)}
              </Link>
            ))}
          </HStack>
        </HStack>
      </Stack>
    </Layout>
  )
}

export default Customers