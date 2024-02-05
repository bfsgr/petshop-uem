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
  useToast,
  InputRightElement,
  IconButton,
  Link,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link as RouterLink, router } from '@inertiajs/react'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, PawPrint } from 'lucide-react'
import { useForm as useClientForm } from 'react-hook-form'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { type Flash } from '../@types/Flash.ts'

interface ResetPasswordFormData {
  email: string
  password: string
  password_confirmation: string
}

interface Props {
  errors: Partial<Record<keyof ResetPasswordFormData, string>>
  flash: Flash
  token: string
  email: string
}

function ResetPassword({ flash, email, token, errors: apiErrors }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useClientForm<ResetPasswordFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          email: yup.string().required().label('Email'),
          password: yup.string().required().min(8).required().label('Senha'),
          password_confirmation: yup
            .string()
            .required()
            .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
            .required()
            .label('Confirmação de senha'),
        })
        .required()
    ),
    defaultValues: {
      email,
      password: '',
      password_confirmation: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  useEffect(() => {
    if (flash.status !== null) {
      toast({
        title: 'Não foi possível realizar o login',
        description: flash.message,
        status: flash.status,
        isClosable: true,
        duration: null,
      })
    }
  }, [flash, toast])

  function verify(data: ResetPasswordFormData) {
    router.post(
      '/nova-senha',
      {
        token,
        ...data,
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

  useEffect(() => {
    for (const key in apiErrors) {
      setError(key as keyof ResetPasswordFormData, {
        type: 'manual',
        message: apiErrors[key as keyof ResetPasswordFormData],
      })
    }
  }, [setError, apiErrors])

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
      <Flex borderRadius='sm' minH='full' flexGrow='1'>
        <Flex
          zIndex={1}
          bg='#D9D7D74F'
          my='8'
          ml='8'
          mr={{ base: '8', md: '0' }}
          borderTopLeftRadius='50px'
          borderBottomLeftRadius='50px'
          borderTopRightRadius={{ base: '50px', md: '0' }}
          borderBottomRightRadius={{ base: '50px', md: '0' }}
          flex='1'
          justifyContent='center'
          gap='8'
        >
          <chakra.form
            p='4'
            my='auto'
            display='flex'
            flexDirection='column'
            noValidate
            onSubmit={handleSubmit(verify, console.error) as any}
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
              <PawPrint size='85px' fill='currentColor' />
            </Center>
            <VStack spacing='3'>
              <VStack align='start'>
                <Heading>Olá {email}!</Heading>
                <Text fontSize='sm'>
                  Redefina sua senha para continuar acessando o sistema.
                </Text>
              </VStack>
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
                    bg='white'
                    placeholder='Email'
                    {...register('email')}
                    readOnly
                    disabled
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
                    bg='white'
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
                isInvalid={errors.password_confirmation?.message !== undefined}
              >
                <VisuallyHidden>
                  <FormLabel>Senha</FormLabel>
                </VisuallyHidden>
                <InputGroup>
                  <InputLeftElement color='gray.500'>
                    <LockIcon size='16px' />
                  </InputLeftElement>
                  <Input
                    bg='white'
                    placeholder='Confirme sua senha'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password_confirmation')}
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
                  {errors.password_confirmation?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <HStack mt='6' w='full' justify='space-between'>
              <Link as={RouterLink} href={'/login'}>
                <Text fontSize='sm'>Voltar</Text>
              </Link>
              <Button isLoading={isLoading} flexShrink={0} type='submit'>
                Redefinir
              </Button>
            </HStack>
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
        >
          <VStack p='10' spacing='6'>
            <Heading color='white' size='md' textAlign='center'>
              Sem mais estresse para administrar seus serviços no pet shop.
            </Heading>
            <Center border='1px solid white' borderRadius='full' p='4'>
              <PawPrint
                width='200px'
                height='200px'
                fill='white'
                stroke='white'
              />
            </Center>
            <Text color='white'>Um sistema de pet shop feito para você.</Text>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ResetPassword
