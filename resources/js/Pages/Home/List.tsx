import Layout from '../../components/Layout.tsx'
import { type User } from '../../@types/User.ts'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { router, Link as RouterLink } from '@inertiajs/react'
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Link,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { Edit2, Search } from 'lucide-react'
import Table from 'rc-table'
import htmr from 'htmr'
import { type Pagination } from '../../@types/Pagination.ts'
import { type Job } from '../../@types/Job.ts'
import { parseISO } from 'date-fns'
import { type Flash } from '../../@types/Flash.ts'

interface HomeProps {
  jobs: Pagination<Job>
  user: User
  flash: Flash
}

function List({ user, jobs, flash }: HomeProps) {
  const [text, setText] = useState('')

  const debounced = useDebouncedCallback((value) => {
    router.reload({ data: { search: value }, only: ['jobs'] })
  }, 800)

  function handleEdit(job: Job) {
    router.get(`/home/${job.id}`)
  }

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

  function generateStatus(job: Job): string {
    if (job.delivered_at) {
      return 'Entregue'
    }

    if (job.notified_at) {
      return 'Notificado'
    }

    if (job.finished_at) {
      return 'Finalizado'
    }

    if (job.groom_started_at) {
      return 'Em tosa'
    }

    if (job.bath_started_at) {
      return 'Em banho'
    }

    if (job.preparing_at) {
      return 'Preparando'
    }

    if (job.accepted_at) {
      return 'Aceito'
    }

    if (job.rejected_at) {
      return 'Rejeitado'
    }

    return 'Aguardando confirmação'
  }

  const headers = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Serviço',
      dataIndex: 'service',
    },
    {
      title: 'Pet',
      dataIndex: 'pet',
    },
    {
      title: 'Tutor',
      dataIndex: 'customer',
    },
    {
      title: 'Data',
      dataIndex: 'date',
    },
    {
      title: 'Hora',
      dataIndex: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: '',
      dataIndex: 'action',
    },
  ]

  const locateDate = Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const locateTime = Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const rows = jobs.data.map((job) => ({
    key: job.id,
    id: job.id,
    service: `Banho ${job.groom ? 'e tosa' : ''}`,
    pet: job.pet.name,
    customer: job.pet.user.name,
    date: locateDate.format(parseISO(job.date)),
    time: locateTime.format(parseISO(job.date)),
    status: generateStatus(job),
    action: (
      <IconButton
        hidden={job.delivered_at !== null}
        size='sm'
        aria-label='Editar'
        icon={<Edit2 size='16px' />}
        onClick={() => {
          handleEdit(job)
        }}
      />
    ),
  }))

  return (
    <Layout title='Histórico' user={user}>
      <Stack spacing={6}>
        <HStack>
          <InputGroup>
            <InputLeftElement color='gray.500'>
              <Search width='16px' />
            </InputLeftElement>
            <Input
              placeholder='Pesquise pelo nome do tutor'
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                debounced(e.target.value)
              }}
            />
          </InputGroup>
          <Button as={RouterLink} flexShrink={0} href='/home/agendar'>
            Agendar serviço
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
            Exibindo de {jobs.data.length} de {jobs.total}
          </Text>
          <HStack spacing={3}>
            {jobs.links.map((link) => (
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
