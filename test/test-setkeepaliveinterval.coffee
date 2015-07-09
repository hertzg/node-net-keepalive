Should = require 'should'
Stream = require 'stream'
Net = require 'net'
Lib = require '../lib'

describe 'setKeepAliveInterval', ->
  it 'should be a function', ->
    Lib.setKeepAliveInterval.should.be.type('function')

  it 'should require two arguments', ->
    errorMessage = 'setKeepAliveInterval requires two arguments'
    (->
      Lib.setKeepAliveInterval()
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveInterval ''
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveInterval '', '', ''
    ).should.throw errorMessage

  it 'should require first argument to be an instance of net.Socket', ->
    errorMessage = 'setKeepAliveInterval expects an instance of socket as its
      first argument'
    (->
      socket = null
      Lib.setKeepAliveInterval socket, 1
    ).should.throw errorMessage
    (->
      socket = {}
      Lib.setKeepAliveInterval socket, 1
    ).should.throw errorMessage
    (->
      socket = new (->)
      Lib.setKeepAliveInterval socket, 1
    ).should.throw errorMessage
    (->
      socket = new Stream.PassThrough
      Lib.setKeepAliveInterval socket, 1
    ).should.throw errorMessage

  it 'should require second argument to be a number', ->
    errorMessage = 'setKeepAliveInterval requires msec to be a Number'
    socket = new Net.Socket
    (->
      Lib.setKeepAliveInterval socket, null
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveInterval socket, ''
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveInterval socket, true
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveInterval socket, {}
    ).should.throw errorMessage

  it 'should throw when fd is missing', ->
    errorMessage = 'Unable to get socket fd'
    socket = new Net.Socket
    (->
      Lib.setKeepAliveInterval socket, 1
    ).should.throw errorMessage

  it 'should throw when setsockopt returns -1', (done) ->
    errorMessage = "setsockopt EINVAL"
    socket = null
    Net.createServer().listen 0, ->
      addr = @address()
      self = this
      socket = Net.createConnection addr, ->
        (->
          Lib.setKeepAliveInterval socket, -1
        ).should.throw errorMessage
        socket.destroy()
        self.close()
        done()

  it 'should be able to set 1 second delay', (done) ->
    errorMessage = 'Unable to get socket fd'
    socket = null
    Net.createServer().listen 0, ->
      addr = @address()
      self = this
      socket = Net.createConnection addr, ->
        (->
          Lib.setKeepAliveInterval socket, 1000
        ).should.not.throw()
        socket.destroy()
        self.close()
        done()