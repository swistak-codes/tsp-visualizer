import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { PresentationsTsp } from './presentations-tsp';
import { Algorithm } from './utils/types';

const algorithms: Set<string> = new Set([
  'brute-force',
  'held-karp',
] as Algorithm[]);

const urlParams = new URLSearchParams(window.location.search);
let algorithmParam = urlParams.get('algorithm');

if (!algorithmParam || !algorithms.has(algorithmParam)) {
  algorithmParam = 'brute-force'
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PresentationsTsp algorithm={algorithmParam as Algorithm} />
  </StrictMode>
);
