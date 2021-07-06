jest.disableAutomock()

const { onlyOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')

onlyOnPlatforms('win32')
describe('[win32] TCP_KEEPINTVL', () => {
  it(
    'should not do anything and return undefined',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)
      const Lib = require('../../lib')

      expect(() => Lib.setKeepAliveInterval(client, 5000)).not.toThrow()
      expect(() => Lib.getKeepAliveInterval(client)).not.toThrow()
      expect(Lib.setKeepAliveInterval(client, 5000)).toBe(false)
      expect(Lib.getKeepAliveInterval(client)).toBeUndefined()
    })
  )
})
