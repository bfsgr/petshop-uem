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
import { Link as RouterLink } from '@inertiajs/react'
import Table from 'rc-table'
import htmr from 'htmr'
import { type Pagination } from '../../@types/Pagination.ts'
import { useEffect } from 'react'
import { type Pet } from '../../@types/Pet.ts'
import { type Flash } from '../../@types/Flash.ts'

interface PetsProps {
  pets: Pagination<Pet>
  user: User
  flash: Flash
}

function List({ user, pets, flash }: PetsProps) {
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

  function handleEdit(pet: Pet) {
    console.log('Edit', pet)
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
      title: 'Raça',
      dataIndex: 'breed',
    },
    {
      title: 'Tutor',
      dataIndex: 'customer',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
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

  const rows = pets.data.map((pet) => ({
    key: pet.id,
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    customer: pet.user.name,
    type: pet.type === 'dog' ? 'Cachorro' : 'Gato',
    status: pet.status ? 'Ativo' : 'Inativo',
    action: (
      <IconButton
        size='sm'
        aria-label='Editar'
        icon={<Edit2 size='16px' />}
        onClick={() => {
          handleEdit(pet)
        }}
      />
    ),
  }))

  return (
    <Layout title='Pets' user={user}>
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
            Cadastrar Pet
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
            Exibindo de {pets.data.length} de {pets.total}
          </Text>
          <HStack spacing={3}>
            {pets.links.map((link) => (
              <Link
                key={link.label}
                as={RouterLink}
                href={link.url ?? '#'}
                color={link.active ? 'blue.500' : 'currentColor'}
                preserveState
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

export default List
