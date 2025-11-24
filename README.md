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
│   ├── App.tsx             # Main application component (exposed)
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

This project uses **PNPM** as the package manager. Make sure you have PNPM installed:

```bash
npm install -g pnpm
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

- **Name**: `remote`
- **File**: `remoteEntry.js`
- **Port**: 3000
- **Exposed Components**:
  - `./App` (src/App.tsx) - Main application component
  - `./Button` (src/Button.tsx) - Reusable button component

### Host Configuration

To consume this remote from a host application, add to the host's webpack configuration:

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3000/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

### Usage in Host

#### Importing the App Component

```typescript
import React, { lazy, Suspense } from 'react';

const RemoteApp = lazy(() => import('remote/App'));

function App() {
  return (
    <Suspense fallback={<div>Loading Remote...</div>}>
      <RemoteApp />
    </Suspense>
  );
}
```

#### Importing the Button Component

```typescript
import React, { lazy, Suspense } from 'react';

const RemoteButton = lazy(() => import('remote/Button'));

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

- React 19.2
- TypeScript 5.9
- Webpack 5 with Module Federation
- ts-loader
- PNPM (Package Manager)
- CSS Loader & Style Loader

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
  './Button': './src/Button',
}
```

To add a new component:
```typescript
exposes: {
  './Button': './src/Button',
  './NewComponent': './src/components/NewComponent', // new component
}
```

### Change Remote Name

In the `webpack.config.ts` file:

```typescript
new ModuleFederationPlugin({
  name: 'remote', // <- change this name
  // ...
})
```

## Notes

- The `react` and `react-dom` modules are configured as singletons to avoid duplications
- Dynamic bootstrap (`index.ts` -> `bootstrap.tsx`) is necessary for Module Federation to work correctly
- CORS configuration is enabled to allow loading from other domains
