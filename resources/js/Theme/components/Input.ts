import {
  createMultiStyleConfigHelpers,
  cssVar,
  type ComponentStyleConfig,
} from '@chakra-ui/react'

import { getColorVar, mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'addon',
  'field',
  'element',
  'group',
])

const $borderRadius = cssVar('input-border-radius')

const size = {
  lg: {
    [$borderRadius.variable]: 'radii.lg',
  },
  md: {
    [$borderRadius.variable]: 'radii.lg',
  },
  sm: {
    [$borderRadius.variable]: 'radii.lg',
  },
  xs: {
    [$borderRadius.variable]: 'radii.lg',
  },
}

const Input: ComponentStyleConfig = helpers.defineMultiStyleConfig({
  sizes: {
    lg: helpers.definePartsStyle({
      field: size.lg,
      group: size.lg,
    }),
    md: helpers.definePartsStyle({
      field: size.md,
      group: size.md,
    }),
    sm: helpers.definePartsStyle({
      field: size.sm,
      group: size.sm,
    }),
    xs: helpers.definePartsStyle({
      field: size.xs,
      group: size.xs,
    }),
  },
  variants: {
    outline: (props) => {
      const { focusBorderColor, colorScheme, theme } = props

      const fc =
        focusBorderColor ??
        mode(`${colorScheme}.500`, `${colorScheme}.300`)(props)

      return {
        field: {
          bg: 'white',
          _focusVisible: {
            borderColor: fc,
            boxShadow: `0 0 0 1px ${getColorVar(theme, fc)}`,
          },
        },
      }
    },
    filled: (props) => {
      const { focusBorderColor, colorScheme } = props

      const fc =
        focusBorderColor ??
        mode(`${colorScheme}.500`, `${colorScheme}.300`)(props)

      return {
        field: {
          _focusVisible: {
            borderColor: fc,
          },
        },
      }
    },
    flushed: (props) => {
      const { focusBorderColor, colorScheme, theme } = props

      const fc =
        focusBorderColor ??
        mode(`${colorScheme}.500`, `${colorScheme}.300`)(props)

      return {
        field: {
          _focusVisible: {
            borderColor: fc,
            boxShadow: `0px 1px 0px 0px ${getColorVar(theme, fc)}`,
          },
        },
      }
    },
  },
  defaultProps: {},
})

export default Input
