import { type Flash } from '../../@types/Flash.ts'
import { type User } from '../../@types/User.ts'
import Layout from '../../components/Layout.tsx'
import { type CustomerFormData } from '../../@types/CustomerFormData.ts'
import CustomerForm from '../../components/CustomerForm.tsx'
import { useForm as useClientForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { type Customer } from '../../@types/Customer.ts'
import { CustomerBaseValidation } from '../../validation/CustomerBaseValidation.ts'

interface Props {
  flash: Flash
  user: User
  errors: Partial<Record<keyof CustomerFormData, string>>
  customer: Customer
}

function EditCustomer({ user, errors, flash, customer }: Props) {
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
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      birthdate: new Date(customer.subclass.birthdate),
      cpf: customer.subclass.cpf,
      cep: customer.subclass.cep,
      street: customer.subclass.street,
      number: customer.subclass.number,
      district: customer.subclass.district,
      city: customer.subclass.city,
      state: customer.subclass.state,
      address_info: customer.subclass.address_info,
      password: '',
      password_confirmation: '',
    },
  })

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

  useEffect(() => {
    for (const key in errors) {
      ctx.setError(key as keyof CustomerFormData, {
        type: 'manual',
        message: errors[key as keyof CustomerFormData],
      })
    }
  }, [ctx, errors])

  return (
    <Layout title='Clientes > editar' user={user}>
      <FormProvider {...ctx}>
        <CustomerForm isClient={false} />
      </FormProvider>
    </Layout>
  )
}

export default EditCustomer
