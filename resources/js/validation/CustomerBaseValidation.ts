import * as yup from 'yup'
import { isValidCPF } from '../utils/cpf.ts'
import { pt } from '../yupPt.ts'

yup.setLocale(pt)

export const CustomerBaseValidation = {
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
}
