# Weatherspoon

Weatherspoon is a weather forecast website. [View the site](https://weatherspoon.jennybelanger.com/).

## Development

### Requirements

- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)
- Web server with PHP

### Setup

``` bash
git clone https://github.com/jlbelanger/weatherspoon.git
cd weatherspoon
./setup.sh
```

### Run

``` bash
npm start
```

Your browser should automatically open https://localhost:3000/

### Lint

``` bash
./vendor/bin/phpcs
npm run lint
```

### Generate splash screens

``` bash
npx pwa-asset-generator public/icon.png ./public/assets/splash --background "#5158a9" --splash-only --type png --portrait-only --padding "20%"
```

## Deployment

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```
