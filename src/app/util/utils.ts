export const centsToDollarString = (cents: number) => {
  const dollars = cents / 100
  const negative = cents < 0 ? '-' : ''
  const strDollars =
    negative +
    '$' +
    Math.abs(dollars).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  return strDollars
}
