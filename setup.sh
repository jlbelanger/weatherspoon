#!/bin/bash
set -e

yarn install
yarn build

docker exec -it --user ubuntu web sh -c 'cd "${APP_ROOT}/weatherspoon"; composer install'
