import {
  Button,
  chakra,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Stack,
} from '@chakra-ui/react'
import {
  Controller,
  useFormContext as useClientFormContext,
} from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { type JobFormData } from '../@types/JobFormData.ts'
import DateTimeInput from './DateTimeInput.tsx'
import { AsyncSelect } from 'chakra-react-select'
import type { Customer } from '../@types/Customer.ts'
import { type Pet } from '../@types/Pet.ts'
import { type Worker } from '../@types/Worker.ts'

interface Props {
  pets: Pet[]
  customers: Customer[]
  workers: Worker[]
}

function JobForm({ pets, customers, workers }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useClientFormContext<JobFormData>()

  const isEdit = watch('id') !== null

  const [isLoading, setIsLoading] = useState(false)

  const customer = watch('customer')

  function registerJob(data: JobFormData) {
    router.post(
      '/home/agendar',
      {
        bath: data.bath,
        groom: data.groom,
        date: data.date,
        pet: data.pet.value,
        worker: data.worker.value,
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

  const loadCustomersClk = useRef((_o: any[]) => {})
  const loadPetsClk = useRef((_o: any[]) => {})
  const loadWorkersClk = useRef((_o: any[]) => {})

  useEffect(() => {
    loadCustomersClk.current(
      customers.map((customer) => ({
        label: customer.name,
        value: customer.id,
      }))
    )
  }, [customers])

  useEffect(() => {
    loadPetsClk.current(
      pets.map((pet) => ({
        label: pet.name,
        value: pet.id,
      }))
    )
  }, [pets])

  useEffect(() => {
    loadWorkersClk.current(
      workers.map((worker) => ({
        label: worker.name,
        value: worker.id,
      }))
    )
  }, [workers])

  function loadCustomerOptions(
    input: string,
    callback: (options: any[]) => void
  ) {
    loadCustomersClk.current = callback

    router.reload({ only: ['customers'], data: { search: input } })
  }

  function loadPetOptions(input: string, callback: (options: any[]) => void) {
    loadPetsClk.current = callback

    router.reload({
      only: ['pets'],
      data: { search: input, customer_id: customer.value },
    })
  }

  function loadWorkerOptions(
    input: string,
    callback: (options: any[]) => void
  ) {
    loadWorkersClk.current = callback

    router.reload({
      only: ['workers'],
      data: { search: input },
    })
  }

  return (
    <chakra.form
      onSubmit={handleSubmit(registerJob, console.error) as any}
      noValidate
    >
      <Stack spacing={3} mb={6}>
        <Heading color='gray.600'>
          {!isEdit && 'Agendar novo serviço'}
          {isEdit && 'Editar serviço'}
        </Heading>
      </Stack>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Serviços a realizar</FormLabel>
            <HStack>
              <Checkbox isReadOnly {...register('bath')}>
                Banho
              </Checkbox>
              <Checkbox {...register('groom')}>Tosa</Checkbox>
            </HStack>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.date?.message !== undefined}
          >
            <FormLabel>Data e horário</FormLabel>
            <Controller
              control={control}
              name='date'
              render={({ field }) => (
                <DateTimeInput placeholder='Data do serviço' {...field} />
              )}
            />
            <FormErrorMessage fontSize='xs'>
              {errors.date?.message}
            </FormErrorMessage>
          </FormControl>
          <Controller
            control={control}
            name='customer'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormControl
                isRequired
                isInvalid={errors.customer?.message !== undefined}
              >
                <FormLabel>Cliente</FormLabel>
                <AsyncSelect
                  cacheOptions
                  placeholder='Selecione'
                  noOptionsMessage={() => 'Nenhuma opção encontrada'}
                  loadingMessage={() => 'Carregando...'}
                  loadOptions={loadCustomerOptions}
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
          <Controller
            control={control}
            name='pet'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormControl
                isDisabled={customer === null}
                isRequired
                isInvalid={errors.pet?.message !== undefined}
              >
                <FormLabel>Pet</FormLabel>
                <AsyncSelect
                  cacheOptions
                  placeholder='Selecione'
                  noOptionsMessage={() => 'Nenhuma opção encontrada'}
                  loadingMessage={() => 'Carregando...'}
                  loadOptions={loadPetOptions}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                <FormErrorMessage fontSize='xs'>
                  {errors.pet?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='worker'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormControl
                isRequired
                isInvalid={errors.worker?.message !== undefined}
              >
                <FormLabel>Funcionário</FormLabel>
                <AsyncSelect
                  cacheOptions
                  placeholder='Selecione'
                  noOptionsMessage={() => 'Nenhuma opção encontrada'}
                  loadingMessage={() => 'Carregando...'}
                  loadOptions={loadWorkerOptions}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                <FormErrorMessage fontSize='xs'>
                  {errors.worker?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />
        </Stack>
        <HStack>
          <Link href='/home' style={{ flex: 1 }}>
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

export default JobForm
