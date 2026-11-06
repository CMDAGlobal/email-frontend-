import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/reference.css';
import './styles/app.css';
import './styles/product.css';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
