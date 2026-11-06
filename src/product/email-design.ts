import type { Block,Design } from './types';
export const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function safeUrl(value:string){if(value==='{{unsubscribe_url}}')return value;try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?url.href:'';}catch{return '';}}
export function block(type:Block['type']):Block{return {id:crypto.randomUUID(),type,text:type==='heading'?'A little news. A lot to share.':type==='button'?'Read the update':type==='image'?'Describe this image':type==='footer'?'{{company}}\n{{postal_address}}':type==='columns'?'Make it personal.':type==='divider'?'':type==='html'?'<p>Your custom HTML</p>':'Hello {{first_name}},\n\nShare something worth opening. Keep it clear, useful, and human.',secondary:'Tell your story here.',url:type==='image'?'':type==='footer'?'{{unsubscribe_url}}':'https://example.com',color:type==='button'?'#ffffff':'#0f1a2c',background:type==='button'?'#2a56d9':'#ffffff',align:type==='footer'?'center':'left',size:type==='heading'?30:type==='footer'?12:16,padding:type==='divider'?16:24,radius:6};}
export const starterDesign=():Design=>({background:'#f3f4f7',blocks:[{...block('heading'),text:'An update from {{company}}'},block('text'),block('button'),block('divider'),block('footer')]});
export function blockHtml(b:Block){
 const text=escape(b.text).replace(/\n/g,'<br>'),url=escape(safeUrl(b.url)),style=`padding:${b.padding}px;text-align:${b.align};color:${b.color};background:${b.type==='button'?'#ffffff':b.background};font-family:Arial,sans-serif;`;
 let html='';
 if(b.type==='heading')html=`<h1 style="margin:0;font-size:${b.size}px;line-height:1.25;font-weight:700">${text}</h1>`;
 if(b.type==='text')html=`<div style="font-size:${b.size}px;line-height:1.65">${text}</div>`;
 if(b.type==='image')html=url?`<img src="${url}" alt="${escape(b.text)}" width="552" style="max-width:100%;height:auto;display:block;border-radius:${b.radius}px">`:`<p style="color:#8390a4">Add an image URL in the inspector.</p>`;
 if(b.type==='button')html=`<a href="${url||'#'}" style="display:inline-block;background:${b.background};color:${b.color};border-radius:${b.radius}px;padding:13px 24px;text-decoration:none;font-size:${b.size}px;font-weight:600">${text}</a>`;
 if(b.type==='divider')html='<hr style="border:0;border-top:1px solid #e2e6ee;margin:0">';
 if(b.type==='columns')html=`<table role="presentation" width="100%"><tr><td width="50%" style="vertical-align:top;padding-right:12px;font-size:${b.size}px">${text}</td><td width="50%" style="vertical-align:top;padding-left:12px;font-size:${b.size}px">${escape(b.secondary).replace(/\n/g,'<br>')}</td></tr></table>`;
 if(b.type==='footer')html=`<p style="font-size:${b.size}px;line-height:1.6;color:#64748b;margin:0 0 12px">${text}</p><a href="{{unsubscribe_url}}" style="font-size:12px;color:#64748b">Unsubscribe</a>`;
 if(b.type==='html')html=b.text;
 return `<tr><td style="${style}">${html}</td></tr>`;
}
export function renderEmail(design:Design){return `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body style="margin:0;padding:24px 8px;background:${design.background??'#f3f4f7'}"><table role="presentation" cellspacing="0" cellpadding="0" width="100%"><tr><td align="center"><table role="presentation" cellspacing="0" cellpadding="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border-collapse:collapse">${(design.blocks??[]).map(blockHtml).join('')}</table></td></tr></table></body></html>`;}
