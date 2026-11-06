import { useCallback,useEffect,useRef } from 'react';
let navigationCheck:(()=>boolean)|null=null;
export function mayNavigate(){return navigationCheck?.()??true;}
export function useUnsavedChanges(dirty:boolean){
 const current=useRef(dirty);current.current=dirty;
 const allowLeave=useCallback(()=>{current.current=false;},[]);
 useEffect(()=>{
  const ask=()=>!current.current||window.confirm('Leave this campaign? Changes since the last save will be lost.');navigationCheck=ask;
  const before=(event:BeforeUnloadEvent)=>{if(current.current){event.preventDefault();event.returnValue='';}};
  const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const anchor=(event.target as Element).closest?.('a[href]');if(!(anchor instanceof HTMLAnchorElement)||anchor.target==='_blank'||anchor.hasAttribute('download'))return;const destination=new URL(anchor.href,location.href);if(destination.href===location.href)return;if(destination.origin===location.origin&&destination.pathname===location.pathname&&destination.hash!==location.hash&&!ask())event.preventDefault();};
  addEventListener('beforeunload',before);document.addEventListener('click',click,true);
  return()=>{if(navigationCheck===ask)navigationCheck=null;removeEventListener('beforeunload',before);document.removeEventListener('click',click,true);};
 },[]);
 return allowLeave;
}
