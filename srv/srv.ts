
const log = console.log
import { serve } from 'https://deno.land/std/http/server.ts'
import { acceptWebSocket, WebSocket } from "https://deno.land/std/ws/mod.ts";
import { returns } from 'https://jedcalkin.github.io/deno-ts/returns.ts'
import args from "https://jedcalkin.github.io/deno-ts/args.ts"
import { get } from "https://jedcalkin.github.io/deno-ts/get.ts"

const config = await args()

const overrides = {
  '/': '/index.html',
  '/favicon.ico': 'https://jedc.nz/favicon.ico'
}

const excludes: string[] = [
  '\\.php$',
  '\\.jsp$',
  '\\.asp$',
  '\\.xml$',
  '\\.git/',
  '/\\.\\./'
]

const port = Number(config.port)
const CONFIG: {[key: string]: any} = {
  fileRoot: config.root || '.',
  port: !isNaN(port) ? port : 8070,
  hostname: config.host || 'localhost',
  ws: config.ws || '',
  gz: config.gz || false,
  overrides: config.overrides || overrides,
  excludes: config.excludes || excludes,
  verbose: config.v || false,
  proxy: undefined
}

if(config.proxy) {
  const [ path, to ] = config.proxy.split(';')
  CONFIG.proxy = { path, to }
}

if(config.index) {
  CONFIG.overrides['/'] = config.index
}

if(CONFIG.verbose) { log(CONFIG) }

async function remoteGet(url: string){
  try {
    const file = await get(url)
    let mime = returns.getMime(url)
    return returns[200](file, { 'Content-Type': mime })
  } catch (err){
    console.log(err)
    return returns[404]()
  }
}

async function rest(req: any, CONFIG: {[k:string]: any}){
  let url = req.url
  if(CONFIG.verbose) { log(url) }
  if (req.headers.get('host').split(':')[0] !== CONFIG.hostname){
    if(CONFIG.verbose) { log(`host: ${req.headers.host}`) }
    return req.respond(returns.error(410))
  }

  // ws
  if(url == CONFIG.ws){
    const { conn, r: bufReader, w: bufWriter, headers } = req;
    try {
      const socket = await acceptWebSocket({ conn, bufReader, bufWriter, headers })
      bcastEvents(socket, CONFIG)
    } catch (err){
      console.error(`failed to accept websocket: ${err}`)
      req.respond(returns[400]())
    }
    return
  }

  // REST
  if(CONFIG.overrides[url]){
    let url2 = CONFIG.overrides[url]
    if(CONFIG.verbose) { log(`${url} -> ${url2}`) }
    return req.respond(await remoteGet(url2))
  }
  if(CONFIG.proxy && url.startsWith(CONFIG.proxy.path)){
    let url3 = `${CONFIG.proxy.to}${url.split(CONFIG.proxy.path)[1]}`
    if(CONFIG.verbose) { log(`${url} => ${url3}`) }
    return req.respond(await remoteGet(url3))
  }
  for(let ex of CONFIG.excludes){
    if(url.match(ex)){
      if(CONFIG.verbose) { log(`ex ${url}`) }
      return req.respond(returns[400]())
    }
  }
  return req.respond(await returns.file(CONFIG.fileRoot, url, CONFIG.gz))
}

const connections: {[uid: string]: WebSocket } = {}

async function bcastEvents(socket: WebSocket, CONFIG: {[k:string]: any}) {
  const uid = (Math.random()*36**5).toString(36).toUpperCase()
  connections[uid] = socket
  try {
    for await (const event of socket) {
      if (typeof event != 'string') { continue }
      if(CONFIG.verbose) { log(event) }
      for(const c in connections){
        if(c == uid){ continue }
        if(connections && connections[c] == undefined ){ continue }
        try {
          await connections[c].send(event)
        } catch (err) {
          delete(connections[uid])
        }
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`)
    if (!socket.isClosed) {
      delete(connections[uid])
      await socket.close(1000).catch(console.error)
    }
  }
}
var events = bcastEvents;

export function setEventHandler(fn: typeof bcastEvents){
    events = fn
}

var handle = rest;

export function setRestHandler(fn: typeof rest){
    handle = fn
}


const server = serve({ hostname: CONFIG.hostname, port: CONFIG.port })
log(`starting http://${CONFIG.hostname}:${CONFIG.port}/`)
for await (const req of server){
  handle(req, CONFIG)
}
