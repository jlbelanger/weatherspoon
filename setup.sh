#!/bin/bash
set -e

npm install
npm run build

docker exec -it --user ubuntu web sh -c 'cd "${APP_ROOT}/weatherspoon"; composer install'
