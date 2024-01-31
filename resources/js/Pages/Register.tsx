import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  VisuallyHidden,
  chakra,
  IconButton,
  InputRightElement,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, router } from '@inertiajs/react'
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  LockIcon,
  MailIcon,
  PawPrint,
  UserIcon,
} from 'lucide-react'
import { Controller, useForm as useClientForm } from 'react-hook-form'
import * as yup from 'yup'
import { formatCpfPartials, isValidCPF } from '../utils/cpf'
import { useState } from 'react'

interface RegisterFormData {
  name: string
  email: string
  birthdate: Date
  cpf: string
  password: string
  passwordConfirmation: string
}

function Register() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useClientForm<RegisterFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          name: yup.string().required().min(2).label('Nome'),
          email: yup.string().required().email().label('Email'),
          birthdate: yup
            .date()
            .typeError('Data de nascimento é um campo necessário')
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
          password: yup.string().required().min(8).required().label('Senha'),
          passwordConfirmation: yup
            .string()
            .required()
            .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
            .required()
            .label('Confirmação de senha'),
        })
        .required()
    ),
    defaultValues: {
      name: '',
      email: '',
      birthdate: undefined,
      cpf: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false)

  function registerUser(data: RegisterFormData) {
    router.post('/register', {
      ...data,
      password_confirmation: data.passwordConfirmation,
    })
  }

  return (
    <Flex bg='white' w='full' minH='100vh' position='relative' justify='center'>
      <Flex
        right={0}
        bg={{
          base: 'white',
          md: 'linear-gradient(34.83deg, #0085FF 28.78%, #70C8DC 98.47%, #70C8DC 98.47%)',
        }}
        h='full'
        w={{ base: 'full', md: '50%' }}
        position='absolute'
      />
      <Flex
        flex='1'
        zIndex={1}
        bg='#D9D7D74F'
        my='8'
        ml='8'
        mr={{ base: '8', md: '0' }}
        borderTopLeftRadius='50px'
        borderBottomLeftRadius='50px'
        borderTopRightRadius={{ base: '50px', md: '0' }}
        borderBottomRightRadius={{ base: '50px', md: '0' }}
        justifyContent='center'
        gap='8'
      >
        <chakra.form
          p='4'
          my='auto'
          noValidate
          onSubmit={handleSubmit(registerUser, console.error) as any}
        >
          <Center
            display={{ base: 'flex', md: 'none' }}
            mx='auto'
            h='fit-content'
            mb='5'
            border='4px solid'
            borderRadius='full'
            w='fit-content'
            color='blue.500'
            p='4'
          >
            <PawPrint size='78px' fill='currentColor' />
          </Center>
          <VStack spacing='3'>
            <VStack align='start'>
              <Heading>Vamos começar?</Heading>
              <Text fontSize='sm'>
                Insira seus dados abaixo para criar uma conta
              </Text>
            </VStack>
            <FormControl
              isRequired
              isInvalid={errors.name?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>Nome</FormLabel>
              </VisuallyHidden>
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
              isRequired
              isInvalid={errors.cpf?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>CPF</FormLabel>
              </VisuallyHidden>

              <Controller
                control={control}
                name='cpf'
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <InputGroup>
                    <InputLeftElement color='gray.500'>
                      <FingerprintIcon size='16px' />
                    </InputLeftElement>
                    <Input
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
              isRequired
              isInvalid={errors.birthdate?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>Data de nascimento</FormLabel>
              </VisuallyHidden>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <CalendarIcon size='16px' />
                </InputLeftElement>
                <Input
                  placeholder='Data de nascimento'
                  type='date'
                  {...register('birthdate')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.birthdate?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={errors.email?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>Email</FormLabel>
              </VisuallyHidden>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <MailIcon size='16px' />
                </InputLeftElement>
                <Input
                  placeholder='Email'
                  type='email'
                  {...register('email')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={errors.password?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>Senha</FormLabel>
              </VisuallyHidden>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <LockIcon size='16px' />
                </InputLeftElement>
                <Input
                  placeholder='Senha'
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <InputRightElement color='gray.500'>
                  <IconButton
                    colorScheme='gray'
                    variant='link'
                    aria-label={
                      showPassword ? 'Esconder senha' : 'Mostrar senha'
                    }
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    icon={
                      showPassword ? (
                        <EyeOffIcon size='16px' />
                      ) : (
                        <EyeIcon size='16px' />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.password?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={errors.passwordConfirmation?.message !== undefined}
            >
              <VisuallyHidden>
                <FormLabel>Confirmação de senha</FormLabel>
              </VisuallyHidden>
              <InputGroup>
                <InputLeftElement color='gray.500'>
                  <LockIcon size='16px' />
                </InputLeftElement>
                <Input
                  placeholder='Confirme sua senha'
                  type={showPassword ? 'text' : 'password'}
                  {...register('passwordConfirmation')}
                />
                <InputRightElement color='gray.500'>
                  <IconButton
                    colorScheme='gray'
                    variant='link'
                    aria-label={
                      showPassword ? 'Esconder senha' : 'Mostrar senha'
                    }
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    icon={
                      showPassword ? (
                        <EyeOffIcon size='16px' />
                      ) : (
                        <EyeIcon size='16px' />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize='xs'>
                {errors.passwordConfirmation?.message}
              </FormErrorMessage>
            </FormControl>
            <HStack w='full' justify='space-between'>
              <Link href={'/login'}>
                <Text fontSize='sm'>Já tenho cadastro</Text>
              </Link>
              <Button flexShrink={0} type='submit'>
                Cadastrar
              </Button>
            </HStack>
          </VStack>
        </chakra.form>
      </Flex>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        zIndex={1}
        bg='#32343C21'
        my='8'
        mr='8'
        borderTopRightRadius='50px'
        borderBottomRightRadius='50px'
        flex='1'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <VStack m='10' spacing='6'>
          <Heading color='white' size='md' textAlign='center'>
            Faça seu cadastro
          </Heading>
          <Center border='1px solid white' borderRadius='full' p='4'>
            <PawPrint
              width='200px'
              height='200px'
              fill='white'
              stroke='white'
            />
          </Center>
          <Text color='white'>E faça seu pet mais feliz.</Text>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Register
