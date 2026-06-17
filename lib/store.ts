
export type CaseStatus = 'MISSING'|'SIGHTING_REPORTED'|'CONFIRMED_MATCH'|'RECOVERED'|'CLOSED';
export type DogCase = { id:string; dogName:string; ownerName:string; photo:string; lastSeen:string; reward:number; description:string; status:CaseStatus; createdAt:string; sightings:string[] };
export type Sighting = { id:string; caseId?:string; photo:string; fullPhoto:string; previewPhoto:string; location:{lat:number;lng:number}; approx:string; exactHidden:boolean; createdAt:string; confidence:number; status:'UNMATCHED'|'PENDING_OWNER'|'CONFIRMED'|'REJECTED'; spotter:string; freshness:string };
export type Lead = { email:string; createdAt:string };
const k={cases:'dsg_cases', sightings:'dsg_sightings', leads:'dsg_leads'};
const sampleCases:DogCase[]=[
 {id:'case-bella',dogName:'Bella',ownerName:'Amy',photo:'/images/dogspotgps-hero.png',lastSeen:'Frontier Park, Erie PA',reward:250,description:'Auburn and white dog, friendly but scared.',status:'MISSING',createdAt:new Date(Date.now()-1000*60*24).toISOString(),sightings:[]},
 {id:'case-max',dogName:'Max',ownerName:'Local Owner',photo:'/images/dogspotgps-icon.png',lastSeen:'East 38th Street, Erie PA',reward:75,description:'Small brown dog, blue collar.',status:'SIGHTING_REPORTED',createdAt:new Date(Date.now()-1000*60*75).toISOString(),sightings:[]}
];
export function read<T>(key:string, fallback:T):T{ if(typeof window==='undefined') return fallback; try{const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback}catch{return fallback}}
export function write<T>(key:string,value:T){ if(typeof window!=='undefined') localStorage.setItem(key,JSON.stringify(value)); }
export function getCases(){ const v=read<DogCase[]>(k.cases,[]); if(v.length===0){write(k.cases,sampleCases); return sampleCases} return v; }
export function saveCase(c:DogCase){ const cases=getCases(); write(k.cases,[c,...cases]); return c; }
export function updateCase(id:string, patch:Partial<DogCase>){ const cases=getCases().map(c=>c.id===id?{...c,...patch}:c); write(k.cases,cases); return cases.find(c=>c.id===id); }
export function getSightings(){ return read<Sighting[]>(k.sightings,[]); }
export function saveSighting(s:Sighting){ const all=[s,...getSightings()]; write(k.sightings,all); return s; }
export function updateSighting(id:string, patch:Partial<Sighting>){ const sightings=getSightings().map(s=>s.id===id?{...s,...patch}:s); write(k.sightings,sightings); return sightings.find(s=>s.id===id); }
export function addLead(email:string){ const leads=read<Lead[]>(k.leads,[]); if(email && !leads.find(l=>l.email===email)) write(k.leads,[{email,createdAt:new Date().toISOString()},...leads]); }
export function money(n:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)}
export function uuid(prefix='id'){return `${prefix}-${Math.random().toString(36).slice(2,9)}-${Date.now().toString(36)}`}
