const log = console.log

interface TreeOptions {
  path: string;
  hidden: boolean;
  full: boolean;
}

const args: TreeOptions = {
  path: '.',
  hidden: false,
  full: false,
}

interface Tree {
  [folder: string]: Tree | number | Deno.FileInfo;
}

export async function getTree(options: TreeOptions=args): Promise<Tree> {
  let config = { ...args, ...options }
  const tree: Tree = {}

  const dir = Deno.readDir(config.path)
  for await (const file of dir) {
    if(file.name.startsWith('.') && !config.hidden) { continue }
    const filePath = `${config.path}/${file.name}`
    if(file.isDirectory){
      tree[file.name] = await getTree({ ...options, path: filePath })
    }
    if(file.isFile) {
      let stats = await Deno.stat(filePath)
      tree[file.name] = config.full ? stats : stats.size
    }
  }
  return tree
}
