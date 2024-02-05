import Layout from '../../components/Layout.tsx'
import { type User } from '../../@types/User.ts'
import { Button, Flex, useDisclosure, useToast } from '@chakra-ui/react'
import WorkerForm from '../../components/WorkerForm.tsx'
import { FormProvider, useForm as useClientForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { type WorkerFormData } from '../../@types/WorkerFormData.ts'
import { useEffect } from 'react'
import { type Flash } from '../../@types/Flash.ts'

interface WorkersProps {
  flash: Flash
  errors: Partial<Record<keyof WorkerFormData, string>>
  user: User
}

function List({ user, flash, errors }: WorkersProps) {
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

  return (
    <Layout title='Funcionários' user={user}>
      <Flex>
        <Button onClick={onOpen}>Criar novo</Button>
      </Flex>
      <FormProvider {...ctx}>
        <WorkerForm isOpen={isOpen} onClose={onClose} />
      </FormProvider>
    </Layout>
  )
}

export default List
