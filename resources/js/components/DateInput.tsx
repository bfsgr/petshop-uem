import { Input, type InputProps } from '@chakra-ui/react'
import { type ChangeEvent, forwardRef, type Ref } from 'react'

interface DateInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Date | null
  onChange: (value: Date | null) => void
}

function DateInput(
  { value, onChange }: DateInputProps,
  ref: Ref<HTMLInputElement> | null
) {
  const currentDate = value ? value.toISOString().split('T')[0] : ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)

    if (isNaN(date.getTime())) {
      onChange(null)
      return
    }

    onChange(date)
  }

  return (
    <Input ref={ref} type='date' value={currentDate} onChange={handleChange} />
  )
}

export default forwardRef(DateInput)
