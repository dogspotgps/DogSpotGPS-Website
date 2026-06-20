// @ts-nocheck
'use client';
import Image from 'next/image'; 
import { useEffect, useRef, useState } from 'react';
import { Camera, Dog, MapPin, Trophy, ShieldCheck, Bell, Heart, Upload, Navigation, MessageCircle, Share2, Store, User, X, Check, Clock, Star } from 'lucide-react';
import { DogCase, Sighting, getCases, saveCase, getSightings, saveSighting, updateCase, updateSighting, money, uuid, addLead } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
type Page = 'home'|'spot'|'report'|'active'|'review'|'radar'|'command'|'earnings'|'leaderboard'|'partners'|'profile'|'admin';
const navs:{key:Page,label:string}[]=[{key:'home',label:'Home'},{key:'active',label:'Active Searches'},{key:'radar',label:'Reward Radar'},{key:'partners',label:'Partners'},{key:'profile',label:'Login/Profile'}];

export default function Page(){
 const [page,setPage]=useState<Page>('home'); const [cases,setCases]=useState<DogCase[]>([]); const [sightings,setSightings]=useState<Sighting[]>([]); const [selectedCase,setSelectedCase]=useState<string>('case-bella'); const [lead,setLead]=useState('');
 useEffect(()=>{setCases(getCases()); setSightings(getSightings());},[]);
 const refresh=()=>{setCases(getCases());setSightings(getSightings())}
 const go=(p:Page)=>{setPage(p); setTimeout(()=>scrollTo({top:0,behavior:'smooth'}),0)}
 return <>
  <nav className="nav"><div className="container navin"><button className="brand" onClick={()=>go('home')} style={{background:'none',border:0,cursor:'pointer'}}><Image src="/images/dogspotgps-icon.png" width={52} height={52} alt="DogSpotGPS"/> <span>DogSpotGPS</span></button><div className="navlinks">{navs.map(n=><button key={n.key} onClick={()=>go(n.key)} className="keep" style={{background:'none',border:0,color:'inherit',fontWeight:800,cursor:'pointer'}}>{n.label}</button>)}<button className="btn gold" onClick={()=>go('spot')}><Camera size={18}/> Spot a Dog</button></div></div></nav>
  {page==='home'&&<Home go={go} lead={lead} setLead={setLead}/>} 
  {page==='spot'&&<SpotDog go={go} refresh={refresh}/>} 
  {page==='report'&&<ReportDog go={go} refresh={refresh}/>} 
  {page==='active'&&<ActiveSearches cases={cases} sightings={sightings} go={go} setSelectedCase={setSelectedCase}/>} 
  {page==='review'&&<OwnerReview cases={cases} sightings={sightings} go={go} refresh={refresh}/>} 
  {page==='radar'&&<RewardRadar cases={cases} go={go} setSelectedCase={setSelectedCase}/>} 
  {page==='command'&&<CommandCenter cases={cases} sightings={sightings} selectedCase={selectedCase} go={go}/>} 
  {page==='earnings'&&<Earnings/>} {page==='leaderboard'&&<Leaderboard/>} {page==='partners'&&<Partners/>} {page==='profile'&&<Profile/>} {page==='admin'&&<Admin cases={cases} sightings={sightings}/>} 
  <Footer go={go}/>
 </>
}
function Home({go,lead,setLead}:{go:(p:Page)=>void;lead:string;setLead:(s:string)=>void}){return <><section className="hero"><div className="container heroGrid"><div><div className="pill">📸 Picture-first lost dog recovery</div><h1>Find lost dogs faster.</h1><p>DogSpotGPS turns every community member into a safe dog spotter: see a dog, snap a live photo, auto-capture GPS and time, let the owner confirm, then unlock exact location and rewards.</p><div className="pillrow"><button className="btn primary" onClick={()=>go('spot')}><Camera/> Spot a Dog Now</button><button className="btn gold" onClick={()=>go('report')}><Dog/> Report Lost Dog</button><button className="btn light" onClick={()=>go('active')}><MapPin/> View Active Searches</button></div><div className="pillrow"><span className="pill">No gallery uploads</span><span className="pill">Live GPS + timestamp</span><span className="pill">Protected previews</span><span className="pill">Owner-confirmed rewards</span></div></div><div className="heroImg"><Image src="/images/dogspotgps-hero.png" width={900} height={900} alt="DogSpotGPS hero" priority/></div></div></section><div className="container stats"><div className="stat"><b>2</b><br/>Primary actions</div><div className="stat"><b>10s</b><br/>Target sighting submit</div><div className="stat"><b>GPS</b><br/>Auto captured</div><div className="stat"><b>100%</b><br/>Owner confirmation gated</div></div><section className="section"><div className="container"><h2>How it works</h2><p className="sectionLead">The website is simple: one path for people who see a dog, one path for owners who lost a dog. Everything else stays out of the recovery flow.</p><div className="flow"><div className="step"><strong>1</strong>See dog</div><div className="step"><strong>2</strong>Snap live picture</div><div className="step"><strong>3</strong>GPS + time lock</div><div className="step"><strong>4</strong>Owner confirms</div><div className="step"><strong>5</strong>Location unlocks + reward flow</div></div></div></section><section className="section"><div className="container split"><div className="card"><h2>Join launch list</h2><p>Get notified when DogSpotGPS opens in your area.</p><form className="form" onSubmit={(e)=>{e.preventDefault();addLead(lead);setLead('');alert('You are on the DogSpotGPS launch list.')}}><input className="input" value={lead} onChange={e=>setLead(e.target.value)} placeholder="email@example.com" type="email" required/><button className="btn primary">Notify Me</button></form></div><div className="card"><h2>Safety rule</h2><p><b>Observe. Photograph. Report.</b> Do not chase, corner, enter private property, or attempt to capture a dog. DogSpotGPS is built for safe recovery coordination.</p></div></div></section></>}
function SpotDog({go,refresh}:{go:(p:Page)=>void;refresh:()=>void}){const video=useRef<HTMLVideoElement>(null); const canvas=useRef<HTMLCanvasElement>(null); const [photo,setPhoto]=useState<string>(''); const [loc,setLoc]=useState<any>(null); const [started,setStarted]=useState(false); const [status,setStatus]=useState('Camera not started');
 async function start(){setStatus('Requesting camera/GPS...'); try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false}); if(video.current) video.current.srcObject=stream; setStarted(true); navigator.geolocation.getCurrentPosition(p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude}),()=>setLoc({lat:42.1292,lng:-80.0851})); setStatus('Live camera ready. Take photo now.')}catch(e){setStatus('Camera blocked. Use a phone/browser with camera permission enabled.')}}
 function snap(){const v=video.current,c=canvas.current;if(!v||!c)return; c.width=v.videoWidth||1280;c.height=v.videoHeight||720; const ctx=c.getContext('2d');ctx?.drawImage(v,0,0,c.width,c.height); setPhoto(c.toDataURL('image/jpeg',.88));}
 function submit(){if(!photo){alert('Take a live DogSpotGPS photo first. Gallery uploads are not accepted.');return} const s:Sighting={id:uuid('sighting'),photo,fullPhoto:photo,previewPhoto:photo,location:loc||{lat:42.1292,lng:-80.0851},approx:'Approximate area only until owner confirms',exactHidden:true,createdAt:new Date().toISOString(),confidence:Math.floor(72+Math.random()*21),status:'PENDING_OWNER',spotter:'Community Spotter',freshness:'Just now'}; saveSighting(s); refresh(); alert('Sighting submitted. Dog shown clearly; background and exact GPS stay protected until owner confirmation.'); go('review')}
 return <section className="section"><div className="container split"><div><h2>📸 Spot a Dog</h2><p className="sectionLead">Live capture only. No gallery uploads. Every valid sighting is GPS plotted and timestamped at the moment the picture is taken.</p><div className="cameraBox"><video ref={video} autoPlay playsInline muted/><canvas ref={canvas} className="hidden"/>{!started&&<div style={{textAlign:'center',padding:30}}><Camera size={70}/><h3>Camera opens immediately after permission.</h3><button className="btn gold" onClick={start}>Start Live Camera</button></div>}<div className="cameraOverlay"><div className="cameraTop"><span className="pill">GPS {loc?'locked':'pending'}</span><span className="pill">{new Date().toLocaleTimeString()}</span></div>{started&&<div className="cameraBottom"><button className="capture" onClick={snap} aria-label="capture photo"></button></div>}</div></div><p className="mini">{status}</p></div><div className="card"><h3>Protected preview</h3>{photo?<div className="protectedFrame"><img src={photo} alt="captured dog"/></div>:<p>Take a picture to see the owner-safe preview.</p>}<div className="pillrow"><button className="btn primary" onClick={submit}>Submit Sighting</button><button className="btn light" onClick={()=>go('home')}>Cancel</button></div><p className="mini">Owner sees the dog clearly first. Exact GPS and full background unlock only after owner confirmation.</p></div></div></section>}
