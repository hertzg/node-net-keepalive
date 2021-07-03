const {skipSuiteOnWindows, skipSuiteOnMacOs} = require('../helpers')
const {withKeepAliveSocket} = require('./utils/withKeepAliveSocket')
const {waitForKeepAlivePackets, calculateTimeout} = require('./utils/tcpDump')
const {loopbackInterface} = require('./utils/loopbackInterface')

jest.unmock('../helpers')
jest.unmock('./utils/withKeepAliveSocket')
jest.unmock('./utils/tcpDump')
jest.unmock('./utils/loopbackInterface')
jest.deepUnmock('../../lib')

const INITIAL_DELAY = 1000
const KEEPALIVE_PACKET_COUNT = 10

describe('tcp-dump', () => {
  skipSuiteOnWindows()
  skipSuiteOnMacOs()

  const TCPDUMP_TIMEOUT = calculateTimeout(INITIAL_DELAY, 1000, 5)

  it(
    'should send 5 probes every 1000ms',
    withKeepAliveSocket(
      ({server, socket}, done) => {
        const Lib = require('../../lib')
        const [LOOPBACK_IFACE_NAME] = loopbackInterface()
        if (!LOOPBACK_IFACE_NAME) {
          throw new Error('Could not auto detect internal (loopback) interface')
        }

        Lib.setKeepAliveProbes(socket, 5)
        Lib.setKeepAliveInterval(socket, 1000)

        const SOCKET_PORTS = [server.address().port, socket.address().port]

        waitForKeepAlivePackets(
          LOOPBACK_IFACE_NAME,
          KEEPALIVE_PACKET_COUNT,
          SOCKET_PORTS,
          TCPDUMP_TIMEOUT,
          (error, {stderr, status}) => {
            expect(error).toBeFalsy()

            if (status !== 0) {
              console.error(`tcpdump stderr: ${stderr.toString('utf8')}`)
            }
            expect(status).toBe(0)
            done()
          }
        )
      },
      {initialDelay: INITIAL_DELAY}
    ),
    TCPDUMP_TIMEOUT + 5000
  )
})
