import { useState,type FormEvent,type ReactNode } from 'react';
export function Form({onSubmit,children,label='Save'}:{onSubmit:(data:FormData)=>Promise<void>;children:ReactNode;label?:string}) {
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget;setBusy(true);setError('');try{await onSubmit(new FormData(form));form.reset();}catch(error){setError(error instanceof Error?error.message:'Request failed');}finally{setBusy(false);}}
 return <form className="panel pad create-form" onSubmit={submit}>{children}{error?<p role="alert" className="form-error">{error}</p>:null}<button disabled={busy} className="btn primary">{busy?'Saving…':label}</button></form>;
}
export function Field({label,name,type='text',required=true}:{label:string;name:string;type?:string;required?:boolean}) {return <label className="field">{label}<input className="inp" name={name} type={type} required={required}/></label>;}
export const value=(data:FormData,key:string)=>String(data.get(key)??'');
