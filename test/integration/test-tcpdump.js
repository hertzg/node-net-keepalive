const Assert = require('assert'),
  OS = require('os'),
  Net = require('net'),
  Lib = require('../../lib'),
  ChildProcess = require('child_process')

const findFirstInterfaceWithInternalAddress = () => {
  return Object.entries(OS.networkInterfaces()).find(([, iface]) =>
    iface.some((addr) => addr.internal)
  )
}

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

const calculateTimeouts = (initialDelay, interval, probes) => {
  const tcpDumpTimeout = Math.floor((interval * probes + initialDelay) * 1.5)
  return {
    tcpDumpTimeout,
    testTimeout: tcpDumpTimeout + 5000,
  }
}

const tcpDumpOnlyKeepalive = (iface, packets, ports, timeout, done) => {
  const args = [
    '-pnSl',
    '-c',
    packets,
    '-i',
    iface,
    `(${ports
      .map((port) => `port ${port}`)
      .join(
        ' or '
      )}) and ( tcp[tcpflags] & tcp-ack != 0 and ( (ip[2:2] - ((ip[0]&0xf)<<2) ) - ((tcp[12]&0xf0)>>2) ) == 0 ) `,
  ]
  console.log(`waiting ${timeout / 1000}s for: \$ tcpdump ${args.join(' ')}`)

  const p = ChildProcess.spawn('tcpdump', args, {
    timeout,
    stdio: ['ignore', 'inherit', 'pipe'],
  })
  p.stderr.pipe(process.stderr)
  const stderr = collectChunks(p.stderr)

  let finished = false
  const finish = (...args) => {
    if (finished) return
    done(...args)
  }

  p.once('error', (err) => {
    finish(err)
    p.kill()
  })
  p.once('exit', (code, signal) => {
    finish(null, {
      stderr: Buffer.concat(stderr),
      status: code,
      signal,
    })
  })
}

const collectChunks = (stream) => {
  const chunks = []
  stream.on('data', (chunk) => chunks.push(chunk))
  return chunks
}

describe('tcp-dump', () => {
  it('should send keepalive packets on the wire', function (done) {
    const srv = Net.createServer()
    srv.listen(0, () => {
      const socket = Net.createConnection(srv.address(), () => {
        const initialDelay = 1000
        socket.setKeepAlive(true, initialDelay)

        const sysDefaultInterval = Lib.getKeepAliveInterval(socket)
        const interval =
          nextInRageExcept(1, 3, 1, ~~(sysDefaultInterval / 1000)) * 1000
        Assert.notStrictEqual(sysDefaultInterval, interval)
        Lib.setKeepAliveInterval(socket, interval)
        const actualInterval = Lib.getKeepAliveInterval(socket)
        Assert.strictEqual(actualInterval, interval)
        Assert.notStrictEqual(actualInterval, sysDefaultInterval)

        const sysDefaultProbes = Lib.getKeepAliveProbes(socket)
        const probes = nextInRageExcept(3, 5, 1, sysDefaultProbes)
        Lib.setKeepAliveProbes(socket, probes)
        const actualProbes = Lib.getKeepAliveProbes(socket)
        Assert.strictEqual(actualProbes, probes)
        Assert.notStrictEqual(actualProbes, sysDefaultProbes)

        const internalIface = findFirstInterfaceWithInternalAddress()
        if (!internalIface) {
          console.log(
            'Skip: could not detect internal (loopback) interface name'
          )
          this.skip()
          return
        }

        const [ifaceName] = internalIface
        Assert.ok(ifaceName)

        const { tcpDumpTimeout, testTimeout } = calculateTimeouts(
          initialDelay,
          interval,
          probes
        )
        this.timeout(testTimeout)

        tcpDumpOnlyKeepalive(
          ifaceName,
          10,
          [srv.address().port, socket.address().port],
          tcpDumpTimeout,
          (error, { stderr, status }) => {
            Assert.ifError(error)
            if (status !== 0) {
              console.error(stderr.toString('utf8'))
              if (
                stderr
                  .toString('utf8')
                  .includes(
                    "You don't have permission to capture on that device"
                  )
              ) {
                this.skip()
                return
              }
            }

            Assert.strictEqual(
              status,
              0,
              'tcpdump exited with non zero exit code'
            )
            socket.destroy()
            srv.close(done)
          }
        )
      })
    })
  })
})
