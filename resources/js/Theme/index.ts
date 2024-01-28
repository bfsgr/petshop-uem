import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultSize,
} from '@chakra-ui/react'
import Button from './components/Button'
import Input from './components/Input'
import borders from './foundations/borders'
import colors from './foundations/colors'
import radii from './foundations/radius'
import shadows from './foundations/shadows'
import typography from './foundations/typography'
import styles from './styles'

const overrides = {
  styles,
  colors,
  borders,
  shadows,
  radii,
  ...typography,
  components: {
    Input,
    Button,
  },
}

export default extendTheme(
  withDefaultColorScheme({ colorScheme: 'blue' }),
  withDefaultSize({ size: 'sm' }),
  overrides
)
