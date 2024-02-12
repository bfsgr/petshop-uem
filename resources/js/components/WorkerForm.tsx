import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { type MutableRefObject, useRef, useState } from 'react'
import {
  Controller,
  useFormContext as useClientFormContext,
} from 'react-hook-form'
import { type WorkerFormData } from '../@types/WorkerFormData.ts'
import { formatPhone } from '../utils/phone.ts'
import { router } from '@inertiajs/react'
import DateInput from './DateInput.tsx'

interface WorkerFormProps {
  isOpen: boolean
  onClose: () => void
}

function WorkerForm({ isOpen, onClose }: WorkerFormProps) {
  const initialRef: MutableRefObject<HTMLInputElement | null> = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useClientFormContext<WorkerFormData>()

  const { ref: nameRef, ...nameProps } = register('name')

  const [isLoading, setIsLoading] = useState(false)

  const isEdit = watch('id') !== null

  function closeModal() {
    reset({
      id: null,
      name: '',
      email: '',
      phone: '',
      hired_at: null as any,
      fired_at: null,
    })
    onClose()
  }

  function registerUser(data: WorkerFormData) {
    if (isEdit) {
      router.post(
        `/funcionarios/${data.id}`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone.replace(/\D/g, ''),
          hired_at: data.hired_at,
          fired_at: data.fired_at ? data.fired_at : null,
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
            closeModal()
          },
          onError: () => {
            setIsLoading(false)
          },
        }
      )
    } else {
      router.post(
        '/funcionarios',
        {
          ...data,
          phone: data.phone.replace(/\D/g, ''),
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
            closeModal()
          },
          onError: () => {
            setIsLoading(false)
          },
        }
      )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      initialFocusRef={initialRef}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <chakra.form
          noValidate
          onSubmit={handleSubmit(registerUser, console.error) as any}
        >
          <ModalHeader borderBottom='1px solid' borderColor='gray.100'>
            <Heading color='gray.600'>
              {!isEdit && 'Criar novo funcionário'}
              {isEdit && 'Editar funcionário'}
            </Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody pb={8} pt={6}>
            {!isEdit && (
              <Alert fontSize='sm' mb={6} status='info' borderRadius='8px'>
                <AlertIcon w='16px' />
                <AlertDescription>
                  O funcionário receberá um email com as instruções para acessar
                  o sistema.
                </AlertDescription>
              </Alert>
            )}
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
                  <Input
                    ref={(r) => {
                      nameRef(r)
                      initialRef.current = r
                    }}
                    placeholder='Nome'
                    {...nameProps}
                  />
                </InputGroup>
                <FormErrorMessage fontSize='xs'>
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>
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
              <HStack>
                <FormControl
                  isRequired
                  isInvalid={errors.hired_at?.message !== undefined}
                >
                  <FormLabel>Data de admissão</FormLabel>
                  <Controller
                    control={control}
                    name='hired_at'
                    render={({ field }) => (
                      <DateInput placeholder='Data de admissão' {...field} />
                    )}
                  />
                  <FormErrorMessage fontSize='xs'>
                    {errors.hired_at?.message}
                  </FormErrorMessage>
                </FormControl>
                {isEdit && (
                  <FormControl
                    isInvalid={errors.fired_at?.message !== undefined}
                  >
                    <FormLabel>Data de demissão</FormLabel>
                    <Controller
                      control={control}
                      name='fired_at'
                      render={({ field }) => (
                        <DateInput placeholder='Data de demissão' {...field} />
                      )}
                    />
                    <FormErrorMessage fontSize='xs'>
                      {errors.fired_at?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter borderTop='1px solid' borderColor='gray.100' gap={2}>
            <Button
              type='button'
              flex={1}
              variant='outline'
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button type='submit' flex={1} isLoading={isLoading}>
              Salvar
            </Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  )
}

export default WorkerForm
