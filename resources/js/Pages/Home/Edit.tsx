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
import { type Job } from '../../@types/Job.ts'

interface Props {
  flash: Flash
  user: User
  job: Job
  pets?: Pet[]
  customers?: Customer[]
  workers?: Worker[]
  errors: Partial<Record<keyof JobFormData, string>>
}

function EditJob({
  user,
  errors,
  flash,
  job,
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
          accepted_at: yup.string().nullable().defined(),
          rejected_at: yup.string().nullable().defined(),
          preparing_at: yup.string().nullable().defined(),
          bath_started_at: yup.string().nullable().defined(),
          groom_started_at: yup.string().nullable().defined(),
          finished_at: yup.string().nullable().defined(),
          notified_at: yup.string().nullable().defined(),
          delivered_at: yup.string().nullable().defined(),
          created_at: yup.string().required(),
          updated_at: yup.string().required(),
        })
        .required()
    ),
    defaultValues: {
      id: job.id,
      bath: true,
      groom: job.groom,
      date: new Date(job.date),
      pet: { label: job.pet.name, value: job.pet.id },
      worker: { label: job.worker.name, value: job.worker.id },
      customer: { label: job.pet.user.name, value: job.pet.user.id },
      accepted_at: job.accepted_at,
      rejected_at: job.rejected_at,
      preparing_at: job.preparing_at,
      bath_started_at: job.bath_started_at,
      groom_started_at: job.groom_started_at,
      finished_at: job.finished_at,
      notified_at: job.notified_at,
      delivered_at: job.delivered_at,
      created_at: job.created_at,
      updated_at: job.updated_at,
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
    <Layout title='Histórico > Editar serviço' user={user}>
      <FormProvider {...ctx}>
        <JobForm
          user={user}
          pets={pets}
          customers={customers}
          workers={workers}
        />
      </FormProvider>
    </Layout>
  )
}

export default EditJob
