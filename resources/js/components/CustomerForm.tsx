import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  chakra,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import {
  FingerprintIcon,
  Locate,
  MailIcon,
  Map,
  MapPinned,
  Milestone,
  PhoneIcon,
  PinIcon,
  TextIcon,
  UserIcon,
  UtilityPole,
} from 'lucide-react'
import {
  Controller,
  useFormContext as useClientFormContext,
} from 'react-hook-form'
import { formatPhone } from '../utils/phone.ts'
import { type CustomerFormData } from '../@types/CustomerFormData.ts'
import { useEffect, useState } from 'react'
import DateInput from './DateInput.tsx'
import { formatCpfPartials } from '../utils/cpf.ts'
import { formatPartialCEP } from '../utils/cep.ts'
import { Link, router } from '@inertiajs/react'

function CustomerForm() {
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setValue,
    setError,
    watch,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useClientFormContext<CustomerFormData>()

  const isEdit = watch('id') !== null

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const cep = watch('cep', '')

  async function getCepInfo(cep: string) {
    setIsLoadingCep(true)

    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)

    setIsLoadingCep(false)

    if (!response.ok) {
      setError('cep', {
        type: 'manual',
        message: 'CEP inválido',
      })

      setValue('street', '')
      setValue('district', '')
      setValue('city', '')
      setValue('state', '')

      return
    }

    const body = await response.json()

    setValue('street', body.street)
    setValue('district', body.neighborhood)
    setValue('city', body.city)
    setValue('state', body.state)

    clearErrors('cep')
  }

  useEffect(() => {
    const state = getFieldState('cep')

    const cleanCep = cep.replace(/\D/g, '')

    if (state.isDirty && cleanCep.length === 8) {
      getCepInfo(cleanCep).catch(console.error)
    }
  }, [cep, getFieldState])

  function registerCustomer(data: CustomerFormData) {
    if (isEdit) {
      router.post(
        `/clientes/${data.id}`,
        {
          name: data.name,
          phone: data.phone,
          birthdate: data.birthdate,
          cep: data.cep,
          number: data.number,
          address_info: data.address_info !== '' ? data.address_info : null,
        },
        {
          onCancel: () => {
            setIsLoading(false)
          },
          onStart: () => {
            setIsLoading(true)
          },
          onFinish: () => {
            setIsLoading(false)
          },
          onSuccess: () => {
            setIsLoading(false)
          },
          onError: () => {
            setIsLoading(false)
          },
        }
      )
    } else {
      router.post(
        '/clientes/cadastro',
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          birthdate: data.birthdate,
          cpf: data.cpf,
          cep: data.cep,
          number: data.number,
          address_info: data.address_info !== '' ? data.address_info : null,
        },
        {
          onCancel: () => {
            setIsLoading(false)
          },
          onStart: () => {
            setIsLoading(true)
          },
          onFinish: () => {
            setIsLoading(false)
          },
          onSuccess: () => {
            setIsLoading(false)
          },
          onError: () => {
            setIsLoading(false)
          },
        }
      )
    }
  }

  return (
    <chakra.form
      noValidate
      onSubmit={handleSubmit(registerCustomer, console.error) as any}
    >
      <Stack spacing={3} mb={6}>
        <Heading color='gray.600'>
          {!isEdit && 'Cadastrar cliente'}
          {isEdit && 'Editar funcionário'}
        </Heading>
        {!isEdit && (
          <Alert fontSize='sm' status='info' borderRadius='8px'>
            <AlertIcon w='16px' />
            <AlertDescription>
              O cliente receberá um email com as instruções para acessar o
              sistema.
            </AlertDescription>
          </Alert>
        )}
      </Stack>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <FormControl
            isRequired
            isInvalid={errors.name?.message !== undefined}
          >
            <FormLabel>Nome</FormLabel>
            <InputGroup>
              <InputLeftElement color='gray.500'>
                <UserIcon size='16px' />
              </InputLeftElement>
              <Input placeholder='Nome' {...register('name')} />
            </InputGroup>
            <FormErrorMessage fontSize='xs'>
              {errors.name?.message}
            </FormErrorMessage>
          </FormControl>
          <HStack align={'start'}>
            <FormControl
              isDisabled={isEdit}
              isRequired
              isInvalid={errors.cpf?.message !== undefined}
            >
              <FormLabel>CPF</FormLabel>

              <Controller
                control={control}
                name='cpf'
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <InputGroup>
                    <InputLeftElement color='gray.500'>
                      <FingerprintIcon size='16px' />
                    </InputLeftElement>
                    <Input
                      maxLength={14}
                      bg='white'
                      placeholder='CPF'
                      ref={ref}
                      value={formatCpfPartials(value)}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  </InputGroup>
                )}
              />
              <FormErrorMessage fontSize='xs'>
                {errors.cpf?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              overflowX='hidden'
              isRequired
              isInvalid={errors.birthdate?.message !== undefined}
            >
              <FormLabel
                whiteSpace='nowrap'
                overflow='hidden'
                textOverflow='ellipsis'
              >
                Data de nascimento
              </FormLabel>
              <Controller
                control={control}
                name='birthdate'
                render={({ field }) => (
                  <DateInput placeholder='Data de nascimento' {...field} />
                )}
              />
              <FormErrorMessage fontSize='xs'>
                {errors.birthdate?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <FormControl
            isRequired
            isDisabled={isEdit}
            isInvalid={errors.email?.message !== undefined}
          >
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement color='gray.500'>
                <MailIcon size='16px' />
              </InputLeftElement>
              <Input placeholder='Email' {...register('email')} />
            </InputGroup>
            <FormErrorMessage fontSize='xs'>
              {errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.phone?.message !== undefined}
          >
            <FormLabel>Celular</FormLabel>
            <Controller
              name={'phone'}
              control={control}
              render={({ field: { ref, onChange, value, onBlur } }) => (
                <InputGroup>
                  <InputLeftElement color='gray.500'>
                    <PhoneIcon size='16px' />
                  </InputLeftElement>
                  <Input
                    ref={ref}
                    placeholder='Celular'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={formatPhone(value)}
                    maxLength={15}
                  />
                </InputGroup>
              )}
            />
            <FormErrorMessage fontSize='xs'>
              {errors.phone?.message}
            </FormErrorMessage>
          </FormControl>
          <Divider />
          <HStack align={'start'}>
            <Controller
              control={control}
              name='cep'
              render={({ field: { ref, value, onChange, onBlur, name } }) => (
                <FormControl
                  flex={1}
                  isReadOnly={isLoadingCep}
                  isRequired
                  isInvalid={errors.cep?.message !== undefined}
                >
                  <FormLabel>CEP</FormLabel>
                  <InputGroup>
                    <InputLeftElement color='gray.500'>
                      <Milestone size='16px' />
                    </InputLeftElement>
                    <Input
                      maxLength={9}
                      placeholder='CEP'
                      ref={ref}
                      name={name}
                      value={formatPartialCEP(value)}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                    <InputRightElement>
                      {isLoadingCep && <Spinner size='sm' />}
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize='xs'>
                    {errors.cep?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />

            <FormControl
              flex={2}
              isReadOnly
              isRequired
              isInvalid={errors.street?.message !== undefined}
            >
              <FormLabel>Rua</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <MapPinned size='16px' />
                </InputLeftElement>
                <Input placeholder='Rua' {...register('street')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.street?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack align={'start'} flexWrap={'wrap'}>
            <FormControl
              flex={1}
              isRequired
              isInvalid={errors.number?.message !== undefined}
            >
              <FormLabel>Número</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <Locate size='16px' />
                </InputLeftElement>
                <Input placeholder='Número' {...register('number')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.number?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              flex={2}
              isInvalid={errors.address_info?.message !== undefined}
            >
              <FormLabel>Complemento</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <TextIcon size='16px' />
                </InputLeftElement>
                <Input
                  placeholder='Complemento'
                  {...register('address_info')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.address_info?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack align={'start'} flexWrap='wrap'>
            <FormControl
              flex={1}
              isReadOnly
              isRequired
              isInvalid={errors.state?.message !== undefined}
            >
              <FormLabel>Estado</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <Map size='16px' />
                </InputLeftElement>
                <Input placeholder='Estado' {...register('state')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.state?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              flex={2}
              isReadOnly
              isInvalid={errors.city?.message !== undefined}
            >
              <FormLabel>Cidade</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <UtilityPole size='16px' />
                </InputLeftElement>
                <Input placeholder='Cidade' {...register('city')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.city?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              flex={2}
              isReadOnly
              isInvalid={errors.district?.message !== undefined}
            >
              <FormLabel>Bairro</FormLabel>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <PinIcon size='16px' />
                </InputLeftElement>
                <Input placeholder='Bairro' {...register('district')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.district?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
        </Stack>
        <HStack>
          <Link href='/clientes' style={{ flex: 1 }}>
            <Button type='button' w={'full'} variant='outline'>
              Cancelar
            </Button>
          </Link>
          <Button type='submit' flex={1} isLoading={isLoading || isSubmitting}>
            Salvar
          </Button>
        </HStack>
      </Stack>
    </chakra.form>
  )
}

export default CustomerForm
