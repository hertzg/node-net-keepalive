[![NPM][npm_shield]][npm_url]
[![Node][node_shield]][node_url]
[![OS][os_shield]][npm_url]
[![Codecov][codecov_shield]][codecov_url]
[![CI][travis_shield]][travis_url]
[![Dependencies][daviddm_shield]][daviddm_url]
[![Code Quality][codacy_shield]][codacy_url]
[![License][license_shield]][license_url]

[codacy_url]: https://www.codacy.com/app/hertzg/node-net-keepalive
[codacy_shield]: https://api.codacy.com/project/badge/Grade/d191b6408086432586e6c60577485c6f
[npm_url]: https://www.npmjs.com/package/net-keepalive
[npm_shield]: https://img.shields.io/npm/v/net-keepalive.svg?style=flat
[node_url]: https://dist.nodejs.org
[node_shield]: https://img.shields.io/badge/node-%3E%3D4-green.svg
[os_shield]: https://img.shields.io/badge/os-linux%2Cosx%2Cbsd-green.svg
[travis_url]: https://travis-ci.org/hertzg/node-net-keepalive
[travis_shield]: https://travis-ci.org/hertzg/node-net-keepalive.svg?branch=master
[daviddm_url]: https://david-dm.org/hertzg/node-net-keepalive
[daviddm_shield]: https://david-dm.org/hertzg/node-net-keepalive.svg
[license_url]: https://raw.githubusercontent.com/hertzg/node-net-keepalive/master/LICENSE
[license_shield]: https://img.shields.io/badge/license-MIT-blue.svg
[codecov_url]: https://codecov.io/gh/hertzg/node-net-keepalive
[codecov_shield]: https://codecov.io/gh/hertzg/node-net-keepalive/branch/master/graph/badge.svg


# net-keepalive
[![NPM](https://nodei.co/npm/net-keepalive.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/net-keepalive/)

The Missing (`TCP_KEEPINTVL` and `TCP_KEEPCNT`) `SO_KEEPALIVE` socket option setters and getters for Node using [`ffi-napi`](https://www.npmjs.com/package/ffi-napi) module. Tested on `linux`, should work on `osx` and `freebsd`.

## Install

```bash
$ npm install --save net-keepalive
```


## Demo
```Javascript
var Net = require('net')
  , NetKeepAlive = require('net-keepalive')
;

// Create a TCP Server
var srv = Net.createServer(function(s){
  console.log('Connected %j', s.address())
  // Doesn't matter what it does
  s.pipe(s)
});

// Start on some port
srv.listen(1337, function(){
  console.log('Listening on %j', srv.address())
});

// Connect to that server
var s = Net.createConnection({port:1337}, function(){
  console.log('Connected to %j', s.address())
  
  //IMPORTANT: KeepAlive must be enabled for this to work
  s.setKeepAlive(true, 1000)

  // Set TCP_KEEPINTVL for this specific socket
  NetKeepAlive.setKeepAliveInterval(s, 1000)
  
  // Get TCP_KEEPINTVL for this specific socket
  NetKeepAlive.getKeepAliveInterval(s) // 1000

  // Set TCP_KEEPCNT for this specific socket 
  NetKeepAlive.setKeepAliveProbes(s, 1)
  
  // Get TCP_KEEPCNT for this specific socket 
  NetKeepAlive.getKeepAliveProbes(s) // 1
});
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

```JavaScript
var NetSocket = require('net-keepalive')

// .....
// get socket somehow
// .....

var enable = true                                           // enable SO_KEEPALIVE
var initialDuration = 1000                                  // start probing after 1 second of inactivity
socket.setKeepAlive(enable, initialDuration)                // sets SO_KEEPALIVE and TCP_KEEPIDLE

var probeInterval = 1000                                    // after initialDuration send probes every 1 second
NetSocket.setKeepAliveInterval(socket, probeInterval)       //sets TCP_KEEPINTVL

var maxProbesBeforeFail = 10                                // after 10 failed probes connection will be dropped 
NetSocket.setKeepAliveProbes(socket, maxProbesBeforeFail)   // sets TCP_KEEPCNT

// ....
// ....
```

### setKeepAliveInterval(socket, msecs)
* `socket` - `instanceof Net.Socket`- Socket to modify
* `msecs` - `Number` - Time in milliseconds between KeepAlive probes.
* Returns `true` on success

Sets `TCP_KEEPINTVL` to `msecs` miliseconds (converted to seconds `int` internally) for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPINTVL (since Linux 2.4) The time (in seconds) between individual keepalive probes. This option should not be used in code intended to be portable.

### getKeepAliveInterval(socket)
* `socket` - `instanceof Net.Socket`- Socket to modify
* Returns `msecs` - `Number` - Time in milliseconds between KeepAlive probes on success

Gets `TCP_KEEPINTVL`. The `msecs` miliseconds (converted from seconds `int` internally) set for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPINTVL (since Linux 2.4) The time (in seconds) between individual keepalive probes. This option should not be used in code intended to be portable.


### setKeepAliveProbes(socket, count) 
* `socket` - `instanceof Net.Socket`- Socket to modify
* `count` - `Number` - Number of probes to send before dropping the connection
* Returns `true` on success

Sets `TCP_KEEPCNT` to `count` number of probes for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPCNT (since Linux 2.4) - The maximum number of keepalive probes TCP should send before dropping the connection. This option should not be used in code intended to be portable.


### getKeepAliveProbes(socket) 
* `socket` - `instanceof Net.Socket`- Socket to modify
* Returns `count` - `Number` - Number of probes to send before dropping the connection on success.

Gets `TCP_KEEPCNT`. The `count` number of probes set for the `socket` based on its file descriptor (`fd`)

    TCP_KEEPCNT (since Linux 2.4) - The maximum number of keepalive probes TCP should send before dropping the connection. This option should not be used in code intended to be portable.
