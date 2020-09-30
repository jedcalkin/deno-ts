const log = console.log

import args from "https://jedcalkin.github.io/deno-ts/args.ts"
import { getTree } from "https://jedcalkin.github.io/deno-ts/walk/get-tree.ts"
// import { getTree } from "./get-tree.ts"

const config = await args()

const options = {
  path: config.path || '.',
  hidden: config.hidden || config.h ? true : false,
  full: config.full || config.f ? true : false,
}

const fsTree = await getTree(options)

const jsonStr = JSON.stringify(fsTree, null, '  ')

log(jsonStr)
