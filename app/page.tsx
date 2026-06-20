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
const Footer = ({go}: any) => null;
const Earnings = () => null;
const Leaderboard = () => null;
const Partners = () => null;
const ActiveSearches = ({cases,sightings,go,setSelectedCase}: any) => null;
const RewardRadar = ({cases,go,setSelectedCase}: any) => null;
const CommandCenter = ({cases,sightings,selectedCase,go}: any) => null;
const OwnerReview = ({cases,sightings,go,refresh}: any) => null;export default function Page(){
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
function Home({go,lead,setLead}:any){return null;}
function SpotDog({go,refresh}:any){return null;}
function ReportDog({go,refresh}:any){return null;}
function Profile(){return null;}
function ActiveSearches({cases,sightings,go,setSelectedCase}:any){return null;}
function OwnerReview({cases,sightings,go,refresh}:any){return null;}
function RewardRadar({cases,go,setSelectedCase}:any){return null;}
function CommandCenter({cases,sightings,selectedCase,go}:any){return null;}
function Earnings(){return null;}
function Leaderboard(){return null;}
function Partners(){return null;}
function Footer({go}:any){return null;}
