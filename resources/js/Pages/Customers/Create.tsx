import { type Flash } from '../../@types/Flash.ts'
import { type User } from '../../@types/User.ts'
import Layout from '../../components/Layout.tsx'
import { type CustomerFormData } from '../../@types/CustomerFormData.ts'
import CustomerForm from '../../components/CustomerForm.tsx'
import { useForm as useClientForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { CustomerBaseValidation } from '../../validation/CustomerBaseValidation.ts'
import * as yup from 'yup'

interface Props {
  flash: Flash
  user: User
  errors: Partial<Record<keyof CustomerFormData, string>>
}

function CreateCustomer({ user, errors, flash }: Props) {
  const ctx = useClientForm<CustomerFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          ...CustomerBaseValidation,
          password: yup.string().defined(),
          password_confirmation: yup.string().defined(),
        })
        .required()
    ),
    defaultValues: {
      id: null,
      name: '',
      email: '',
      phone: '',
      birthdate: null as any,
      cpf: '',
      cep: '',
      street: '',
      number: '',
      district: '',
      city: '',
      state: '',
      address_info: '',
      password: '',
      password_confirmation: '',
    },
  })

  useEffect(() => {
    for (const key in errors) {
      ctx.setError(key as keyof CustomerFormData, {
        type: 'manual',
        message: errors[key as keyof CustomerFormData],
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
    <Layout title='Clientes > cadastro' user={user}>
      <FormProvider {...ctx}>
        <CustomerForm isClient={false} />
      </FormProvider>
    </Layout>
  )
}

export default CreateCustomer
