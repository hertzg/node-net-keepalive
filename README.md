[![Discuss](http://img.shields.io/badge/discuss-gitter-brightgreen.svg?style=flat)](https://gitter.im/hertzg/node-net-keepalive) [![Build Status](https://travis-ci.org/hertzg/node-net-keepalive.svg?branch=master)](https://travis-ci.org/hertzg/node-net-keepalive) [![Dependency Status](https://gemnasium.com/hertzg/node-net-keepalive.svg)](https://gemnasium.com/hertzg/node-net-keepalive)

# net-keepalive
[![NPM](https://nodei.co/npm/net-keepalive.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/net-keepalive/)[![NPM](https://nodei.co/npm-dl/net-keepalive.png?months=3&height=2)](https://nodei.co/npm/net-keepalive/)

Missing (`TCP_KEEPINTVL` and `TCP_KEEPCNT`) `SO_KEEPALIVE` socket option setters for Node using [`ffi`](https://www.npmjs.com/package/ffi) module. Tested on `linux`, should work on `osx`.

## Install

```bash
$ npm install --save net-keepalive
```


## Demo
```CoffeeScript
#server.coffee
Net = require 'net'
NetKeepAlive =  require 'net-keepalive'

# Create a TCP Server
srv = Net.createServer (s)->
  console.log 'Connected %j', s.address()
  # Doesn't matter what it does
  s.pipe(s)

# Start on a some port
srv.listen 1337, ->
  console.log 'Listening on %j', srv.address();

# Connect to that server
s = Net.createConnection {port:1337}, ->
  console.log 'Connected to %j', s.address()
  
  # IMPORTANT: KeepAlive must be enabled for this to work
  s.setKeepAlive true, 1000

  # Set TCP_KEEPINTVL for this specific socket
  NetKeepAlive.setKeepAliveInterval s, 1000

  # and TCP_KEEPCNT
  NetKeepAlive.setKeepAliveProbes s, 1
```

Now using `iptables` add rule to drop all `tcp` packets on `INPUT` chain to port `1337`.
```bash
$ iptables -I INPUT -m tcp -p tcp --dport 1337 -j DROP
``` 
If you were monitoring packets on `loopback` with `tcp.srcport == 1337 || tcp.dstport == 1337` filter in `wireshark`.  You will see the following output:

[![Wireshark screenshot KEEPALIVE](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)

Have fun!

More info about `SO_KEEPALIVE` here: [TCP Keepalive HOWTO](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/)
`C` Code examples here: [Examples](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html#examples)

## API

***Note: For these methods to work you must enable `SO_KEEPALIVE` and set the `TCP_KEEPIDLE` options for socket using `Net.Socket`-s built in method [`socket.setKeepAlive([enable][, initialDelay])`](https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay) !***

    TCP_KEEPIDLE (since Linux 2.4) The time (in seconds) the connection needs to remain idle before TCP starts sending keepalive probes, if the socket option SO_KEEPALIVE has been set on this socket. This option should not be used in code intended to be portable.

```CoffeeScript
NetSocket = require 'net-socket'

# .....
# get socket somehow
# .....

enable = true # enable SO_KEEPALIVE
initialDuration = 1000 # start probing after 1 second of inactivity
socket.setKeepAlive(enable, initialDuration) # sets SO_KEEPALIVE and TCP_KEEPIDLE

probeInterval = 1000 # after initialDuration send probes every 1 second
NetSocket.setKeepAliveInterval(socket, probeInterval) #sets TCP_KEEPINTVL

maxProbesBeforeFail = 10 # after 10 failed probes connection will be dropped 
NetSocket.setKeepAliveProbes(socket, maxProbesBeforeFail) #sets TCP_KEEPCNT

# ....
# ....
```

### setKeepAliveInterval(socket, msecs)
* `socket` - `instanceof Net.Socket`- Socket to modify
* `msecs` - `Number` - Time in milliseconds between KeepAlive probes.
* Returns `true` on success

Sets `TCP_KEEPINTVL` to `msecs` miliseconds (converted to seconds `int` internally) for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPINTVL (since Linux 2.4) The time (in seconds) between individual keepalive probes. This option should not be used in code intended to be portable.

### setKeepAliveProbes(socket, count) 
* `socket` - `instanceof Net.Socket`- Socket to modify
* `count` - `Number` - Number of probes to send before dropping the connection
* Returns `true` on success

Sets `TCP_KEEPCNT` to `count` number of probes for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPCNT (since Linux 2.4) - The maximum number of keepalive probes TCP should send before dropping the connection. This option should not be used in code intended to be portable.
