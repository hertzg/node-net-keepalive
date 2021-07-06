jest.disableAutomock()

const { onlyOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')

onlyOnPlatforms('win32')
describe('[win32] TCP_USER_TIMEOUT', () => {
  it(
    'should always return false or undefined',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)
      const Lib = require('../../lib')

      expect(() => Lib.setUserTimeout(client, 5000)).not.toThrow()
      expect(() => Lib.getUserTimeout(client)).not.toThrow()
      expect(Lib.setUserTimeout(client, 5000)).toBe(false)
      expect(Lib.getUserTimeout(client)).toBeUndefined()
    })
  )
})
