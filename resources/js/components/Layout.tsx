import { Link as RouterLink, router } from '@inertiajs/react'
import { type ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Link,
  Text,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Briefcase, CalendarIcon, PawPrintIcon, UserIcon } from 'lucide-react'
import Navbar from './Navbar.tsx'
import { type User } from '../@types/User.ts'

interface SideBarButtonsProps {
  href: string
  text: string
  icon: ReactNode
  showText: boolean
}

function SideBarButton({ href, text, icon, showText }: SideBarButtonsProps) {
  const pathname = window.location.pathname

  const selected = pathname.includes(href)

  return (
    <Tooltip label={text} placement='right-end' hasArrow isDisabled={showText}>
      <Link
        as={RouterLink}
        href={href}
        gap='2'
        fontSize='lg'
        color={selected ? 'blue.500' : 'gray.500'}
        w='full'
        h='7'
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
  const breakpointForSideBar = useBreakpointValue(
    { base: false, lg: true },
    { fallback: 'invalid' }
  )

  const [shouldOpenSideBar, setShouldOpenSideBar] = useState<boolean>(
    () =>
      breakpointForSideBar ??
      (router.restore('openSideBar') as boolean | undefined) ??
      false
  )

  function getLastSideBarState(): boolean {
    return breakpointForSideBar!
  }

  useEffect(() => {
    return router.on('navigate', () => {
      const state = getLastSideBarState()

      router.remember(state, 'openSideBar')
    })
  }, [getLastSideBarState])

  useEffect(() => {
    if (breakpointForSideBar !== undefined) {
      setShouldOpenSideBar(breakpointForSideBar)
    }
  }, [breakpointForSideBar])

  return (
    <Flex minH='100vh' maxH='100vh' alignItems='stretch'>
      <Flex
        gap='4'
        maxW={shouldOpenSideBar ? '190px' : '60px'}
        minW={shouldOpenSideBar ? '190px' : '60px'}
        transition={'max-width 0.2s, min-width 0.2s'}
        direction='column'
        borderRight='1px solid'
        borderColor='gray.100'
        px='4'
        py='8'
      >
        <SideBarButton
          showText={shouldOpenSideBar}
          href='/home'
          text='Histórico'
          icon={<CalendarIcon />}
        />
        <SideBarButton
          showText={shouldOpenSideBar}
          href='/pets'
          text='Pets'
          icon={<PawPrintIcon />}
        />
        {user.type === 'App\\Models\\Worker' && (
          <SideBarButton
            showText={shouldOpenSideBar}
            href='/clientes'
            text='Clientes'
            icon={<UserIcon />}
          />
        )}
        {user.isAdmin && (
          <SideBarButton
            showText={shouldOpenSideBar}
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
