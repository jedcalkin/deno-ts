const log = console.log

import { getTree } from "https://jedcalkin.github.io/deno-ts/walk/get-tree.ts"
import { args } from "https://jedcalkin.github.io/deno-ts/walk/args.ts"

const config = args()

const options = {
  path: config.path || '',
  hidden: config.hidden || config.h ? true : false,
  full: config.full || config.f ? true : false,
}

const fsTree = await getTree(options)

const jsonStr = JSON.stringify(fsTree, null, '  ')

log(jsonStr)
