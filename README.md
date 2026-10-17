# Webpack React Remote Microfrontend Template

Template for creating a remote microfrontend with Webpack Module Federation, React, and TypeScript.

## Project Structure

```
template-webpack-react-remote/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── types/
│   │   └── global.d.ts     # Type definitions
│   ├── components/
│   │   └── Button.tsx      # Button component (exposed)
│   ├── App.tsx             # Standalone page of the remote
│   ├── bootstrap.tsx       # Application entry point
│   └── index.ts            # Webpack entry point
├── dist/                   # Production build output
├── package.json
├── pnpm-lock.yaml          # PNPM lockfile
├── tsconfig.json
├── webpack.config.ts       # Webpack configuration with Module Federation
├── LICENSE
└── .gitignore
```

## Installation

This project uses **pnpm** 12 as the package manager (pinned in `packageManager`) and needs Node.js 22.18 or later. Enable corepack so it picks up that version:

```bash
corepack enable
```

Then install dependencies:

```bash
pnpm install
```

## Available Commands

### Development

Start the development server on port 3000:

```bash
pnpm dev
```

The application will be available at http://localhost:3000

### Production Build

Create a production build in the `dist` folder:

```bash
pnpm build
```

This command will:
1. Run TypeScript compiler
2. Build the application with Webpack
3. Generate TypeScript declaration files

### Build Types Only

Generate only TypeScript declaration files:

```bash
pnpm build:types
```

### Serve Build

Serve the production build on port 3001:

```bash
pnpm serve
```

The production build will be available at http://localhost:3001

## Module Federation

This template is configured as a **remote** microfrontend that exposes:

- **Name**: `exampleremote` (see [The container name](#the-container-name))
- **File**: `remoteEntry.js`
- **Port**: 3000
- **Exposed Components**:
  - `./Button` (src/components/Button.tsx) - Reusable button component

### The container name

```typescript
new ModuleFederationPlugin({
  name: 'exampleremote', // mfe-orchestrator:federation-name
  // ...
})
```

A webpack host does not import this remote by its URL: it injects `remoteEntry.js` and then looks
the container up **by this name**. When the MFE Orchestrator console creates a microfrontend from
this template, it rewrites the string on the line carrying the `mfe-orchestrator:federation-name`
marker to the federation name of the microfrontend's slug: slashes become underscores and dashes
go, so `checkout-new` becomes `checkoutnew`. That is the same name the console writes into the
hosts it configures, and the `nameToIntegrate` it serves in the manifest.

Keep the marker on that line. If you rename the container by hand, use that same derived name.

### Host Configuration

A host resolves this remote through the orchestrator client SDK (`@mfe-orchestrator-hub/client`
0.3.0 or later), never through a URL written in its config:

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    // key: what the host imports from; 'checkout-new': the slug in the orchestrator;
    // 'checkoutnew': this remote's container name, federationName(slug)
    checkoutnew: "promise globalThis.__MFE_ORCHESTRATOR__.loadWebpackRemote('checkout-new', 'checkoutnew')",
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

The host calls `configure()` from the SDK at the top of its entry point, before anything imports a
remote. `loadWebpackRemote()` asks the backend for the URL of the version to serve, injects that
`remoteEntry.js` once and returns the container. The webpack host templates of the orchestrator
come wired this way.

### Usage in Host

```typescript
import React, { lazy, Suspense } from 'react';

const RemoteButton = lazy(() => import('checkoutnew/Button'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteButton
        variant="primary"
        onClick={() => console.log('Clicked!')}
      >
        Click Me
      </RemoteButton>
    </Suspense>
  );
}
```

## Technologies

- React 19.3
- TypeScript 7 (type checking only, through `tsc` in the build script)
- Webpack 5 with Module Federation
- swc-loader, which strips the types and compiles the JSX
- PNPM 12 (Package Manager)
- CSS Loader & Style Loader
- Node.js 22.18 or later: webpack-cli loads `webpack.config.ts` through Node's built-in type stripping, so there is no ts-node

## Customization

### Change Port

Modify the port in the `webpack.config.ts` file:

```typescript
devServer: {
  port: 3000, // <- change this port
}
```

### Add New Exposed Components

In the `webpack.config.ts` file, add new exports in the `exposes` section.

Current configuration:
```typescript
exposes: {
  './Button': './src/components/Button',
}
```

To add a new component:
```typescript
exposes: {
  './Button': './src/components/Button',
  './NewComponent': './src/components/NewComponent', // new component
}
```

### Change Remote Name

See [The container name](#the-container-name): the console sets it for you from the slug.

## Notes

- The `react` and `react-dom` modules are configured as singletons to avoid duplications
- Dynamic bootstrap (`index.ts` -> `bootstrap.tsx`) is necessary for Module Federation to work correctly
- CORS configuration is enabled to allow loading from other domains