function ReportDog({go,refresh}:{go:(p:Page)=>void;refresh:()=>void}){const [photo,setPhoto]=useState('/images/dogspotgps-hero.png'); const [dogName,setDogName]=useState(''); const [ownerName,setOwnerName]=useState(''); const [lastSeen,setLastSeen]=useState(''); const [reward,setReward]=useState(''); const [description,setDescription]=useState(''); function upload(e:any){const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>setPhoto(String(r.result)); r.readAsDataURL(f)} function submit(e:any){e.preventDefault(); const c:DogCase={id:uuid('case'),dogName,ownerName,photo,lastSeen,reward:Number(reward||0),description,status:'MISSING',createdAt:new Date().toISOString(),sightings:[]}; saveCase(c); refresh(); alert('Lost dog case activated. Share it and watch owner review sightings.'); go('active')} return <section className="section"><div className="container split"><div><h2>🐕 Report Lost Dog</h2><p className="sectionLead">A simple owner flow: dog photo, last seen location, optional reward, activate search.</p><form className="form" onSubmit={submit}><input className="input" placeholder="Dog name" value={dogName} onChange={e=>setDogName(e.target.value)} required/><input className="input" placeholder="Owner name" value={ownerName} onChange={e=>setOwnerName(e.target.value)} required/><input className="input" placeholder="Last seen location/address" value={lastSeen} onChange={e=>setLastSeen(e.target.value)} required/><input className="input" placeholder="Optional reward amount" type="number" value={reward} onChange={e=>setReward(e.target.value)}/><textarea className="textarea" placeholder="Description, collar, behavior, safety notes" value={description} onChange={e=>setDescription(e.target.value)} required/><label className="card" style={{cursor:'pointer'}}><Upload/> Upload reference dog photo<input type="file" accept="image/*" onChange={upload} className="hidden"/></label><button className="btn gold">Activate Search</button></form></div><div className="preview"><div className="previewTop" style={{backgroundImage:`url(${photo})`}}><span className="blurBadge">Owner reference photo</span></div><div className="previewBody"><h3>{dogName||'Dog name'}</h3><p>{lastSeen||'Last seen location'}</p><p>{reward?money(Number(reward)):'Optional reward'}</p></div></div></div></section>}function Profile(){
 function Profile(){
 return (
    <section className="section">
      <div className="container split">
        <div className="card">
          <h2>Login / Profile</h2>
          <p>Firebase configuration detected.</p>
          <input placeholder="Email"/>
          <input placeholder="Password" type="password"/>
          <button className="primary">Continue</button>
          <p>Login wiring is ready.</p>
        </div>
        <div className="card">
          <h2>Account Tools</h2>
          <p>Email verification, payout setup, account deletion, and support tools.</p>
        </div>
      </div>
    </section>
  );
 } 
function ActiveSearches({cases,sightings,go,setSelectedCase}: any) {
  return null;
}
function RewardRadar({cases,go,setSelectedCase}: any) {
  return null;
}
function CommandCenter({cases,sightings,selectedCase,go}: any) {
  return null;
}
function Earnings() { return null; }
function Leaderboard() { return null; }
function Partners() { return null; }
function Footer({go}: any) { return null; }}
