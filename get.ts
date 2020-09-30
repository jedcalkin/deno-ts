
export async function get(path: string): Promise<string> {
    if(path.startsWith('http://')){
        const r = await fetch(path)
        return r.text()
    }
    if(path.startsWith('https://')){
        const r = await fetch(path)
        return r.text()
    }
    return Deno.readTextFile(path)
}
