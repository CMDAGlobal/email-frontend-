import { mayNavigate } from './useUnsavedChanges';
import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from 'react';
type Method='GET'|'POST'|'PATCH'|'DELETE';
type Api=<T>(path:string,method?:Method,body?:unknown,signal?:AbortSignal)=>Promise<T>;
export type Actor={id:string;name:string;email:string;role:'owner'|'editor'|'analyst';mustChangePassword:boolean};
let csrfToken='';
export function clearSessionToken(){csrfToken='';}
export async function authRequest<T>(path:string,method:Method='GET',body?:unknown):Promise<T>{const response=await fetch(`/api/auth/${path}`,{method,credentials:'same-origin',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(csrfToken?{'X-Dispatch-CSRF':csrfToken}:{})},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});const data=await response.json().catch(()=>({message:'Account service unavailable'}));if(!response.ok)throw new Error(typeof data.message==='string'?data.message:'Account request failed');if(data.csrfToken)csrfToken=data.csrfToken;return data as T;}
type Session={api:Api;version:number;actor:Actor|null;setActor:(actor:Actor)=>void;refresh:()=>void;notify:(message:string,kind?:'success'|'error')=>void;download:(path:string,name:string)=>Promise<void>;disconnect:()=>void};
const Context=createContext<Session|null>(null);
export async function fetchApi<T>(key:string,path:string,method:Method='GET',body?:unknown,signal?:AbortSignal):Promise<T>{
 const response=await fetch(`/api/v1/manage/${path}`,{method,credentials:'same-origin',headers:{...(key?{'X-API-Key':key}:{}),...(csrfToken?{'X-Dispatch-CSRF':csrfToken}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal});
 const data=await response.json().catch(()=>({message:'The server returned an unreadable response.'}));
 if(response.status===401)window.dispatchEvent(new Event('dispatch-session-expired'));
 if(!response.ok)throw new Error(typeof data.message==='string'?data.message:Array.isArray(data.message)?data.message.map((v:unknown)=>typeof v==='string'?v:JSON.stringify(v)).join('; '):`Request failed (${response.status})`);
 return data as T;
}
export function SessionProvider({apiKey,disconnect,children,initialActor=null}:{apiKey:string;disconnect:()=>void;children:ReactNode;initialActor?:Actor|null}){
 const [actor,setActor]=useState<Actor|null>(initialActor);
 const [version,setVersion]=useState(0);const [toast,setToast]=useState<{message:string;kind:string}|null>(null);
 const notify=useCallback((message:string,kind='success')=>setToast({message,kind}),[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),6000);return()=>clearTimeout(timer);},[toast]);
 const api=useCallback<Api>((path,method,body,signal)=>fetchApi(apiKey,path,method,body,signal),[apiKey]);
 const refresh=useCallback(()=>setVersion(v=>v+1),[]);
 const download=useCallback(async(path:string,name:string)=>{const response=await fetch(`/api/v1/manage/${path}`,{credentials:'same-origin',headers:apiKey?{'X-API-Key':apiKey}:{}});if(!response.ok)throw new Error('Export failed');const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},[apiKey]);
 const context=useMemo(()=>({api,version,actor,setActor,refresh,notify,download,disconnect}),[api,version,actor,refresh,notify,download,disconnect]);
 return <Context.Provider value={context}>{children}{toast?<div className={`notice-toast ${toast.kind}`} role={toast.kind==='error'?'alert':'status'}><span>{toast.message}</span><button aria-label="Dismiss notification" onClick={()=>setToast(null)}>×</button></div>:null}</Context.Provider>;
}
export function useSession(){const context=useContext(Context);if(!context)throw new Error('SessionProvider missing');return context;}
export function useOptionalSession(){return useContext(Context);}
export function useResource<T>(path:string|null){
 const {api,version}=useSession();const [data,setData]=useState<T|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [revision,setRevision]=useState(0);
 const reload=useCallback(()=>setRevision(v=>v+1),[]);
 useEffect(()=>{if(path===null){setData(null);setError('');setLoading(false);return;}const controller=new AbortController();setLoading(true);setError('');api<T>(path,'GET',undefined,controller.signal).then(value=>{if(!controller.signal.aborted)setData(value);}).catch(error=>{if(!controller.signal.aborted)setError(error instanceof Error?error.message:'Unable to load this page');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[api,path,version,revision]);
 return {data,loading,error,reload};
}
export function useAction(){const {notify,refresh}=useSession();const [busy,setBusy]=useState(false);const run=async(fn:()=>Promise<unknown>,message='Changes saved')=>{setBusy(true);try{const result=await fn();refresh();notify(message);return result;}catch(error){notify(error instanceof Error?error.message:'The action could not be completed','error');return undefined;}finally{setBusy(false);}};return {busy,run};}
export function useRoute(){const read=()=>{const [path,query]=location.hash.replace(/^#\/?/,'').split('?');const [page='overview',id,action]=path.split('/');return {page:page||'overview',id,action,query:new URLSearchParams(query)};};const [route,setRoute]=useState(read);useEffect(()=>{const handler=()=>setRoute(read());addEventListener('hashchange',handler);return()=>removeEventListener('hashchange',handler);},[]);return route;}
export const go=(path:string)=>{if(mayNavigate())location.hash='/'+path;};
export const date=(value:string|null|undefined)=>value?new Date(value).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}):'—';
export const number=(value:number)=>new Intl.NumberFormat().format(value);
export const rate=(part:number,total:number)=>total?`${(part/total*100).toFixed(1)}%`:'—';
