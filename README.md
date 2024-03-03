Vue 3 app running with Vike.
Uses optimizely CMS that is mocked in this demo

## Branch with Fastify instead of express
https://github.com/royalswe/vike-optimizely-example/tree/fastify-example

## Features

- https
- Pina
- i18n
- dayjs
- lazyloading

## Prerequisites

Node 18.x or higher.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## Project architecture

First page load is SSR then client navigation.

# vite-plugin-ssr (vps)

## V1 Design

The V1 design which this project is using.

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

├──src
│ ├── renderer -- renders before the old SPA
│ │ ├── +onBeforeRoute.ts -- first hook loaded, we use the url and store paths in pagecontext : will be rendered client/server on navigation
│ │ ├── app.ts -- See this as app.vue / creates the app : creates on server and updates on client if needed.
│ │ ├── +onRenderHtml.ts -- loads after onBeforeRender(the name duh) See this as index.html / renders the html : server only
│ │ └── +onRenderClient.ts -- loads on navigation : client only
│ ├── pages -- routing
│ │ ├── \_error
│ │ | └── +Page -- will be rendered if throw exceptions
│ │ ├── @slug and index
│ │ │ ├── +Page.vue -- start page for the specifik route : client/server
│ │ │ ├── +route.ts -- loads after +onBeforeRoute.ts and determit which route will be taken, can be set in +config if desired : client/server
│ │ │ ├── +onBeforeRender.ts -- loads after +route and write code for that route before load pages : server only as default.
│ │ | ├── +config -- settings for files in the same hierarchy and bellow
│ │ | └── +Layout -- layout file, if not set it will pick rendere/LayoutDefault.ts
│ │ └── index
│ │ └── same as @layout. index is a folder that vps ignore so it's the root

## Run the built app locally

- Build for production but with development configuration to use https localy `npm run build:dev`. This builds the Vike project with a development flag and runs the server as if it was running in production
  Then run the project with `npm run preview `

## Deployment for Azure web apps

server folder contains the following files that needs more explanation

- run.cjs - entry point for the server
- "start": "start script for the node server",
- "build": "build script for the node server",
- "postbuild": "runs after build and copies package.json, run.cjs and web.config to dist folder"
- web.config - iis config for the server, sets entrypoint file to run.cjs to run js modules correctly.

### Azure DevOps Piepelines

#### Build

- Pipeline runs npm run build in server folder
- Publishes dist folder as artifact

#### Release

- Copy Files to: /dist/dist: Copy dist files to dist folder to be able to deploy dist folder and not just the files inside it.
- Replace tokens in /dist - Replace variable placeholders with values from pipeline variables
- Deploy node app - deploys build dist folder
