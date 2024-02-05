import { type ComponentStyleConfig } from '@chakra-ui/react'

const Link: ComponentStyleConfig = {
  baseStyle: ({ colorScheme }) => ({
    borderRadius: 'lg',
    _focusVisible: {
      textDecoration: 'underline',
      textDecorationColor: `${colorScheme}.500`,
      outline: 'none',
      boxShadow: 'none',
    },
  }),
  variants: {},
  defaultProps: {},
}

export default Link
