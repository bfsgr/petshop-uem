import { HStack, Input, type InputProps } from '@chakra-ui/react'
import {
  type ChangeEvent,
  forwardRef,
  type Ref,
  useEffect,
  useState,
} from 'react'
import { Select } from 'chakra-react-select'
import { format, parseISO, set } from 'date-fns'

interface DateInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Date | null
  onChange: (value: Date | null) => void
}

const Times = [
  { label: '08:00', value: '05:00' },
  { label: '08:30', value: '08:30' },
  { label: '09:00', value: '09:00' },
  { label: '09:30', value: '09:30' },
  { label: '10:00', value: '10:00' },
  { label: '10:30', value: '10:30' },
  { label: '11:00', value: '11:00' },
  { label: '11:30', value: '11:30' },
  { label: '12:00', value: '12:00' },
  { label: '12:30', value: '12:30' },
  { label: '13:00', value: '13:00' },
  { label: '13:30', value: '13:30' },
  { label: '14:00', value: '14:00' },
  { label: '14:30', value: '14:30' },
  { label: '15:00', value: '15:00' },
  { label: '15:30', value: '15:30' },
  { label: '16:00', value: '16:00' },
  { label: '16:30', value: '16:30' },
  { label: '17:00', value: '17:00' },
  { label: '17:30', value: '17:30' },
  { label: '18:00', value: '18:00' },
]

function InternalDateTimeInput(
  { value, onChange }: DateInputProps,
  ref: Ref<HTMLInputElement> | null
) {
  const [internalDate, setInternalDate] = useState(value)
  const [internalTime, setInternalTime] = useState(
    value !== null ? format(value, 'HH:mm') : null
  )

  const currentDate = internalDate
    ? internalDate.toISOString().split('T')[0]
    : ''

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = parseISO(e.target.value)

    if (isNaN(date.getTime())) {
      setInternalDate(null)
    }

    setInternalDate(date)
  }

  const handleTimeChange = (time: string) => {
    if (internalDate === null) {
      return
    }

    setInternalTime(time)
  }

  useEffect(() => {
    if (internalDate !== null && internalTime !== null) {
      const [hours, minutes] = internalTime.split(':')
      const newDate = set(internalDate, {
        hours: parseInt(hours),
        minutes: parseInt(minutes),
      })

      onChange(newDate)
    }
  }, [internalDate, internalTime])

  return (
    <HStack>
      <Input
        ref={ref}
        type='date'
        value={currentDate}
        onChange={handleDateChange}
        w='fit-content'
      />
      <Select
        placeholder='Hora'
        onChange={(option) => {
          if (option) {
            handleTimeChange(option.value)
          }
        }}
        value={
          value !== null
            ? Times.find((time) => time.value === format(value, 'HH:mm'))
            : null
        }
        options={Times}
      />
    </HStack>
  )
}

const DateTimeInput = forwardRef(InternalDateTimeInput)

export default DateTimeInput
