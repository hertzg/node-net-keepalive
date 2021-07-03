const nextInRageExcept = (min, max, step, except) => {
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
  nextInRageExcept,
}
