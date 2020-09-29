const log = console.log

import { serve } from 'https://deno.land/std/http/server.ts'
import { returns } from 'https://jedcalkin.github.io/deno-ts/returns.ts'
//import { returns } from './returns.ts'

const config = JSON.parse(Deno.readTextFileSync('./config.json'));

const port: number = config.port || 12120
const hostname: string = config.host || 'localhost'

const pages: {
  [path: string]: boolean
} = {}
const home = `/${config.pages[0]}` || '/index.html'
for (const page of config.pages){ pages[`/${page}`] = true }
// log([home])
// log(pages)

const server = serve({ hostname, port })

log(`on http://localhost:${port}/`)

for await (const req of server){
    if(req.url == '/'){
      const x = await returns.file('.', home, false)
      req.respond(x)
      continue
    }
    if(pages[req.url]) {
      req.respond(await returns.file('.', req.url, false))
      continue
    }
    req.respond(returns[404]())
}


interface Mimes {
  [ext: string]: string;
}
export const mimes: Mimes = {
  html:'text/html',
  page:'text/html',
  css:'text/css',
  csv:'text/csv',
  js:'application/javascript',
  vue:'application/javascript',
  json:'application/json',
  //ico:'image/x-icon',
  svg:'image/svg+xml',

  // media
  bmp:'image/bmp',
  png:'image/png',
  jpg:'image/jpeg',
  gif:'image/gif',

  webm:'video/webm',
  mp4:'video/mp4',
  avi:'video/x-msvideo',
  flv:'video/x-flv',

  // others
  stl:'application/x-stl',
  bin:'application/octet-stream',
  pdf:'application/pdf',
  yaml:'text/yaml',
  tex:'application/x-tex',
}
