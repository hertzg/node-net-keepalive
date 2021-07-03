const nextInRangeExcept = (min, max, step, except) => {
  if (min >= max || step === 0) {
    throw new TypeError('Invalid arguments')
  }

  let value = min
  while (value === except) {
    value += step
    if (value >= max) {
      throw new Error(
        `exhausted ${min}-${max} range finding next number excluding ${except}`
      )
    }
  }
  return value
}

module.exports = {
  nextInRangeExcept,
}
