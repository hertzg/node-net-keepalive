import * as NetKeepAlive from './'
import * as Net from 'net'
import { expectType } from 'tsd'

Net.createServer((incomingSocket) => {
  expectType<boolean>(NetKeepAlive.setKeepAliveInterval(incomingSocket, 1000))
  expectType<boolean>(NetKeepAlive.setKeepAliveProbes(incomingSocket, 1))
  expectType<boolean>(NetKeepAlive.setUserTimeout(incomingSocket, 5000))
})

const clientSocket = Net.createConnection({port: -1})
expectType<boolean>(NetKeepAlive.setKeepAliveInterval(clientSocket, 1000))
expectType<boolean>(NetKeepAlive.setKeepAliveProbes(clientSocket, 1))
expectType<boolean>(NetKeepAlive.setUserTimeout(clientSocket, 5000))
