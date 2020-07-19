const Stream = require('stream')
const Should = require('should')
const OS = require('os')
const Net = require('net')
const Lib = require('../../lib')

describe('keep-alive interval', () => {
  const itSkipOS = (skipOs, ...args) =>
    (skipOs.includes(OS.platform()) ? it.skip : it)(...args)

  it('should be a function', function () {
    Lib.setKeepAliveInterval.should.be.type('function')
  })

  it('should validate passed arguments', function () {
    ;(() => Lib.setKeepAliveInterval()).should.throw(
      'setKeepAliveInterval requires two arguments'
    )
    ;(() => Lib.setKeepAliveInterval('')).should.throw(
      'setKeepAliveInterval requires two arguments'
    )
    ;(() => Lib.setKeepAliveInterval('', '', '')).should.throw(
      'setKeepAliveInterval requires two arguments'
    )
    ;(() => Lib.setKeepAliveInterval(null, 1)).should.throw(
      'setKeepAliveInterval expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveInterval({}, 1)).should.throw(
      'setKeepAliveInterval expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveInterval(new (class {})(), 1)).should.throw(
      'setKeepAliveInterval expects an instance of socket as its first argument'
    )
    ;(() => Lib.setKeepAliveInterval(new Stream.PassThrough(), 1)).should.throw(
      'setKeepAliveInterval expects an instance of socket as its first argument'
    )

    const socket = new Net.Socket()
    ;(() => Lib.setKeepAliveInterval(socket, null)).should.throw(
      'setKeepAliveInterval requires msec to be a Number'
    )
    ;(() => Lib.setKeepAliveInterval(socket, '')).should.throw(
      'setKeepAliveInterval requires msec to be a Number'
    )
    ;(() => Lib.setKeepAliveInterval(socket, true)).should.throw(
      'setKeepAliveInterval requires msec to be a Number'
    )
    ;(() => Lib.setKeepAliveInterval(socket, {})).should.throw(
      'setKeepAliveInterval requires msec to be a Number'
    )
  })

  itSkipOS(
    ['darwin', 'freebsd'],
    'should throw when setsockopt returns -1',
    (done) => {
      const srv = Net.createServer()
      srv.listen(0, () => {
        const socket = Net.createConnection(srv.address(), () => {
          ;(() => Lib.setKeepAliveInterval(socket, -1)).should.throw(
            /^setsockopt /i
          )
          socket.destroy()
          srv.close(done)
        })
      })
    }
  )

  it('should be able to set and get 4 second delay', (done) => {
    const srv = Net.createServer()
    srv.listen(0, () => {
      const expected = 4000

      const socket = Net.createConnection(srv.address(), () => {
        ;(() => {
          Lib.setKeepAliveInterval(socket, expected)
        }).should.not.throw()

        let actual
        ;(() => {
          actual = Lib.getKeepAliveInterval(socket)
        }).should.not.throw()

        expected.should.eql(actual)

        socket.destroy()
        srv.close(done)
      })
    })
  })

  it('should throw when trying to get using invalid fd', function (done) {
    ;(() => Lib.setKeepAliveInterval(new Net.Socket(), 1)).should.throw(
      'Unable to get socket fd'
    )

    const srv = Net.createServer()
    srv.listen(0, function () {
      const socket = Net.createConnection(this.address(), () => {
        const oldHandle = socket._handle

        socket._handle = { fd: -99999 }
        ;(() => Lib.getKeepAliveInterval(socket)).should.throw(
          'getsockopt EBADF'
        )

        socket._handle = oldHandle
        socket.destroy()
        srv.close(done)
      })
    })
  })
})
