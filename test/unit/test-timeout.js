const Stream = require('stream')
const Should = require('should')
const OS = require('os')
const Net = require('net')
const Lib = require('../../lib')

describe('TCP User Timeout', () => {
  const itSkipOS = (skipOs, ...args) =>
    (skipOs.includes(OS.platform()) ? it.skip : it)(...args)

  const itOnlyOS = (onlyOs, ...args) =>
    (onlyOs.includes(OS.platform()) ? it : it.skip)(...args)

  it('should be a function', function () {
    Lib.setUserTimeout.should.be.type('function')
  })

  itSkipOS(
    ['freebsd'],'should validate passed arguments', function () {
    ;(() => Lib.setUserTimeout()).should.throw(
      'setUserTimeout requires two arguments'
    )
    ;(() => Lib.setUserTimeout('')).should.throw(
      'setUserTimeout requires two arguments'
    )
    ;(() => Lib.setUserTimeout('', '', '')).should.throw(
      'setUserTimeout requires two arguments'
    )
    ;(() => Lib.setUserTimeout(null, 1)).should.throw(
      'setUserTimeout expects an instance of socket as its first argument'
    )
    ;(() => Lib.setUserTimeout({}, 1)).should.throw(
      'setUserTimeout expects an instance of socket as its first argument'
    )
    ;(() => Lib.setUserTimeout(new (class {})(), 1)).should.throw(
      'setUserTimeout expects an instance of socket as its first argument'
    )
    ;(() => Lib.setUserTimeout(new Stream.PassThrough(), 1)).should.throw(
      'setUserTimeout expects an instance of socket as its first argument'
    )

    const socket = new Net.Socket()
    ;(() => Lib.setUserTimeout(socket, null)).should.throw(
      'setUserTimeout requires msec to be a Number'
    )
    ;(() => Lib.setUserTimeout(socket, '')).should.throw(
      'setUserTimeout requires msec to be a Number'
    )
    ;(() => Lib.setUserTimeout(socket, true)).should.throw(
      'setUserTimeout requires msec to be a Number'
    )
    ;(() => Lib.setUserTimeout(socket, {})).should.throw(
      'setUserTimeout requires msec to be a Number'
    )
  })

  itOnlyOS(['win32'], 'should be no-op returning false on win32', (done) => {
    const srv = Net.createServer()
    srv.listen(0, () => {
      const socket = Net.createConnection(srv.address(), () => {
        ;(() => Lib.setUserTimeout(socket, -1)).should.not.throw()
        Should(Lib.setUserTimeout(socket, -1)).be.false()
        socket.destroy()
        srv.close(done)
      })
    })
  })

  itSkipOS(
    ['freebsd', 'win32'],
    'should throw when setsockopt returns -1',
    (done) => {
      const srv = Net.createServer()
      srv.listen(0, () => {
        const socket = Net.createConnection(srv.address(), () => {
          ;(() => Lib.setUserTimeout(socket, -1)).should.throw(
            /^setsockopt /i
          )
          socket.destroy()
          srv.close(done)
        })
      })
    }
  )

  itSkipOS(['freebsd', 'win32'], 'should be able to set and get 4 second value', (done) => {
    const srv = Net.createServer()
    srv.listen(0, () => {
      const expected = 4000

      const socket = Net.createConnection(srv.address(), () => {
        ;(() => {
          Lib.setUserTimeout(socket, expected)
        }).should.not.throw()

        let actual
        ;(() => {
          actual = Lib.getUserTimeout(socket)
        }).should.not.throw()

        expected.should.eql(actual)

        socket.destroy()
        srv.close(done)
      })
    })
  })

  itSkipOS(['freebsd', 'win32'], 'should throw when trying to get using invalid fd', (done) => {
    ;(() => Lib.setUserTimeout(new Net.Socket(), 1)).should.throw(
      'Unable to get socket fd'
    )

    const srv = Net.createServer()
    srv.listen(0, function () {
      const socket = Net.createConnection(this.address(), () => {
        const oldHandle = socket._handle

        socket._handle = { fd: -99999 }
        ;(() => Lib.getUserTimeout(socket)).should.throw(
          'getsockopt EBADF'
        )

        socket._handle = oldHandle
        socket.destroy()
        srv.close(done)
      })
    })
  })
})
