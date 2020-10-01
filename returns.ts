interface Mimes {
  [ext: string]: string;
}

interface FileResponse {
  statusCode?: number;
  headers?: Headers;
  body: string;
}
interface Head {
  [keys: string]: string;
}

export const returns = {
  200:(body='', header={})=>code(200,body, header),
  302:(redirect: string, url: string='/' )=>code(302,'', {location:redirect+url}),
  400:(message=''        )=>code(400,message),
  401:(message=''        )=>code(401,message),
  404:(message='Not Found\n'      )=>code(404,message),
  409:(message='Duplicate\n'      )=>code(409,message),
  500:(message='Sorry.\n'         )=>code(500,message),
  501:(message='Not Implemented\n')=>code(501,message),
  www:   readFile,
  file:  readFile,
  js302,
  error: code,
  getMime,
}

function code(statusCode: number=500, body: string | Uint8Array='', head: Head={}): FileResponse {
  const headers = new Headers()
  headers.set('content-length', String(body.length))
  for(let header in head){
    headers.set(header, head[header])
  }
  return { statusCode, headers, body }
}

function js302(redirect: string, url: string='/'): FileResponse {
  return code(200,`<html><script>window.location.href = "${redirect+url}"</script><body style="background:#000"></body></html>\n`)
}

// read a file from disk
async function readFile(root: string, path: string, gz: boolean=true): Promise<FileResponse> {
  path = path.split('?')[0]
  try{
    let header: Head = {}
    const extension = path.split('.').pop() || 'none'
    const type = mimes[extension]
    if(type!=null && extension.length<=6){
      header['Content-Type'] = type
    }

    if(type.startsWith('image') || type.startsWith('video')){
      let file = await Deno.readFile(`${root}${path}`)
      return code( 200, file, header)
    } else {
      let file = await Deno.readTextFile(`${root}${path}${gz?'.gz':''}`)
      if(gz){
        header['Content-Encoding'] = 'gzip'
      }
      return code( 200, file, header)
    }

  } catch (err) {
    if(gz){
      return await readFile(root, path, false)
    }
    if(!path.endsWith('/index.html')){
      return await readFile(root, path+'/index.html')
    }
    try{
      return code( 404, await Deno.readTextFile(root+'/404.html'))
    } catch(e){
      return code( 404, 'Sorry 404')
    }
  }
}

function getMime(path: string): string | undefined {
  const extension = path.split('.').pop() || 'none'
  return mimes[extension]
}

export const mimes: Mimes = {
  html:'text/html',
  page:'text/html',
  css:'text/css',
  csv:'text/csv',
  js:'application/javascript',
  vue:'application/javascript',
  json:'application/json',
  ico:'image/x-icon',
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
