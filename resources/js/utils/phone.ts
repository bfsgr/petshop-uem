export function formatPhone(input?: string | null): string {
  if (input === undefined || input === null) {
    return ''
  }

  const onlyNumbers = input.replace(/\D/g, '').slice(0, 11)
  const length = onlyNumbers.length

  switch (true) {
    case length === 11: {
      return onlyNumbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    case length === 10: {
      return onlyNumbers.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    case length > 6: {
      return onlyNumbers.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3')
    }
    case length > 3: {
      return onlyNumbers.replace(/^(\d{2})(\d)/, '($1) $2')
    }
    case length === 3: {
      return onlyNumbers.replace(/^(\d{2})/, '($1) ')
    }
    default: {
      return onlyNumbers
    }
  }
}
