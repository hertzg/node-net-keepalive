jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const { skipOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

skipOnPlatforms('win32')
describe('TCP_KEEPCNT', () => {
  it(
    'should set probes different from system default',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)
      const Lib = require('../../lib')
      const sysDefaultProbes = Lib.getKeepAliveProbes(client)
      const probes = nextInRangeExcept(3, 5, 1, sysDefaultProbes)

      Lib.setKeepAliveProbes(client, probes)
      const actualProbes = Lib.getKeepAliveProbes(client)
      expect(actualProbes).toBe(probes)
      expect(actualProbes).not.toBe(sysDefaultProbes)
    })
  )
})
