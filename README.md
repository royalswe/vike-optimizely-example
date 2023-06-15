Vue 3 app running with https locally.
Pina, i18n included.

## Prerequisites

Node 18.x or higher.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run server 
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project architecture

This is a standard SPA Vue project with vps router.
All data is fetched from optimizely (former episerver)
First page load is SSR then client navigation.

# vite-plugin-ssr (vps)

## V1 Design
The V1 design which this project is using is in Beta, it will unlocks many more capabilities and less bundled source code.
The documentation is wrote for the v0.4 design but the v1 is on the way. https://github.com/brillout/vite-plugin-ssr/issues/578#issuecomment-1366654394

## + files
Files that starts with `+` will be loaded by vps without having to import them.
Files that do not start with `+` is not handled by vps.

## trusting certificate problem
This has nothing to do with vps but with nodejs environment safety.
set `NODE_TLS_REJECT_UNAUTHORIZED` as a environment variable with the value `0`
in code inside the project
`process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';`

## File description ordered by when they are initiate
The new folder Page is our new route and renderer is vps specifik files
src
├── renderer -- renders before the old SPA 
│   ├── +onBeforeRoute.ts -- first hook loaded, we use the url and store paths in pagecontext : will be rendered client/server on navigation 
│   ├── app.ts -- See this as app.vue / creates the app : creates on server and updates on client if needed.
│   ├── +onRenderHtml.ts -- loads after onBeforeRender(the name duh) See this as index.html / renders the html : server only
│   └── +onRenderClient.ts -- loads on navigation : client only
├── pages -- routing
│   ├── _error
│   |   └── +Page -- will be rendered if throw exceptions
│   ├── @slug and index
│   │   ├── +Page.vue -- start page for the specifik route : client/server
│   │   ├── +route.ts -- loads after +onBeforeRoute.ts and determit which route will be taken, can be set in +config if desired : client/server
│   │   ├── +onBeforeRender.ts -- loads after +route and write code for that route before load pages : server only as default.
│   |   ├── +config -- settings for files in the same hierarchy and bellow
│   |   └── +Layout -- layout file, if not set it will pick rendere/LayoutDefault.ts
│   └── index
│       └── same as @layout. index is a folder that vps ignore so it's the root
