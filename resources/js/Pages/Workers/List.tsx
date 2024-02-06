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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import WorkerForm from '../../components/WorkerForm.tsx'
import { FormProvider, useForm as useClientForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { type WorkerFormData } from '../../@types/WorkerFormData.ts'
import { useEffect } from 'react'
import { type Flash } from '../../@types/Flash.ts'
import Table from 'rc-table'
import { type Pagination } from '../../@types/Pagination.ts'
import { type Worker } from '../../@types/Worker.ts'
import { formatPhone } from '../../utils/phone.ts'
import { Edit2, Search } from 'lucide-react'
import { Link as RouterLink } from '@inertiajs/react'
import htmr from 'htmr'
import { parseISO } from 'date-fns'

interface WorkersProps {
  flash: Flash
  errors: Partial<Record<keyof WorkerFormData, string>>
  user: User
  workers: Pagination<Worker>
}

function List({ user, flash, errors, workers }: WorkersProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const ctx = useClientForm<WorkerFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          id: yup.number().required().nullable(),
          name: yup.string().required().min(2).label('Nome'),
          email: yup.string().required().email().label('Email'),
          phone: yup
            .string()
            .required()
            .min(14, 'Celular deve ser pelo menos 10 dígitos')
            .max(15, 'Celular deve ser no máximo 11 dígitos')
            .label('Celular'),
          hired_at: yup
            .date()
            .typeError('Data de admissão é um campo necessário')
            .required()
            .max(new Date(), 'Data de admissão deve estar no passado')
            .label('Data de admissão'),
          fired_at: yup
            .date()
            .required()
            .nullable()
            .min(yup.ref('hired_at'), 'Data de demissão deve ser após admissão')
            .max(new Date(), 'Data de demissão deve estar no passado')
            .label('Data de demissão'),
        })
        .required()
    ),
    defaultValues: {
      id: null,
      name: '',
      email: '',
      phone: '',
      hired_at: null as any,
      fired_at: null,
    },
  })

  function handleEdit(worker: Worker) {
    ctx.reset({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      phone: formatPhone(worker.phone),
      hired_at: parseISO(worker.subclass.hired_at),
      fired_at:
        worker.subclass.fired_at !== null
          ? parseISO(worker.subclass.fired_at)
          : null,
    })

    onOpen()
  }

  useEffect(() => {
    for (const key in errors) {
      ctx.setError(key as keyof WorkerFormData, {
        type: 'manual',
        message: errors[key as keyof WorkerFormData],
      })
    }
  }, [ctx, errors])

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
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Celular',
      dataIndex: 'phone',
    },
    {
      title: 'Admissão',
      dataIndex: 'hired_at',
    },
    {
      title: 'Demissão',
      dataIndex: 'fired_at',
    },
    {
      title: '',
      dataIndex: 'action',
    },
  ]

  const locate = Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const rows = workers.data.map((worker) => ({
    key: worker.id,
    id: worker.id,
    name: worker.name,
    email: worker.email,
    phone: formatPhone(worker.phone),
    hired_at: locate.format(parseISO(worker.subclass.hired_at)),
    fired_at:
      worker.subclass.fired_at !== null
        ? locate.format(parseISO(worker.subclass.fired_at))
        : 'N/A',
    action: (
      <IconButton
        size='sm'
        aria-label='Editar'
        icon={<Edit2 size='16px' />}
        onClick={() => {
          handleEdit(worker)
        }}
      />
    ),
  }))

  return (
    <Layout title='Funcionários' user={user}>
      <Stack>
        <HStack>
          <InputGroup>
            <InputLeftElement color='gray.500'>
              <Search width='16px' />
            </InputLeftElement>
            <Input placeholder='Pesquise' />
          </InputGroup>
          <Button onClick={onOpen} flexShrink={0}>
            Criar novo funcionário
          </Button>
        </HStack>
        <Table className='custom-table' columns={headers} data={rows} />
        <HStack
          px='px'
          py={1}
          w='full'
          justify='space-between'
          color='gray.700'
        >
          <Text>
            Exibindo de {workers.data.length} de {workers.total}
          </Text>
          <HStack spacing={3}>
            {workers.links.map((link) => (
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
      <FormProvider {...ctx}>
        <WorkerForm isOpen={isOpen} onClose={onClose} />
      </FormProvider>
    </Layout>
  )
}

export default List
