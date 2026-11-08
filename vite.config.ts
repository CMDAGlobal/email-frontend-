import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'');
 const api=`http://127.0.0.1:${env.API_PORT||process.env.API_PORT||'3000'}`;
 return {plugins:[react()],server:{proxy:{'/api':api,'/public':api,'/track':api,'/unsubscribe':api,'/health':api}}};
});
