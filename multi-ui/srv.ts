const log = console.log

import { serve } from 'https://deno.land/std/http/server.ts'
import {
  acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket
} from "https://deno.land/std/ws/mod.ts";
import { returns } from 'https://jedcalkin.github.io/deno-ts/returns.ts'
//import { returns } from './returns.ts'

const config = JSON.parse(Deno.readTextFileSync('./config.json'));

const port: number = config.port || 12120
const hostname: string = config.host || 'localhost'

const pages: {
  [urlPath: string]: string;
} = config.pages || {
  '/': './srv.ts'
}

async function handle(req: any){
    if(req.url == '/ws'){
      const { conn, r: bufReader, w: bufWriter, headers } = req;
      try {
        const socket = await acceptWebSocket({ conn, bufReader, bufWriter, headers })
        events(socket)
      } catch (err){
        console.error(`failed to accept websocket: ${err}`);
        await req.respond({ status: 400 });
      }
      return
    }
    // log(pages[req.url])
    if(pages[req.url]) {
      req.respond(await returns.file('./', pages[req.url], false))
      return
    }
    req.respond(returns[404]())
}

const connections: {[uid: string]: WebSocket } = {}

async function events(socket: WebSocket) {
  const uid = (Math.random()*36**5).toString(36).toUpperCase()
  connections[uid] = socket
  try {
    for await (const event of socket) {
      if (typeof event != 'string') { continue }
      // log(event)
      for(const c in connections){
        if(c == uid){ continue }
        if(connections && connections[c] == undefined ){ continue }
        try {
          await connections[c].send(event);
        } catch (err) {
          delete(connections[uid])
        }
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);
    if (!socket.isClosed) {
      delete(connections[uid])
      await socket.close(1000).catch(console.error);
    }
  }
}

const server = serve({ hostname, port })
log(`on http://localhost:${port}/`)
for await (const req of server){
  handle(req)
}