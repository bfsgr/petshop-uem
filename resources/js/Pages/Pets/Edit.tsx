import Layout from '../../components/Layout.tsx'
import { type User } from '../../@types/User.ts'
import PetForm from '../../components/PetForm.tsx'
import { FormProvider, useForm as useClientForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { type Flash } from '../../@types/Flash.ts'
import { type PetFormData } from '../../@types/PetFormData.ts'
import { type Customer } from '../../@types/Customer.ts'
import { Pet } from '../../@types/Pet.ts'

interface Props {
  user: User
  flash: Flash
  errors: Partial<Record<keyof PetFormData, string>>
  customers?: Customer[]
  pet: Pet
}

function Edit({ user, flash, errors, pet, customers = [] }: Props) {
  const ctx = useClientForm<PetFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          id: yup.number().required().nullable(),
          name: yup.string().required().min(2).label('Nome'),
          breed: yup.string().required().min(2).label('Raça'),
          birthdate: yup
            .date()
            .required()
            .max(new Date(), 'Data de nascimento deve estar no passado')
            .label('Data de nascimento'),
          history: yup
            .string()
            .transform((val) => {
              if (val === '') return null
              return val
            })
            .required()
            .nullable()
            .label('Histórico'),
          type: yup
            .object({
              label: yup.string().required(),
              value: yup.string().required(),
            })
            .required()
            .label('Tipo'),
          customer: yup
            .object({
              label: yup.string().required(),
              value: yup.number().required(),
            })
            .required()
            .label('Tutor'),
        })
        .required()
    ),
    defaultValues: {
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      birthdate: new Date(pet.birthdate),
      history: pet.history,
      type:
        pet.type == 'dog'
          ? { label: 'Cachorro', value: 'dog' }
          : { label: 'Gato', value: 'cat' },
      customer:
        user.type === 'App\\Models\\Customer'
          ? { label: user.name, value: user.id }
          : { label: pet.user.name, value: pet.user.id },
    },
  })

  useEffect(() => {
    for (const key in errors) {
      ctx.setError(key as keyof PetFormData, {
        type: 'manual',
        message: errors[key as keyof PetFormData],
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
    <Layout title='Pets > editar' user={user}>
      <FormProvider {...ctx}>
        <PetForm customers={customers} user={user} />
      </FormProvider>
    </Layout>
  )
}

export default Edit
