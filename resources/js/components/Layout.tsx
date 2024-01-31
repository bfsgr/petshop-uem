import { Link as RouterLink } from '@inertiajs/react'
import { type ReactNode } from 'react'
import { Box, Text, Link, Flex } from '@chakra-ui/react'
import { CalendarIcon, PawPrintIcon, UserIcon } from 'lucide-react'
import Navbar from './Navbar.tsx'

interface SideBarButtonsProps {
  href: string
  text: string
  icon: ReactNode
}

function SideBarButton({ href, text, icon }: SideBarButtonsProps) {
  const pathname = window.location.pathname

  const selected = pathname.includes(href)

  return (
    <Link
      as={RouterLink}
      href={href}
      gap='2'
      fontSize='lg'
      color={selected ? 'blue.500' : 'gray.500'}
      w='80%'
      textAlign='start'
      mx='auto'
      fontWeight={600}
      display='flex'
      alignItems='center'
      justifyContent='start'
    >
      <Box sx={{ svg: { stroke: selected ? 'blue.500' : 'gray.500' } }}>
        {icon}
      </Box>
      <Text>{text}</Text>
    </Link>
  )
}

interface LayoutProps {
  title: string
  children: ReactNode
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

function Layout({ title, children, user }: LayoutProps) {
  return (
    <Flex minH='100vh' maxH='100vh' alignItems='stretch'>
      <Flex
        gap='4'
        w='250px'
        direction='column'
        boxShadow='0px 4px 10px 0px #00000040;'
        alignItems='center'
        py='8'
      >
        <SideBarButton href='/home' text='Histórico' icon={<CalendarIcon />} />
        <SideBarButton href='/pets' text='Pets' icon={<PawPrintIcon />} />
        <SideBarButton href='/clientes' text='Clientes' icon={<UserIcon />} />
      </Flex>
      <Flex direction='column' w='full'>
        <Navbar user={user} title={title} />
        {children}
      </Flex>
    </Flex>
  )
}

export default Layout
