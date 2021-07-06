jest.disableAutomock()

const { onlyOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')

onlyOnPlatforms('win32')
describe('[win32] TCP_KEEPCNT', () => {
  it(
    'should not do anything and return undefined',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)
      const Lib = require('../../lib')

      expect(() => Lib.setKeepAliveProbes(client, 5)).not.toThrow()
      expect(() => Lib.getKeepAliveProbes(client)).not.toThrow()
      expect(Lib.setKeepAliveProbes(client, 5)).toBeUndefined()
      expect(Lib.getKeepAliveProbes(client)).toBeUndefined()
    })
  )
})
