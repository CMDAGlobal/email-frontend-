export type Contact={id:string;email:string;first_name:string;status:string;consent_source:string};
export type List={id:string;name:string;members:number};
export type Campaign={id:string;name:string;subject:string;status:string;list_name:string;counts:Record<string,number>};
export type Template={id:string;name:string;subject:string;html:string};
export type Suppression={email:string;reason:string;created_at:string};
export type Overview={contacts:number;campaigns:number;suppressions:number;sendMode:string;messages:{status:string;total:number}[]};
export async function request<T>(key:string,path:string,body?:unknown,signal?:AbortSignal):Promise<T> {
 const response=await fetch(`/api/v1/${path}`,{method:body===undefined?'GET':'POST',headers:{'X-API-Key':key,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal});
 const data=await response.json();
 if(!response.ok) throw new Error(typeof data.message==='string'?data.message:`Request failed (${response.status}). Check the form values.`);
 return data as T;
}
