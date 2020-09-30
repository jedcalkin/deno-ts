const log = console.log

interface Tree {
  [folder: string]: Tree | number | Deno.FileInfo;
}

export async function getTree(path='.', full=false): Promise<Tree> {
  const tree: Tree = {}

  const dir = Deno.readDir(path)
  for await (const file of dir) {
    const filePath = `${path}/${file.name}`
    if(file.isDirectory){
      tree[file.name] = await getTree(filePath)
    }
    if(file.isFile) {
      let stats = await Deno.stat(filePath)
      tree[file.name] = full ? stats : stats.size
    }
  }
  return tree
}
