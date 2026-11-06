import { lazy,Suspense } from 'react';
import { PageBoundary } from './PageBoundary';
import { AccessGate } from './AccessGate';
import { ProductShell } from './ProductShell';
import { fetchApi,SessionProvider,useResource,useRoute,useSession } from './session';
import type { Settings } from './types';
import { Button,Empty,Loading } from './ui';
const CmdaIntegrationPage=lazy(()=>import('./CmdaIntegrationPage').then(m=>({default:m.CmdaIntegrationPage})));
const AccountPage=lazy(()=>import('./AccountsPage').then(m=>({default:m.AccountPage})));
const TeamPage=lazy(()=>import('./AccountsPage').then(m=>({default:m.TeamPage})));
const AuditPage=lazy(()=>import('./AccountsPage').then(m=>({default:m.AuditPage})));
const OperationsPage=lazy(()=>import('./OperationsPage').then(m=>({default:m.OperationsPage})));
const ContactsPage=lazy(()=>import('./ContactsPage').then(m=>({default:m.ContactsPage})));
const ListsPage=lazy(()=>import('./AudiencesPage').then(m=>({default:m.ListsPage})));
const SegmentsPage=lazy(()=>import('./AudiencesPage').then(m=>({default:m.SegmentsPage})));
const TemplatesPage=lazy(()=>import('./TemplatesPage').then(m=>({default:m.TemplatesPage})));
const CampaignsPage=lazy(()=>import('./CampaignsPage').then(m=>({default:m.CampaignsPage})));
const CampaignWizard=lazy(()=>import('./CampaignsPage').then(m=>({default:m.CampaignWizard})));
const AutomationsPage=lazy(()=>import('./AutomationsPage').then(m=>({default:m.AutomationsPage})));
const FormsPage=lazy(()=>import('./FormsPage').then(m=>({default:m.FormsPage})));
const ReportsPage=lazy(()=>import('./ReportsPage').then(m=>({default:m.ReportsPage})));
const TransactionalPage=lazy(()=>import('./TransactionalPage').then(m=>({default:m.TransactionalPage})));
const SettingsPage=lazy(()=>import('./SettingsPage').then(m=>({default:m.SettingsPage})));
const SuppressionsPage=lazy(()=>import('./SettingsPage').then(m=>({default:m.SuppressionsPage})));
export function DispatchApp(){return <AccessGate><Workspace/></AccessGate>;}
function Workspace(){
 const route=useRoute();const {disconnect,actor}=useSession();const settings=useResource<Settings>(actor?.mustChangePassword?null:'settings');
 const page=route.page;let content;
 switch(page){
  case 'integrations':content=<CmdaIntegrationPage/>;break;
  case 'account':content=<AccountPage/>;break;
  case 'team':content=<TeamPage/>;break;
  case 'audit':content=<AuditPage/>;break;
  case 'operations':content=<OperationsPage/>;break;
  case 'overview':content=<ReportsPage overview/>;break;
  case 'contacts':content=<ContactsPage key={route.query.toString()} initialSearch={route.query.get('search')??''} listFilter={route.query.get('listId')??''} segmentFilter={route.query.get('segmentId')??''}/>;break;
  case 'lists':content=<ListsPage/>;break;
  case 'segments':content=<SegmentsPage/>;break;
  case 'templates':case 'editor':content=<TemplatesPage/>;break;
  case 'campaigns':content=route.id?<CampaignWizard key={route.id} id={route.id==='new'?undefined:route.id} settings={settings.data}/>:<CampaignsPage/>;break;
  case 'automations':content=<AutomationsPage key={route.id??'index'} id={route.id}/>;break;
  case 'forms':content=<FormsPage/>;break;
  case 'transactional':content=<TransactionalPage settings={settings.data}/>;break;
  case 'reports':content=<ReportsPage/>;break;
  case 'suppressions':content=<SuppressionsPage/>;break;
  case 'settings':content=<SettingsPage key={route.query.get('tab')??'workspace'} settings={settings.data} initialTab={route.query.get('tab')??'workspace'}/>;break;
  default:content=<Empty title="This page doesn’t exist" description="Choose a page from the navigation." action={<a className="btn primary" href="#/overview">Back to dashboard</a>}/>;
 }
 if(actor?.mustChangePassword)content=<AccountPage forced/>;
 return <ProductShell page={page} mode={settings.data?.delivery.mode} workspaceName={settings.data?.name}>{settings.error?<div className="connection-error" role="alert"><div><b>Workspace connection needs attention</b><p>{settings.error}</p></div><Button onClick={settings.reload}>Retry</Button><Button onClick={disconnect}>Change access key</Button></div>:null}{actor?.role==='analyst'?<div className="info-banner">Read-only workspace access. You can explore audiences, deliveries, and reports.</div>:null}<PageBoundary key={`${page}:${route.id??''}:${route.query.toString()}`}><Suspense fallback={<Loading/>}>{content}</Suspense></PageBoundary></ProductShell>;
}
