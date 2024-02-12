export function formatPartialCEP(input: string): string {
  if (input === undefined) {
    return input
  }
  const onlyNumbers = input.replace(/\D/g, '').slice(0, 8)

  switch (true) {
    case onlyNumbers.length === 8:
      return onlyNumbers.replace(/^(\d{5})(\d{3})/, '$1-$2')
    case onlyNumbers.length > 5:
      return onlyNumbers.replace(/^(\d{5})(\d)/, '$1-$2')
    default:
      return onlyNumbers
  }
}
