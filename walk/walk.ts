
// import { getTree } from https://jedcalkin.github.io/deno-ts/walk/get-tree.ts
import { getTree } from './get-tree.ts'

const path = '.'

const fsTree = await getTree(path)

const jsonStr = JSON.stringify(fsTree, null, '  ')

console.log(jsonStr)
