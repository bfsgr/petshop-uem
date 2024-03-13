import { type Flash } from '../../@types/Flash.ts'
import { type User } from '../../@types/User.ts'
import Layout from '../../components/Layout.tsx'
import { type CustomerFormData } from '../../@types/CustomerFormData.ts'
import CustomerForm from '../../components/CustomerForm.tsx'
import { useForm as useClientForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { isValidCPF } from '../../utils/cpf.ts'
import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { Customer } from '../../@types/Customer.ts'

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
          id: yup.number().required().nullable(),
          name: yup.string().required().min(2).label('Nome'),
          email: yup.string().required().email().label('Email'),
          phone: yup
            .string()
            .required()
            .transform((val) => val.replace(/\D/g, ''))
            .min(10, 'Celular deve ser pelo menos 10 dígitos')
            .max(11, 'Celular deve ser no máximo 11 dígitos')
            .label('Celular'),
          birthdate: yup
            .date()
            .required()
            .max(new Date(), 'Data de nascimento deve estar no passado')
            .label('Data de nascimento'),
          cpf: yup
            .string()
            .required()
            .transform((val) => val.replace(/\D/g, ''))
            .length(11)
            .test({
              name: 'isCpfValid',
              message: 'CPF inválido',
              test: isValidCPF,
            })
            .label('CPF'),
          cep: yup
            .string()
            .transform((val) => val.replace(/\D/g, ''))
            .length(8)
            .required()
            .label('CEP'),
          street: yup.string().required().label('Rua'),
          number: yup.string().required().label('Número'),
          district: yup.string().required().label('Bairro'),
          city: yup.string().required().label('Cidade'),
          state: yup.string().required().label('Estado'),
          address_info: yup
            .string()
            .transform((val) => (val !== '' ? val : null))
            .required()
            .nullable()
            .label('Complemento'),
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
        <CustomerForm />
      </FormProvider>
    </Layout>
  )
}

export default EditCustomer