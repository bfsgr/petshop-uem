import { type ComponentStyleConfig } from '@chakra-ui/react'

const Button: ComponentStyleConfig = {
  baseStyle: ({ colorScheme }) => ({
    borderRadius: 'sm',
    _focusVisible: {
      outline: '2px solid',
      outlineColor: `${colorScheme}.500`,
      boxShadow: 'none',
    },
  }),
  variants: {},
  defaultProps: {},
}

export default Button
