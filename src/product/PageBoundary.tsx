import { Component,type ErrorInfo,type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui';
export class PageBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(_error:Error,_info:ErrorInfo){/* Deliberately exclude contact/message content from logs. */}
 render(){return this.state.failed?<section className="panel error-view" role="alert"><h2>This view couldn’t be displayed</h2><p>Your saved data is still on the server. Reload the workspace, or choose another page.</p><Button icon={RefreshCw} onClick={()=>location.reload()}>Reload workspace</Button></section>:this.props.children;}
}
