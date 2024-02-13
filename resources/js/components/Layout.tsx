import { Link as RouterLink } from '@inertiajs/react'
import { type ReactNode } from 'react'
import {
  Box,
  Text,
  Link,
  Flex,
  useBreakpointValue,
  Tooltip,
} from '@chakra-ui/react'
import { Briefcase, CalendarIcon, PawPrintIcon, UserIcon } from 'lucide-react'
import Navbar from './Navbar.tsx'
import { type User } from '../@types/User.ts'

interface SideBarButtonsProps {
  href: string
  text: string
  icon: ReactNode
}

function SideBarButton({ href, text, icon }: SideBarButtonsProps) {
  const pathname = window.location.pathname

  const selected = pathname.includes(href)

  const showText = useBreakpointValue({ base: false, md: true })

  return (
    <Tooltip label={text} placement='right-end' hasArrow isDisabled={showText}>
      <Link
        as={RouterLink}
        href={href}
        gap='2'
        fontSize='lg'
        color={selected ? 'blue.500' : 'gray.500'}
        w='full'
        textAlign='start'
        fontWeight={600}
        display='flex'
        alignItems='center'
        justifyContent='start'
      >
        <Box sx={{ svg: { stroke: selected ? 'blue.500' : 'gray.500' } }}>
          {icon}
        </Box>
        {showText && <Text>{text}</Text>}
      </Link>
    </Tooltip>
  )
}

interface LayoutProps {
  title: string
  children: ReactNode
  user: User
}

function Layout({ title, children, user }: LayoutProps) {
  const openSideBar = useBreakpointValue({ base: false, md: true })

  return (
    <Flex minH='100vh' maxH='100vh' alignItems='stretch'>
      <Flex
        gap='4'
        w={openSideBar ? '250px' : '60px'}
        direction='column'
        borderRight='1px solid'
        borderColor='gray.100'
        px='4'
        py='8'
      >
        <SideBarButton href='/home' text='Histórico' icon={<CalendarIcon />} />
        <SideBarButton href='/pets' text='Pets' icon={<PawPrintIcon />} />
        {user.type === 'App\\Models\\Worker' && (
          <SideBarButton href='/clientes' text='Clientes' icon={<UserIcon />} />
        )}
        {user.isAdmin && (
          <SideBarButton
            href='/funcionarios'
            text='Funcionários'
            icon={<Briefcase />}
          />
        )}
      </Flex>
      <Flex direction='column' w='full' overflow={'auto'}>
        <Navbar user={user} title={title} />
        <Flex
          as='main'
          direction='column'
          overflow='auto'
          bg='gray.50'
          h='full'
          px={8}
          py={6}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Layout
