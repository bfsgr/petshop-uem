import {
  Button,
  Card,
  CardBody,
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
  CardFooter,
  useToast,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, router } from '@inertiajs/react'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, PawPrint } from 'lucide-react'
import { useForm as useClientForm } from 'react-hook-form'
import * as yup from 'yup'
import { useEffect, useState } from 'react'

interface LoginFormData {
  email: string
  password: string
}

interface Props {
  flash: {
    status: string | null
  }
}

function Login({ flash }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useClientForm<LoginFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          email: yup.string().required().email().label('Email'),
          password: yup.string().required().min(8).required().label('Senha'),
        })
        .required()
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const toast = useToast()

  useEffect(() => {
    if (flash.status !== null) {
      toast({
        title: 'Não foi possível realizar o login',
        description: flash.status,
        status: 'error',
        isClosable: true,
        duration: null,
      })
    }
  }, [flash, toast])

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function login(data: LoginFormData) {
    router.post(
      '/login',
      {
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
        onError: () => {
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Flex w='full' minH='100vh' justify='center'>
      <Flex p='12' borderRadius='sm' minH='full' flexGrow='1'>
        <Card
          mx='auto'
          w='fit-content'
          boxShadow={{ base: 'base', md: 'none' }}
          px='4'
          py='3'
          flexDirection='row'
          justifyContent='stretch'
          borderTopRightRadius={{ base: 'sm', md: 0 }}
          borderBottomRightRadius={{ base: 'sm', md: 0 }}
        >
          <chakra.form
            display='flex'
            flexDirection='column'
            noValidate
            onSubmit={handleSubmit(login, console.error) as any}
          >
            <CardBody>
              <Center
                display={{ base: 'flex', md: 'none' }}
                mx='auto'
                h='fit-content'
                mb='5'
                border='4px solid'
                borderRadius='full'
                w='fit-content'
                color='orange.500'
                p='4'
              >
                <PawPrint size='78px' />
              </Center>
              <VStack spacing='3'>
                <VStack align='start'>
                  <Heading>Bem vindo de volta!</Heading>
                  <Text fontSize='sm'>
                    Preencha seus dados para acessar sua conta
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
              </VStack>
            </CardBody>
            <CardFooter>
              <HStack w='full' justify='space-between'>
                <Link href={'/register'}>
                  <Text fontSize='sm'>Não tenho conta</Text>
                </Link>
                <Button isLoading={isLoading} flexShrink={0} type='submit'>
                  Entrar
                </Button>
              </HStack>
            </CardFooter>
          </chakra.form>
        </Card>
        <Flex
          display={{ base: 'none', md: 'flex' }}
          px={4}
          minW='50%'
          flex='1'
          bg='blue.500'
          align='center'
          justify='center'
          direction='column'
          color='white'
          borderTopRightRadius='sm'
          borderBottomRightRadius='sm'
        >
          <Center
            h='fit-content'
            mb='5'
            border='4px solid'
            borderRadius='full'
            color='white'
            p='4'
          >
            <PawPrint size='78px' />
          </Center>
          <VStack spacing={1} textAlign='center'>
            <Heading>Seja bem-vindo!</Heading>
            <Text fontSize='sm'>
              Entre e tenha acesso a mais de 100 petshops pelo Brasil.
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Login
