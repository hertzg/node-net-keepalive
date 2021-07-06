const throwIfError = require('../throwIfError')
jest.unmock('../throwIfError')

describe('throwIfError', () => {
  it('should throw the first argument if truthy', () => {
    const fakeError = new Error('some random error')
    expect(() => throwIfError(fakeError)).toThrow(fakeError)
    expect(() => throwIfError('string')).toThrow('string')
    expect(() => throwIfError('')).not.toThrow()
    expect(() => throwIfError(null)).not.toThrow()
    expect(() => throwIfError()).not.toThrow()
  })

  it('should only return true on zero', () => {
    expect(throwIfError(0)).toBe(true)
    expect(throwIfError('')).toBe(false)
    expect(throwIfError(undefined)).toBe(false)
    expect(throwIfError(null)).toBe(false)
    expect(throwIfError(false)).toBe(false)
    expect(() => throwIfError(true)).toThrow()
    expect(() => throwIfError(1)).toThrow()
    expect(() => throwIfError(-1)).toThrow()
    expect(() => throwIfError(999)).toThrow()
  })
})
