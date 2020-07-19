const Stream = require('stream')
const Should = require('should')
const OS = require('os')
const Net = require('net')
const Lib = require('../lib')

describe('keep-alive probes', () => {
  const itSkipOS = (skipOs, ...args) =>
    (skipOs.includes(OS.platform()) ? it.skip : it)(...args)

  it('should be a function', function () {
    Lib.setKeepAliveProbes.should.be.type('function')
  })

  it('should validate passed arguments', function () {
    ;(() => Lib.setKeepAliveProbes()).should.throw(
      'setKeepAliveProbes requires two arguments'
    )
    ;(() => Lib.setKeepAliveProbes('')).should.throw(
      'setKeepAliveProbes requires two arguments'
    )
    ;(() => Lib.setKeepAliveProbes('', '', '')).should.throw(
      'setKeepAliveProbes requires two arguments'
    )
    ;(() => Lib.setKeepAliveProbes(null, 1)).should.throw(
      'setKeepAliveProbes expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveProbes({}, 1)).should.throw(
      'setKeepAliveProbes expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveProbes(new (class {})(), 1)).should.throw(
      'setKeepAliveProbes expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveProbes(new Stream.PassThrough(), 1)).should.throw(
      'setKeepAliveProbes expects an instance of socket as its first argument'
    )

    const socket = new Net.Socket()
    ;(() => Lib.setKeepAliveProbes(socket, null)).should.throw(
      'setKeepAliveProbes requires cnt to be a Number'
    )
    ;(() => Lib.setKeepAliveProbes(socket, '')).should.throw(
      'setKeepAliveProbes requires cnt to be a Number'
    )
    ;(() => Lib.setKeepAliveProbes(socket, true)).should.throw(
      'setKeepAliveProbes requires cnt to be a Number'
    )
    ;(() => Lib.setKeepAliveProbes(socket, {})).should.throw(
      'setKeepAliveProbes requires cnt to be a Number'
    )
  })

  itSkipOS(
    ['darwin', 'freebsd'],
    'should throw when setsockopt returns -1',
    (done) => {
      const srv = Net.createServer()
      srv.listen(0, () => {
        const socket = Net.createConnection(srv.address(), () => {
          ;(() => Lib.setKeepAliveProbes(socket, -1)).should.throw(
            /^setsockopt /i
          )
          socket.destroy()
          srv.close(done)
        })
      })
    }
  )

  it('should be able to set and get 7 probe threshold', (done) => {
    const srv = Net.createServer()
    srv.listen(0, () => {
      const expected = 7

      const socket = Net.createConnection(srv.address(), () => {
        ;(() => {
          Lib.setKeepAliveProbes(socket, expected)
        }).should.not.throw()

        let actual
        ;(() => {
          actual = Lib.getKeepAliveProbes(socket)
        }).should.not.throw()

        expected.should.eql(actual)

        socket.destroy()
        srv.close(done)
      })
    })
  })

  it('should throw when trying to get using invalid fd', function (done) {
    ;(() => Lib.setKeepAliveProbes(new Net.Socket(), 1)).should.throw(
      'Unable to get socket fd'
    )

    const srv = Net.createServer()
    srv.listen(0, function () {
      const socket = Net.createConnection(this.address(), () => {
        const oldHandle = socket._handle

        socket._handle = { fd: -99999 }
        ;(() => Lib.getKeepAliveProbes(socket)).should.throw(
          'getsockopt EBADF'
        )

        socket._handle = oldHandle
        socket.destroy()
        srv.close(done)
      })
    })
  })
})
