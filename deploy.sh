#!/bin/bash
set -e

APP_NAME=$(basename "${PWD}")

source "${HOME}/Websites/infrastructure/deploy/config.sh"
source "${HOME}/Websites/infrastructure/deploy/composer.sh"
source "${HOME}/Websites/infrastructure/deploy/etc.sh"
source "${HOME}/Websites/infrastructure/deploy/git.sh"
source "${HOME}/Websites/infrastructure/deploy/static.sh"

check_git_branch
build_static
check_git_changes
deploy_git
deploy_static
deploy_env
deploy_composer
printf "\e[0;32mDone.\n\e[0m"
