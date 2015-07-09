Should = require 'should'
Stream = require 'stream'
Net = require 'net'
Lib = require '../lib'

describe 'setKeepAliveProbes', ->
  it 'should be a function', ->
    Lib.setKeepAliveProbes.should.be.type('function')

  it 'should require two arguments', ->
    errorMessage = 'setKeepAliveProbes requires two arguments'
    (->
      Lib.setKeepAliveProbes()
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveProbes ''
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveProbes '', '', ''
    ).should.throw errorMessage

  it 'should require first argument to be an instance of net.Socket', ->
    errorMessage = 'setKeepAliveProbes expects an instance of socket as its
      first argument'
    (->
      socket = null
      Lib.setKeepAliveProbes socket, 1
    ).should.throw errorMessage
    (->
      socket = {}
      Lib.setKeepAliveProbes socket, 1
    ).should.throw errorMessage
    (->
      socket = new (->)
      Lib.setKeepAliveProbes socket, 1
    ).should.throw errorMessage
    (->
      socket = new Stream.PassThrough
      Lib.setKeepAliveProbes socket, 1
    ).should.throw errorMessage

  it 'should require second argument to be a number', ->
    errorMessage = 'setKeepAliveProbes requires cnt to be a Number'
    socket = new Net.Socket
    (->
      Lib.setKeepAliveProbes socket, null
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveProbes socket, ''
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveProbes socket, true
    ).should.throw errorMessage
    (->
      Lib.setKeepAliveProbes socket, {}
    ).should.throw errorMessage

  it 'should throw when fd is missing', ->
    errorMessage = 'Unable to get socket fd'
    socket = new Net.Socket
    (->
      Lib.setKeepAliveProbes socket, 1
    ).should.throw errorMessage

  it 'should throw when setsockopt returns -1', (done) ->
    errorMessage = /^setsockopt /i
    socket = null
    Net.createServer().listen 0, ->
      addr = @address()
      self = this
      socket = Net.createConnection addr, ->
        (->
          Lib.setKeepAliveProbes socket, -1
        ).should.throw errorMessage
        socket.destroy()
        self.close()
        done()

  it 'should be able to set 1 probe threshold', (done) ->
    errorMessage = 'Unable to get socket fd'
    socket = null
    Net.createServer().listen 0, ->
      addr = @address()
      self = this
      socket = Net.createConnection addr, ->
        (->
          Lib.setKeepAliveProbes socket, 1
        ).should.not.throw()
        socket.destroy()
        self.close()
        done()