curl -sSL https://jedcalkin.github.io/deno-ts/multi-ui/config.json --output config.json
curl -sSL https://jedcalkin.github.io/deno-ts/multi-ui/ui-start.sh --output ui-start.sh
chmod +x ui-start.sh
mkdir www
curl -sSL https://jedcalkin.github.io/deno-ts/multi-ui/www/index.html --output www/index.html
curl -sSL https://jedcalkin.github.io/deno-ts/multi-ui/www/control-1.html --output www/control-1.html
curl -sSL https://jedcalkin.github.io/deno-ts/multi-ui/www/display-1.html --output www/display-1.html
