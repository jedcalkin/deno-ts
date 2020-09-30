import { get } from 'https://jedcalkin.github.io/deno-ts/get.ts'

interface Args {
  [arg: string]: any
}

 export default async function(config: Args={}): Promise<Args> {
  
  cli_args: {
    var cmdArgs: Args = {}
    let key: string = ''
    let value: boolean = false
    for(const arg of Deno.args) {
      if(value){
        cmdArgs[key] = arg
        value = false
        continue
      }
      if(arg.startsWith('--')){
        let [k, v] = arg.split('=')
        key = k.slice(2, Infinity)
        if(v){
          cmdArgs[key] = v
        } else {
          value = true
        }
        continue
      }
      if(arg.startsWith('-')){
        let flags = arg.split('')
        for(const f of flags){
          if(f=='-'){ continue }
          cmdArgs[f] = true
        }
        continue
      }
      let [k, v] = arg.split('=')
      if(v){
        cmdArgs[k] = v
      }
    }
  }

  remote_args: {
    var configStr = '{}'
    if(cmdArgs.config){
      try {
        configStr = await get(cmdArgs.config)
      } catch(e) {}
    }
  }

  return {
    ...JSON.parse(configStr),
    ...config,
    ...cmdArgs
  }
}
