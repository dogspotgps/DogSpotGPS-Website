'use client';
import Link from 'next/link';
import { Dog } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
export default function Nav(){const {user,logout}=useAuth();return <nav className="nav"><Link className="brand" href="/"><span className="logo"><Dog size={23}/></span><span>DogSpotGPS</span></Link><div className="links"><Link href="/spot">Spot a Dog</Link><Link href="/report">Report Missing Dog</Link><Link href="/map">Map</Link><Link href="/rewards">Rewards</Link><Link href="/profile">Profile</Link>{user?<button className="btn secondary" onClick={logout}>Logout</button>:<Link className="btn" href="/login">Login</Link>}</div></nav>}
