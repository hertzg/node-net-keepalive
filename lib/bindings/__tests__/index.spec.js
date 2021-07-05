jest.unmock('../index')

describe('bindings', () => {
  it('should try auto-detect current platform', () => {
    const mockPlatform = jest.fn()
    jest.mock('os', () => {
      return {
        platform: mockPlatform,
      }
    })

    const { createPlatform } = require('../index')
    createPlatform()
    expect(mockPlatform).toHaveBeenCalled()
  })

  it('provides linux platform for unknown platform by default', () => {
    jest.dontMock('../platform/linux')

    const { createPlatform } = require('../index')

    expect(createPlatform('potato')).toBeInstanceOf(
      require('../platform/linux')
    )
    jest.doMock('../platform/linux')
  })

  test.each`
    platform     | file
    ${'darwin'}  | ${'../platform/darwin'}
    ${'freebsd'} | ${'../platform/freebsd'}
    ${'linux'}   | ${'../platform/linux'}
    ${'win32'}   | ${'../platform/win32'}
  `('[$platform] implemented by a class from $file', ({ platform, file }) => {
    jest.dontMock(file)
    const { createPlatform } = require('../index')
    expect(createPlatform(platform)).toBeInstanceOf(require(file))
    jest.doMock(file)
  })
})
