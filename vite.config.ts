import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],server:{proxy:{'/api':'http://127.0.0.1:3000','/public':'http://127.0.0.1:3000','/track':'http://127.0.0.1:3000','/unsubscribe':'http://127.0.0.1:3000','/health':'http://127.0.0.1:3000'}}});
