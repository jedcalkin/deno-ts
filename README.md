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
deno run --alow-read=. "https://jedcalkin.github.io/deno-ts/walk/walk.ts" > tree.json
```
