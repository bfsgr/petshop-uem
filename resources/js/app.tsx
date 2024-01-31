import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/inter/latin.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import * as yup from 'yup'
import Theme from './Theme'
import { pt } from './yupPt'

async function init() {
  yup.setLocale(pt)

  createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
      return pages[`./Pages/${name}.tsx`]
    },

    setup({ el, App, props }) {
      createRoot(el).render(
        <ChakraProvider
          toastOptions={{
            defaultOptions: {
              duration: 3000,
              isClosable: true,
              position: 'bottom-right',
              containerStyle: {
                fontSize: 'sm',
              },
            },
          }}
          theme={Theme}
        >
          <App {...props} />
        </ChakraProvider>
      )
    },
  }).catch((err) => {
    console.error(err)
  })
}

void init()
