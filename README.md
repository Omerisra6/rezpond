# Rezpond

`rezpond` is a simple, lightweight, and easy-to-use mock implementation of react.

## Installation

```bash
npm install rezpond
```

## Usage

```typescript
import { rezpond } from 'rezpond';
```

### Rendering your app

```tsx
import { rezpond } from 'rezpond';

const { render } = rezpond.createApp(document.getElementById('root'));

const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

rezpond.render(<App />);
```

### Using `useState` hook

```tsx
import { rezpond } from 'rezpond';

const { render, useState } = rezpond.createApp(document.getElementById('root'));

const App = () => {
  const [count, setCount] = rezpond.useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

rezpond.render(<App />);
```

### Using `useEffect` hook

```tsx
import { rezpond } from 'rezpond';

const { render, useEffect, useState } = rezpond.createApp(
  document.getElementById('root'),
);

const App = () => {
  const [count, setCount] = rezpond.useState(0);

  rezpond.useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

rezpond.render(<App />);
```
