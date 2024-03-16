import { Center, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { PawPrint } from 'lucide-react'
import { FormProvider, useForm as useClientForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomerForm from '../components/CustomerForm.tsx'
import { type CustomerFormData } from '../@types/CustomerFormData.ts'
import { CustomerBaseValidation } from '../validation/CustomerBaseValidation.ts'

function Register() {
  const ctx = useClientForm<CustomerFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object({
          ...CustomerBaseValidation,
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
      id: null,
      name: '',
      email: '',
      birthdate: undefined,
      cpf: '',
      password: '',
      password_confirmation: '',
    },
  })

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
        <Flex pb='8' pt='3' pl='8' pr='6' my='auto'>
          <FormProvider {...ctx}>
            <CustomerForm isClient={true} />
          </FormProvider>
        </Flex>
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
