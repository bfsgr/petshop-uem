export const formatCpfPartials = (text?: string): string => {
  if (text === undefined) return ''

  const onlyNumbers = text.replace(/\D/g, '').slice(0, 11)
  const length = onlyNumbers.length

  switch (true) {
    case length === 11: {
      return onlyNumbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    case length > 9: {
      return onlyNumbers.replace(/^(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4')
    }
    case length > 6: {
      return onlyNumbers.replace(/^(\d{3})(\d{3})(\d)/, '$1.$2.$3')
    }
    case length > 3: {
      return onlyNumbers.replace(/^(\d{3})(\d)/, '$1.$2')
    }
    default: {
      return onlyNumbers
    }
  }
}

export function isValidCPF(cpf: string) {
  if (/^(.)\1*$/.test(cpf)) return false

  const digits = cpf.split('')
  const validator = digits
    .filter((digit, index, array) => index >= array.length - 2 && digit)
    .map((el) => +el)
  const toValidate = (pop: number) =>
    digits
      .filter((digit, index, array) => index < array.length - pop && digit)
      .map((el) => +el)
  const rest = (count: number, pop: number) =>
    ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
      10) %
      11) %
    10
  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1])
}
