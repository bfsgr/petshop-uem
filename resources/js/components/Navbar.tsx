import {
  Avatar,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  chakra,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink } from '@inertiajs/react'
import { useSize } from '@chakra-ui/react-use-size'
import { useRef } from 'react'
import { ChevronDown, LogOutIcon } from 'lucide-react'
import { type User } from '../@types/User.ts'

interface NavbarProps {
  title: string
  user: User
}

function Navbar({ title, user }: NavbarProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const triggerSize = useSize(ref)

  return (
    <Flex
      bg={'white'}
      flexShrink={0}
      zIndex={1}
      h='58px'
      alignItems='center'
      justifyContent='space-between'
      px='8'
      w='full'
      borderBottom='1px solid'
      borderColor='gray.100'
    >
      <Heading color='gray.600' fontWeight={600} fontSize='2xl'>
        {title}
      </Heading>
      <Popover placement='bottom-end'>
        <PopoverTrigger>
          <Button variant='unstyled' ref={ref} tabIndex={0}>
            <Flex alignItems='center'>
              <Avatar boxSize='9' mr='3' name={user.name} />
              <VStack align='start' spacing={0}>
                <Heading size='sm' color='gray.600' fontWeight={500}>
                  Petshop <chakra.span fontWeight={800}>AuAu</chakra.span>
                </Heading>
                <Text fontSize='sm' fontWeight={500}>
                  {user.isAdmin && 'Gerente'}
                  {!user.isAdmin && user.type === 'customer' && 'Cliente'}
                  {!user.isAdmin && user.type === 'worker' && 'Funcionário'}
                  &nbsp;
                  {user.name}
                </Text>
              </VStack>
              <Flex ml='3'>
                <ChevronDown width='28px' height='28px' />
              </Flex>
            </Flex>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          _focus={{}}
          _focusVisible={{ outline: 'none' }}
          borderTopLeftRadius='0'
          borderTopRightRadius='0'
          width={triggerSize?.width}
          mt='px'
          borderTop='none'
          borderColor='gray.100'
          boxShadow='sm'
        >
          <PopoverArrow boxShadow='-1px -1px 0px 0px #DBDBDB' />
          <PopoverBody>
            <Link
              as={RouterLink}
              href='/logout'
              color='red'
              _focusVisible={{ textDecoration: 'underline' }}
            >
              <Flex p='1'>
                <LogOutIcon height='24px' width='24px' />
                <Text ml='2'>Sair</Text>
              </Flex>
            </Link>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default Navbar
