// Type definitions for net-keepalive
// Project: https://github.com/hertzg/node-net-keepalive
// Definitions by: George Kotchlamazashvili
// Definitions: https://github.com/hertzg/node-net-keepalive

/// <reference types="node" />

import { Socket } from 'net'

export type NodeJSSocketWithFileDescriptor =
  | Socket
  | { _handle: { _fd: number } }

export function setKeepAliveInterval(
  socket: NodeJSSocketWithFileDescriptor,
  intvl: number
): boolean

export function getKeepAliveInterval(
  socket: NodeJSSocketWithFileDescriptor
): number

export function setKeepAliveProbes(
  socket: NodeJSSocketWithFileDescriptor,
  cnt: number
): boolean

export function getKeepAliveProbes(
  socket: NodeJSSocketWithFileDescriptor
): number

export function setUserTimeout(
  socket: NodeJSSocketWithFileDescriptor,
  timeout: number
): boolean

export function getUserTimeout(
  socket: NodeJSSocketWithFileDescriptor
): number
