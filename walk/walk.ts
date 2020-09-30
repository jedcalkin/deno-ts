const log = console.log

// import { getTree } from https://jedcalkin.github.io/deno-ts/walk/get-tree.ts
import { getTree } from './get-tree.ts'

const args: {[k: string]: string } = {
  path: '.'
}
for(const arg of Deno.args) {
  const [k, v] = arg.split('=')
  if(args[k]) { args[k] = v }
}

const fsTree = await getTree(args.path)

const jsonStr = JSON.stringify(fsTree, null, '  ')

console.log(jsonStr)
