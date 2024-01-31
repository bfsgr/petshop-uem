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
} from '@chakra-ui/react'
import { Link as RouterLink } from '@inertiajs/react'
import { useSize } from '@chakra-ui/react-use-size'
import { useRef } from 'react'
import { ChevronDown, LogOutIcon } from 'lucide-react'

interface NavbarProps {
  title: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

function Navbar({ title, user }: NavbarProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const triggerSize = useSize(ref)

  function logout() {}

  return (
    <Flex
      flexShrink={0}
      zIndex={1}
      h='58px'
      alignItems='center'
      justifyContent='space-between'
      px='8'
      w='full'
      boxShadow='0px 4px 4px 0px #00000040;'
    >
      <Heading color='gray.600' fontWeight={600} fontSize='2xl'>
        {title}
      </Heading>
      <Popover placement='bottom-end'>
        <PopoverTrigger>
          <Link ref={ref}>
            <Flex alignItems='center'>
              <Avatar boxSize='10' mr='3' name={user.name} />
              <VStack align='start' spacing={0}>
                <Heading size='sm' color='gray.600' fontWeight={600}>
                  Petshop <chakra.span fontWeight={800}>AuAu</chakra.span>
                </Heading>
                <Text>
                  {user.role} {user.name}
                </Text>
              </VStack>
              <ChevronDown width='32px' height='32px' />
            </Flex>
          </Link>
        </PopoverTrigger>
        <PopoverContent
          _focus={{}}
          _focusVisible={{ outline: 'none' }}
          borderTopLeftRadius='0'
          borderTopRightRadius='0'
          width={triggerSize?.width}
          border='none'
          boxShadow='0px 4px 4px 0px #00000040;'
        >
          <PopoverArrow />
          <PopoverBody>
            <Link as={RouterLink} href='/login' color='red' onClick={logout}>
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
