const { nextInRangeExcept } = require('./nextInRangeExcept')

jest.unmock('./nextInRangeExcept')

it('should give next value in range', () => {
  expect(nextInRangeExcept(1, 10, 1, 5)).toBe(1)
  expect(nextInRangeExcept(1, 10, 5, 5)).toBe(1)
  expect(nextInRangeExcept(1, 10, 1, 10)).toBe(1)
  expect(nextInRangeExcept(1, 10, 1, 1)).toBe(2)
  expect(nextInRangeExcept(1, 10, 5, 1)).toBe(6)
})

it('should throw if wrong range is given', () => {
  expect(() => nextInRangeExcept(100, 0, 1, 5)).toThrow()
  expect(() => nextInRangeExcept(-100, -110, 1, 5)).toThrow()
  expect(() => nextInRangeExcept(1, 5, -1, 5)).toThrow()
})

it('should throw if range is exhausted', () => {
  expect(() => nextInRangeExcept(100, 0, 1, 5)).toThrow()
  expect(() => nextInRangeExcept(1, 1, 1, 1)).toThrow()
  expect(() => nextInRangeExcept(1, 2, 2, 1)).toThrow()
  expect(() => nextInRangeExcept(1, 5, 100, 1)).toThrow()
})
