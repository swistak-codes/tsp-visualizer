import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { PresentationsTsp } from './presentations-tsp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PresentationsTsp algorithms={['brute-force', 'held-karp', 'nn', 'rnn', 'christofides']} />
  </StrictMode>
);
