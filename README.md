# Webpack React Remote Microfrontend Template

Template per creare un microfrontend remoto con Webpack Module Federation, React e TypeScript.

## Struttura del Progetto

```
template-webpack-react-remote/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── @types/
│   │   └── global.d.ts     # Type definitions
│   ├── App.tsx             # Componente principale esposto
│   ├── bootstrap.tsx       # Entry point dell'applicazione
│   └── index.ts            # Entry point Webpack
├── package.json
├── tsconfig.json
├── webpack.config.js       # Configurazione Webpack con Module Federation
└── .gitignore
```

## Installazione

```bash
npm install
```

## Comandi Disponibili

### Sviluppo

Avvia il server di sviluppo sulla porta 3001:

```bash
npm start
```

L'applicazione sarà disponibile su http://localhost:3001

### Build di Produzione

Crea la build di produzione nella cartella `dist`:

```bash
npm build
```

### Serve Build

Serve la build di produzione:

```bash
npm run serve
```

## Module Federation

Questo template è configurato come **remote** microfrontend che espone:

- **Nome**: `remote`
- **File**: `remoteEntry.js`
- **Porta**: 3001
- **Componente esposto**: `./App` (src/App.tsx)

### Configurazione Host

Per consumare questo remote da un'applicazione host, aggiungi nella configurazione webpack dell'host:

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

### Utilizzo nell'Host

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

## Tecnologie

- React 18
- TypeScript 5
- Webpack 5 with Module Federation
- ts-loader

## Personalizzazione

### Cambiare la porta

Modifica la porta nel file `webpack.config.js`:

```javascript
devServer: {
  port: 3001, // <- cambia questa porta
}
```

### Aggiungere nuovi componenti esposti

Nel file `webpack.config.js`, aggiungi nuovi export nella sezione `exposes`:

```javascript
exposes: {
  './App': './src/App',
  './Button': './src/components/Button', // nuovo componente
}
```

### Modificare il nome del remote

Nel file `webpack.config.js`:

```javascript
new ModuleFederationPlugin({
  name: 'remote', // <- cambia questo nome
  // ...
})
```

## Note

- I moduli `react` e `react-dom` sono configurati come singleton per evitare duplicazioni
- Il bootstrap dinamico (`index.ts` -> `bootstrap.tsx`) è necessario per il corretto funzionamento di Module Federation
- La configurazione CORS è abilitata per permettere il caricamento da altri domini
