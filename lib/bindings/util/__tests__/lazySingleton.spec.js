jest.unmock('../lazySingleton')

describe('lazySingleton', () => {
  it('should call factory only once on first call', () => {
    const lazySingleton = require('../lazySingleton')

    const mockFactory = jest.fn()

    const useFactory = lazySingleton(mockFactory)
    expect(mockFactory).toHaveBeenCalledTimes(0)

    useFactory()
    useFactory()
    useFactory()
    useFactory()
    useFactory()
    expect(mockFactory).toHaveBeenCalledTimes(1)
  })

  it('should always return the same instance', () => {
    const lazySingleton = require('../lazySingleton')

    const fakeInstance = {}
    const mockFactory = jest.fn(() => fakeInstance)

    const useFactory = lazySingleton(mockFactory)

    const instance1 = useFactory()
    const instance2 = useFactory()
    const instance3 = useFactory()

    expect(instance1).toBe(instance2)
    expect(instance2).toBe(instance3)
    expect(instance3).toBe(fakeInstance)
  })

  it('should pass through any arguments to the factory', () => {
    const lazySingleton = require('../lazySingleton')

    const mockFactory = jest.fn()

    const useFactory = lazySingleton(mockFactory)

    const args = [1, 'a', NaN, undefined, true, {}]

    useFactory(...args)
    expect(mockFactory).toBeCalledWith(...args)
  })
})
