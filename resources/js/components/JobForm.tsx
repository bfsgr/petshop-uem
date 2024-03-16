import {
  Box,
  Button,
  chakra,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Step,
  StepDescription,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Tooltip,
  Link as ChakraLink,
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
import { CheckIcon, Info } from 'lucide-react'
import { type User } from '../@types/User.ts'

interface Props {
  user: User
  pets: Pet[]
  customers: Customer[]
  workers: Worker[]
}

function JobForm({ pets, customers, workers, user }: Props) {
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

  const isDisabled =
    user.type === 'App\\Models\\Customer' &&
    (watch('accepted_at') !== null || watch('rejected_at') !== null)

  function registerJob(data: JobFormData) {
    if (isEdit) {
      router.post(
        `/home/${data.id}`,
        {
          bath: data.bath,
          groom: data.groom,
          date: data.date,
          pet: data.pet.value,
          worker: data.worker.value,
          created_at: data.created_at,
          accepted_at: data.accepted_at,
          preparing_at: data.preparing_at,
          bath_started_at: data.bath_started_at,
          groom_started_at: data.groom_started_at,
          finished_at: data.finished_at,
          notified_at: data.notified_at,
          delivered_at: data.delivered_at,
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

  const updateTimes = watch([
    'created_at',
    'accepted_at',
    'preparing_at',
    'bath_started_at',
    'groom_started_at',
    'finished_at',
    'notified_at',
    'delivered_at',
  ] as const)

  const steps = [
    {
      key: 'created_at' as const,
      title: 'Criado',
    },
    {
      key: 'accepted_at' as const,
      title: 'Aceito',
    },
    {
      key: 'preparing_at' as const,
      title: 'Em preparação',
    },
    {
      key: 'bath_started_at' as const,
      title: 'Em banho',
    },
    {
      key: 'groom_started_at' as const,
      title: 'Em tosa',
    },
    {
      key: 'finished_at' as const,
      title: 'Finalizado',
    },
    {
      key: 'notified_at' as const,
      title: 'Notificado',
    },
    {
      key: 'delivered_at' as const,
      title: 'Entregue',
    },
  ]

  let activeStep = 0

  for (let i = updateTimes.length - 1; i >= 0; i--) {
    if (updateTimes[i] !== null) {
      activeStep = i
      break
    }
  }

  const locale = Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <chakra.form
      onSubmit={handleSubmit(registerJob, console.error) as any}
      noValidate
    >
      <HStack align='stretch' w={'full'} spacing={10}>
        <Stack flexGrow={1}>
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
                  <Checkbox
                    isDisabled={isDisabled}
                    isReadOnly
                    {...register('bath')}
                  >
                    Banho
                  </Checkbox>
                  <Checkbox isDisabled={isDisabled} {...register('groom')}>
                    Tosa
                  </Checkbox>
                </HStack>
              </FormControl>
              <FormControl
                isDisabled={isDisabled}
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
                    hidden={user.type === 'App\\Models\\Customer'}
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
                    isDisabled={customer === null || isDisabled}
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
                    isDisabled={isDisabled}
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
                  {isDisabled ? 'Voltar' : 'Cancelar'}
                </Button>
              </Link>
              <Button
                hidden={isDisabled}
                type='submit'
                flex={1}
                isLoading={isLoading || isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
            <ChakraLink
              hidden={!isEdit || watch('preparing_at') !== null}
              as={Link}
              textAlign='center'
              href={`/home/cancelar/${watch('id')}`}
              flex={1}
              fontSize={'sm'}
              color='red.500'
              textDecoration={'underline'}
            >
              Cancelar agendamento
            </ChakraLink>
          </Stack>
        </Stack>
        <Stack hidden={!isEdit} w={'30%'}>
          <HStack mb={'6'}>
            <Heading color='gray.600'>Status</Heading>
            {user.type !== 'App\\Models\\Customer' && (
              <Tooltip
                hasArrow
                fontSize='sm'
                label='Clique nos números para marcar um novo status'
              >
                <Box color='gray.600'>
                  <Info size='16px' />
                </Box>
              </Tooltip>
            )}
          </HStack>

          <Stepper index={activeStep} orientation='vertical'>
            {steps.map((step, index) => (
              <Controller
                key={step.key}
                control={control}
                name={step.key}
                render={({
                  field: { ref, value, onChange },
                  fieldState: { isDirty },
                }) => (
                  <Step key={step.key} ref={ref}>
                    <StepIndicator
                      sx={{
                        '&[data-status="active"][data-fixed="true"]': {
                          bg: 'blue.500',
                        },
                      }}
                      data-fixed={isDirty ? 'false' : 'true'}
                      userSelect='none'
                      cursor={
                        activeStep === index - 1 ||
                        (isDirty && activeStep === index && activeStep !== 0)
                          ? 'pointer'
                          : 'auto'
                      }
                      onClick={() => {
                        if (user.type === 'App\\Models\\Customer') return

                        if (value === null && activeStep === index - 1) {
                          onChange(new Date().toISOString())
                          return
                        }

                        if (
                          isDirty &&
                          value !== null &&
                          activeStep === index &&
                          activeStep !== 0
                        ) {
                          onChange(null)
                        }
                      }}
                    >
                      <StepStatus
                        complete={<CheckIcon size={'18px'} color='white' />}
                        active={
                          isDirty ? (
                            <StepNumber />
                          ) : (
                            <CheckIcon size={'18px'} color='white' />
                          )
                        }
                        incomplete={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink='0'>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>
                        {value ? locale.format(new Date(value)) : '-'}
                      </StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                )}
              />
            ))}
          </Stepper>
        </Stack>
      </HStack>
    </chakra.form>
  )
}

export default JobForm
