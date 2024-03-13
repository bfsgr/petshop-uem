import { type Flash } from '../../@types/Flash.ts'
import { type User } from '../../@types/User.ts'
import Layout from '../../components/Layout.tsx'
import { useForm as useClientForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { type JobFormData } from '../../@types/JobFormData.ts'
import JobForm from '../../components/JobForm.tsx'
import { type Pet } from '../../@types/Pet.ts'
import { type Customer } from '../../@types/Customer.ts'
import { type Worker } from '../../@types/Worker.ts'
import { isWeekend } from 'date-fns'

interface Props {
  flash: Flash
  user: User
  pets?: Pet[]
  customers?: Customer[]
  workers?: Worker[]
  errors: Partial<Record<keyof JobFormData, string>>
}

function CreateJob({
  user,
  errors,
  flash,
  pets = [],
  customers = [],
  workers = [],
}: Props) {
  const ctx = useClientForm<JobFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          id: yup.number().required().nullable(),
          bath: yup.boolean().isTrue().required(),
          groom: yup.boolean().defined().required(),
          date: yup
            .date()
            .required()
            .min(new Date(), 'A data deve estar no futuro')
            .test(
              'isWeekday',
              'Não atendemos aos finais de semana',
              (value) => {
                if (!value) return true
                return !isWeekend(value)
              }
            )
            .label('Data'),
          customer: yup
            .object({
              label: yup.string().required(),
              value: yup.number().required(),
            })
            .required()
            .label('Cliente'),
          pet: yup
            .object({
              label: yup.string().required(),
              value: yup.number().required(),
            })
            .required()
            .label('Pet'),
          worker: yup
            .object({
              label: yup.string().required(),
              value: yup.number().required(),
            })
            .required()
            .label('Funcionário'),
        })
        .required()
    ),
    defaultValues: {
      id: null,
      bath: true,
      groom: false,
      date: null as any,
      pet: null as any,
      worker: null as any,
      customer: null as any,
    },
  })

  useEffect(() => {
    for (const key in errors) {
      ctx.setError(key as keyof JobFormData, {
        type: 'manual',
        message: errors[key as keyof JobFormData],
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
    <Layout title='Histórico > Agendar serviço' user={user}>
      <FormProvider {...ctx}>
        <JobForm pets={pets} customers={customers} workers={workers} />
      </FormProvider>
    </Layout>
  )
}

export default CreateJob
