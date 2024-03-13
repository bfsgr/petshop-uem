import {
  Controller,
  useFormContext as useClientFormContext,
} from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { UserIcon } from 'lucide-react'
import DateInput from './DateInput.tsx'
import { type PetFormData } from '../@types/PetFormData.ts'
import { AsyncSelect, Select } from 'chakra-react-select'
import { type Customer } from '../@types/Customer.ts'
import { type User } from '../@types/User.ts'

interface Props {
  customers: Customer[]
  user: User
}

function PetForm({ customers, user }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useClientFormContext<PetFormData>()

  const [isLoading, setIsLoading] = useState(false)

  const isEdit = watch('id') !== null

  function registerCustomer(data: PetFormData) {
    if (isEdit) {
      router.post(
        `/pets/${data.id}`,
        {
          name: data.name,
          birthdate: data.birthdate,
          type: data.type.value,
          breed: data.breed,
          history: data.history,
          customer: data.customer.value,
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
        '/pets/cadastro',
        {
          name: data.name,
          birthdate: data.birthdate,
          type: data.type.value,
          breed: data.breed,
          history: data.history,
          customer: data.customer.value,
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

  const loadClk = useRef((_o: any[]) => {})

  useEffect(() => {
    loadClk.current(
      customers.map((customer) => ({
        label: customer.name,
        value: customer.id,
      }))
    )
  }, [customers])

  function loadOptions(input: string, callback: (options: any[]) => void) {
    loadClk.current = callback

    router.reload({ only: ['customers'], data: { search: input } })
  }

  return (
    <chakra.form
      noValidate
      onSubmit={handleSubmit(registerCustomer, console.error) as any}
    >
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
          <Controller
            control={control}
            name='type'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormControl
                isRequired
                isInvalid={errors.type?.message !== undefined}
              >
                <FormLabel>Tipo</FormLabel>
                <Select
                  placeholder='Selecione'
                  noOptionsMessage={() => 'Nenhuma opção encontrada'}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  options={[
                    { label: 'Cachorro', value: 'dog' },
                    { label: 'Gato', value: 'cat' },
                  ]}
                />
                <FormErrorMessage fontSize='xs'>
                  {errors.type?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />
          <FormControl
            isRequired
            isInvalid={errors.breed?.message !== undefined}
          >
            <FormLabel>Raça</FormLabel>
            <Input placeholder='Raça' {...register('breed')} />
            <FormErrorMessage fontSize='xs'>
              {errors.breed?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.history?.message !== undefined}>
            <FormLabel>Histórico</FormLabel>
            <Textarea
              bg='white'
              placeholder='Histórico'
              {...register('history')}
            />
            <FormErrorMessage fontSize='xs'>
              {errors.history?.message}
            </FormErrorMessage>
          </FormControl>
          {user.type === 'App\\Models\\Worker' && (
            <Controller
              control={control}
              name='customer'
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <FormControl
                  isRequired
                  isInvalid={errors.customer?.message !== undefined}
                >
                  <FormLabel>Tutor</FormLabel>
                  <AsyncSelect
                    cacheOptions
                    placeholder='Selecione'
                    noOptionsMessage={() => 'Nenhuma opção encontrada'}
                    loadingMessage={() => 'Carregando...'}
                    loadOptions={loadOptions}
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                  <FormErrorMessage fontSize='xs'>
                    {errors.customer?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          )}
        </Stack>
        <HStack>
          <Link href='/pets' style={{ flex: 1 }}>
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

export default PetForm
