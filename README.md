# deno-ts
These librarys are ment to be used by deno

# multi-ui
A localhost server with a braucasts web socket
for UIs that use multiple devices or multiple bowser tabs for one users UI
```
curl https://jedcalkin.github.io/deno-ts/multi-ui/install.sh | sh
./ui-start.sh
```

# returns
an easy way to return statusCode, headers or body
in your deno server

# walk
generate a JSON object from a folder structure
```
deno run --allow-read=. "https://jedcalkin.github.io/deno-ts/walk/walk.ts" > tree.json
```

# get
read a file from disk or network
```
import 'https://jedcalkin.github.io/deno-ts/get.ts'

let localFile = await get('./www/index.html')
let remoteFile = await get('https://jedc.nz/index.html')

```
# args
read in cli aruments 
app.ts
```
import args from "https://jedcalkin.github.io/deno-ts/args.ts"
const defaultConfig = { v: false }
const config = await args(defaultConfig)
if(config.v){ console.log('verbose mode ON') }
```
sh
```
deno run app.ts --path=./www -vax port=8080 --ws /ws
key=value
--key=value
--key value
-fv     # flags
```
loading config from local or remote
```
--config=./config.json
--config=https://jedcalkin.github.io/deno-ts/srv/config.json
```
`--config` will be overwritten by cli args

# srv
a http & ws file server
```
deno run --allow-net=localhost,jedc.nz --allow-read \
"https://jedcalkin.github.io/deno-ts/srv/srv.ts"\
config=https://jedcalkin.github.io/deno-ts/srv/config.json
```
or customise
```
import { setEventHandler, setRestHandler } from "https://jedcalkin.github.io/deno-ts/srv/srv.ts"

async function events(socket: WebSocket, config: Args){
    for await (const event of socket) {
      if (typeof event != 'string') { continue }
      console.log(event)
    }
}

setEventHandler(events)

```
