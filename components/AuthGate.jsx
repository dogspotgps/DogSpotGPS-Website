'use client';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
export default function AuthGate({children}){const {user,loading}=useAuth();if(loading)return <div className="container"><div className="card">Loading...</div></div>;if(!user)return <div className="container"><div className="card"><h1>Login required</h1><p className="muted">Please login to use DogSpotGPS.</p><Link className="btn" href="/login">Login</Link></div></div>;return children}
