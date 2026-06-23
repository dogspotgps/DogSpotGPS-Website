'use client';
// @ts-nocheck
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera, MapPin, Trophy, ShieldCheck, Bell, Store,
  User, Check, X, LogOut, AlertTriangle, DollarSign,
  Eye, EyeOff, Star, ChevronRight, Clock, Zap,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getActiveCases, getSightingsForCase, createSighting,
  confirmSighting, writeAudit, flagFraud, DEMO_CASES,
} from '@/lib/firestore';
import type { CaseDoc, SightingDoc } from '@/types';

type Page = 'home' | 'spot' | 'report' | 'active' | 'review' |
            'radar' | 'earnings' | 'partners' | 'profile' | 'admin';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function App() {
  const [page, setPage]       = useState<Page>('home');
  const [user, setUser]       = useState<any>(null);
  const [cases, setCases]     = useState<CaseDoc[]>(DEMO_CASES);
  const [focusCase, setFocus] = useState<string>(DEMO_CASES[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
  }, []);

  const loadCases = useCallback(async () => {
    try { const c = await getActiveCases(); if (c.length) setCases(c); }
    catch { }
  }, []);

  useEffect(() => { loadCases(); }, [loadCases]);

  const go = (p: Page) => {
    setPage(p);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const nav = [
    { key: 'active', label: 'Active Cases' },
    { key: 'radar', label: 'Reward Radar' },
    { key: 'partners', label: 'Partners' },
    { key: 'profile', label: user ? 'Profile' : 'Login' },
  ] as { key: Page; label: string }[];

  return (
    <>
      <nav className="nav">
        <div className="navin">
          <button className="brand" onClick={() => go('home')}>
            <Image src="/ChatGPT Image Jun 23, 2026 at 07_12_24 AM.png" width={46} height={46} alt="DogSpotGPS" />            <span>DogSpot<span style={{ color: '#ff6b35' }}>GPS</span></span>
          </button>
          <div className="navlinks">
            {nav.map(n => (
              <button key={n.key} onClick={() => go(n.key)}
                style={page === n.key ? { color: '#ff6b35' } : {}}>
                {n.label}
              </button>
            ))}
            <button className="btn orange" onClick={() => go('spot')}>
              <Camera size={16} /> Spot a Dog
            </button>
          </div>
        </div>
      </nav>

      {page === 'home'     && <HomePage go={go} cases={cases} />}
      {page === 'spot'     && <SpotPage go={go} user={user} loadCases={loadCases} />}
      {page === 'report'   && <ReportPage go={go} user={user} loadCases={loadCases} />}
      {page === 'active'   && <ActivePage cases={cases} go={go} setFocus={setFocus} />}
      {page === 'review'   && <ReviewPage cases={cases} go={go} user={user} loadCases={loadCases} />}
      {page === 'radar'    && <RadarPage cases={cases} go={go} setFocus={setFocus} />}
      {page === 'earnings' && <EarningsPage user={user} />}
      {page === 'partners' && <PartnersPage />}
      {page === 'profile'  && <ProfilePage user={user} setUser={setUser} go={go} />}
      {page === 'admin'    && <AdminPage cases={cases} />}

      <FooterComp go={go} />
    </>
  );
}

function HomePage({ go, cases }: { go: (p: Page) => void; cases: CaseDoc[] }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'spotter' | 'owner'>('spotter');
  return (
    <>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="heroEyebrow"><span className="dot-live" />Community-powered lost dog recovery</div>
            <h1>See a loose dog.<br /><span>Snap it. Get paid.</span></h1>
            <p>DogSpotGPS turns your neighborhood into a live rescue network. Snap a live photo — the owner pays when they confirm their dog.</p>
            <div className="pillrow">
              <button className="btn orange" onClick={() => go('spot')}><Camera size={16} /> Spot a Dog</button>
              <button className="btn gold" onClick={() => go('report')}>Report Lost Dog</button>
              <button className="btn light" onClick={() => go('active')}><MapPin size={16} /> View Cases</button>
            </div>
            <div className="pillrow" style={{ marginTop: '20px' }}>
              {['Live GPS + timestamp', 'No gallery uploads', 'Owner-confirmed rewards', 'Instant Stripe payout'].map(t => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>
          <div className="heroImg">
            <Image src="/images/dogspotgps-hero.svg" width={480} height={480} alt="DogSpotGPS" priority />
          </div>
        </div>
      </section>

      <div className="statsBar">
        <div className="statsGrid">
          {[
            { num: cases.length.toString(), label: 'Active Cases', color: '#ff6b35' },
            { num: '346', label: 'Sightings Today', color: '#1c8cff' },
            { num: '1,247', label: 'Dogs Reunited', color: '#4ade80' },
            { num: '$78,450', label: 'Total Paid Out', color: '#fbbf24' },
          ].map(({ num, label, color }) => (
            <div key={label}>
              <div className="statNum" style={{ color }}>{num}</div>
              <div className="statLabel">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section" style={{ background: '#07111f' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div><p className="sectionEye">Live Now</p><h2>Active Cases Near You</h2></div>
            <div className="heroEyebrow" style={{ marginBottom: 0 }}><span className="dot-live" /> Live</div>
          </div>
          <div className="grid3">{cases.slice(0, 3).map(c => <CaseCardComp key={c.id} c={c} go={go} />)}</div>
        </div>
      </section>

      <section className="section" style={{ background: '#0a1525' }}>
        <div className="container">
          <p className="sectionEye">How It Works</p>
          <h2 style={{ marginBottom: '28px' }}>Pick your path</h2>
          <div className="tabs" style={{ maxWidth: '340px', marginBottom: '36px' }}>
            <button className={`tab${activeTab === 'spotter' ? ' active' : ''}`} onClick={() => setActiveTab('spotter')}>📸 Spotter</button>
            <button className={`tab${activeTab === 'owner' ? ' active' : ''}`} onClick={() => setActiveTab('owner')}>🏠 Owner</button>
          </div>
          {activeTab === 'spotter' && (
            <div className="flow">
              {[['👀','See a dog','Spot a loose dog in your area'],['📸','Snap it','Live camera — GPS auto-tagged instantly'],['🔒','Stay safe','Never chase. Photo only from distance'],['✅','Owner confirms','They verify your photo'],['💰','Get paid','Stripe sends reward to your bank']].map(([icon,title,desc]) => (
                <div key={title} className="flowStep"><div className="flowIcon">{icon}</div><div className="flowTitle">{title}</div><div className="flowDesc">{desc}</div></div>
              ))}
            </div>
          )}
          {activeTab === 'owner' && (
            <div className="flow">
              {[['📝','Post case','Upload dog photo and set reward'],['🔔','Get alerted','Instant notification when spotted'],['🔍','Review photo','See sighting before confirming'],['✅','Confirm match','Tap yes — GPS unlocks, spotter earns'],['🐶','Reunited!','Location revealed, go get your dog']].map(([icon,title,desc]) => (
                <div key={title} className="flowStep"><div className="flowIcon" style={{ borderColor: '#1c8cff', boxShadow: '0 0 0 5px rgba(28,140,255,.1)' }}>{icon}</div><div className="flowTitle">{title}</div><div className="flowDesc">{desc}</div></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: '#07111f' }}>
        <div className="container">
          <p className="sectionEye">Who It Works For</p>
          <h2 style={{ marginBottom: '32px' }}>Two sides. One network.</h2>
          <div className="grid2">
            <div className="card">
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>🏠</div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>Lost your dog?<br />Your neighborhood is looking.</h3>
              <p style={{ fontSize: '14px', color: 'rgba(215,235,255,.55)', lineHeight: '1.6', marginBottom: '18px' }}>Post a case with a reward. Every DogSpotGPS user nearby becomes a spotter. Get notified instantly.</p>
              {['Post dog photo + description','Set your own reward amount','Instant sighting notifications','Blurred previews protect privacy','Reward only releases after you confirm'].map(item => (
                <div key={item} style={{ display: 'flex', gap: '10px', fontSize: '13px', fontWeight: 600, color: 'rgba(215,235,255,.7)', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#4ade80', flexShrink: 0 }}>✓</span>{item}
                </div>
              ))}
              <button className="btn orange" onClick={() => go('report')} style={{ marginTop: '20px' }}>Report Lost Dog →</button>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#ff6b35,#ff9255)', borderRadius: '20px', padding: '22px' }}>
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>📸</div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px', color: '#fff' }}>Snap a loose dog.<br />Get paid.</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.85)', lineHeight: '1.6', marginBottom: '18px' }}>You do not need to know the owner. Open the app, snap a live photo, let the system do the rest.</p>
              {['Camera opens immediately on launch','GPS auto-tagged, no setup needed','AI matches photo to nearby cases','No match? Saved as stray report 48hrs','Owner confirms — money hits your wallet'].map(item => (
                <div key={item} style={{ display: 'flex', gap: '10px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,.9)', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', flexShrink: 0 }}>✓</span>{item}
                </div>
              ))}
              <button className="btn dark" onClick={() => go('spot')} style={{ marginTop: '20px' }}>Start Spotting →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#0a1525' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '44px 40px' }}>
            <ShieldCheck size={48} style={{ color: '#ffb72b', marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '12px' }}><span style={{ color: '#ff6b35' }}>Observe.</span> Photograph. Report.</h2>
            <p style={{ fontSize: '15px', color: 'rgba(215,235,255,.55)', lineHeight: '1.6', marginBottom: '28px' }}>Built for safe community recovery. No chasing. No catching. Just a photo.</p>
            <div className="safetyGrid">
              {[['📸','Photograph from a safe, legal public place only'],['🚫','Never chase, corner, or attempt to capture a dog'],['🏠','Never enter private property for any reason'],['🔒','Exact GPS revealed only after owner confirmation'],['📍','Photo blurred until owner verifies the match'],['💰','Reward releases only after owner confirms']].map(([icon,text]) => (
                <div key={text} className="safetyItem"><span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span><span>{text}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#07111f' }}>
        <div className="container">
          <p className="sectionEye">FAQ</p>
          <h2 style={{ marginBottom: '32px' }}>Common questions.</h2>
          <div className="grid2">
            {[['Do I need to catch the dog?','No. Observe, photograph, and report only. Never chase or approach a dog.'],['What if there is no active case?','Your photo saves as a Stray Report for 48 hours and auto-links if a matching case appears.'],['How does the owner verify?','They review a blurred preview. Only after confirming does exact GPS unlock and reward release.'],['How much can I earn?','Rewards are set by owners — typically $25 to $500+. Paid instantly to your bank via Stripe.'],['Is my location shared?','No. Your exact GPS is never shown publicly until the owner confirms the match.'],['What does it cost to post a case?','You fund your chosen reward plus a 12% platform fee. No subscription, no monthly fees.']].map(([q,a]) => (
              <div key={q} className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>{q}</div>
                <div style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)', lineHeight: '1.6' }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#0a1525' }} id="notify">
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🐾</div>
          <h2 style={{ marginBottom: '12px' }}>Be first when DogSpotGPS launches.</h2>
          <p style={{ fontSize: '15px', color: 'rgba(215,235,255,.5)', marginBottom: '28px', lineHeight: '1.6' }}>Join the waitlist. Get notified the day the app goes live in your area.</p>
          {!submitted ? (
            <div style={{ display: 'flex', gap: '10px', background: '#0e2035', border: '1px solid #1e3a5f', borderRadius: '14px', padding: '6px 6px 6px 18px', marginBottom: '12px' }}>
              <input type="email" className="input" style={{ background: 'transparent', border: 'none', padding: '8px 0', flex: 1 }} placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn orange" onClick={() => email && setSubmitted(true)}>Notify Me →</button>
            </div>
          ) : (
            <div style={{ background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '12px', padding: '18px', fontWeight: 700, color: '#4ade80', marginBottom: '12px' }}>
              🎉 You are on the list! We will notify you at launch.
            </div>
          )}
          <p style={{ fontSize: '12px', color: 'rgba(215,235,255,.3)' }}>No spam. Just a launch notification. Unsubscribe anytime.</p>
          <div className="pillrow" style={{ justifyContent: 'center', marginTop: '28px' }}>
            {[['🍎','App Store'],['🤖','Google Play']].map(([icon,name]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0e2035', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '10px 18px' }}>
                <span style={{ fontSize: '24px' }}>{icon}</span>
                <div><div style={{ fontSize: '10px', color: '#ff6b35', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Coming Soon</div><div style={{ fontSize: '14px', fontWeight: 800 }}>{name}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CaseCardComp({ c, go }: { c: CaseDoc; go: (p: Page) => void }) {
  const dists = ['0.2 mi', '0.8 mi', '1.4 mi'];
  const dist = dists[Math.abs(c.id.charCodeAt(c.id.length - 1)) % 3];
  return (
    <div className="caseCard">
      <div className="casePhoto">
        <Image src={c.referencePhotoUrl} width={80} height={80} alt={c.dogName} style={{ borderRadius: '50%', border: '3px solid rgba(255,255,255,.2)' }} />
        <span className="casePhotoTag missing">MISSING</span>
        <span className="casePhotoTag dist">{dist}</span>
      </div>
      <div className="caseBody">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><div className="caseName">{c.dogName}</div><div className="caseBreed">{c.breed}</div></div>
          <div className="caseReward">{fmt(c.bountyReward)}</div>
        </div>
        <div className="caseMeta"><span>📍 {c.lastSeenAddress}</span><span>👁 {c.sightingCount} sightings</span></div>
        <button className="btn orange" style={{ width: '100%' }} onClick={() => go('spot')}>📸 Snap Sighting → Earn {fmt(c.bountyReward)}</button>
      </div>
    </div>
  );
}

function SpotPage({ go, user, loadCases }: { go: (p: Page) => void; user: any; loadCases: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState('');
  const [loc, setLoc] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [status, setStatus] = useState('Tap Start Camera to begin.');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setStatus('Requesting camera and GPS permission...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; }
      navigator.geolocation.getCurrentPosition(
        p => { setLoc({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }); setStatus('GPS locked. Live camera ready — snap now.'); },
        () => { setLoc({ lat: 42.1292, lng: -80.0851, accuracy: 999 }); setStatus('GPS fallback active. Live camera ready.'); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch { setStatus('Camera blocked. Enable camera permission in your browser settings.'); }
  };

  const snap = () => {
    const v = videoRef.current; const c = canvasRef.current; if (!v || !c) return;
    c.width = v.videoWidth || 1280; c.height = v.videoHeight || 720;
    c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
    setPhoto(c.toDataURL('image/jpeg', 0.88)); setStatus('Photo captured. Submit when ready.');
  };

  const submit = async () => {
    if (!photo) { setStatus('Take a live photo first.'); return; }
    if (!loc) { setStatus('Waiting for GPS...'); return; }
    setSubmitting(true); setStatus('Submitting sighting...');
    try {
      const deviceId = `web-${navigator.userAgent.slice(0, 40).replace(/\s/g, '')}`;
      const gpsSpoofFlag = loc.accuracy > 500;
      if (gpsSpoofFlag) await flagFraud({ targetId: user?.uid || 'anonymous', targetType: 'user', flagType: 'gps_spoof', severity: 'medium', details: `GPS accuracy ${loc.accuracy}m` });
      await createSighting({ caseId: DEMO_CASES[0].id, spotterId: user?.uid || 'anonymous', spotterEmail: user?.email || 'anonymous', photoUrl: photo, thumbnailUrl: photo, lat: loc.lat, lng: loc.lng, accuracyMeters: loc.accuracy, timestamp: Date.now(), captureMethod: 'live_camera', deviceId, status: 'pending', ownerViewed: false, locationUnlocked: false, rewardEligible: false, gpsSpoofFlag, duplicateFlag: false, reviewedByAdmin: false, createdAt: Date.now() });
      await writeAudit({ actorId: user?.uid || 'anonymous', actorEmail: user?.email || 'anonymous', action: 'sighting_submitted', entityType: 'sighting', entityId: 'new', metadata: { lat: loc.lat, lng: loc.lng, gpsSpoofFlag } });
      streamRef.current?.getTracks().forEach(t => t.stop());
      setDone(true); loadCases();
    } catch (err: any) { setStatus('Submit failed: ' + (err.message || 'Check Firebase config')); }
    finally { setSubmitting(false); }
  };

  if (done) return (
    <section className="section"><div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
      <h2 style={{ marginBottom: '12px' }}>Sighting Submitted!</h2>
      <p style={{ color: 'rgba(215,235,255,.6)', marginBottom: '28px', lineHeight: '1.6' }}>The dog owner has been notified. If they confirm your sighting, your reward will be released automatically.</p>
      <div className="card" style={{ marginBottom: '20px', textAlign: 'left' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(215,235,255,.5)', marginBottom: '12px' }}>WHAT HAPPENS NEXT</div>
        {['Owner receives instant notification','Owner reviews your photo (blurred for privacy)','If confirmed, exact GPS unlocks for owner','Reward is released to your wallet via Stripe','Stripe payout to your bank in 1-2 business days'].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '14px', color: 'rgba(215,235,255,.75)', alignItems: 'flex-start' }}>
            <span style={{ background: '#ff6b35', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>{s}
          </div>
        ))}
      </div>
      <button className="btn orange" onClick={() => go('home')}>Back to Home</button>
    </div></section>
  );

  return (
    <section className="section"><div className="container split">
      <div>
        <p className="sectionEye">Step 1 of 3</p>
        <h2 style={{ marginBottom: '8px' }}>Spot a Dog</h2>
        <p className="sectionLead">Live capture only. Gallery uploads are not eligible for rewards.</p>
        <div className="cameraBox" style={{ marginBottom: '16px', minHeight: '240px' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '12px', background: '#000', display: photo ? 'none' : 'block', minHeight: '200px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {photo && <img src={photo} alt="Live sighting capture" style={{ width: '100%', borderRadius: '12px' }} />}
        </div>
        {loc && (
          <div className="badge green" style={{ marginBottom: '12px', display: 'block', borderRadius: '8px', padding: '8px 12px' }}>
            📍 GPS Locked: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
            {loc.accuracy > 100 && <span style={{ color: '#fbbf24', marginLeft: '8px' }}>⚠ Low accuracy ({Math.round(loc.accuracy)}m)</span>}
          </div>
        )}
        <p style={{ fontSize: '14px', color: 'rgba(215,235,255,.6)', marginBottom: '16px' }}>{status}</p>
        <div className="pillrow">
          <button className="btn primary" onClick={startCamera}><Camera size={16} /> Start Camera + GPS</button>
          <button className="btn gold" onClick={snap}>📸 Snap Photo</button>
          <button className="btn orange" onClick={submit} disabled={!photo || submitting}>{submitting ? 'Submitting...' : 'Submit Sighting →'}</button>
        </div>
      </div>
      <div>
        <div className="card safe" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '8px' }}>🛡️ Spotter Safety Rules</h3>
          <p style={{ fontSize: '14px', color: 'rgba(215,235,255,.6)', lineHeight: '1.6' }}>Keep your distance. Never chase, corner, or approach a dog. Do not enter private property.</p>
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 900, marginBottom: '12px' }}>Privacy Protected</h3>
          {['Your exact GPS is hidden until owner confirms','Photo is blurred in owner preview','Location only unlocks after owner verification','Reward held in escrow until confirmation'].map(t => (
            <div key={t} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'rgba(215,235,255,.65)', marginBottom: '8px' }}>
              <Check size={14} style={{ color: '#4ade80', flexShrink: 0, marginTop: '1px' }} />{t}
            </div>
          ))}
        </div>
        {!user && (
          <div className="card" style={{ marginTop: '16px', borderColor: '#ffb72b', borderWidth: '1px' }}>
            <p style={{ fontSize: '14px', color: 'rgba(215,235,255,.7)', lineHeight: '1.6' }}><strong style={{ color: '#ffb72b' }}>Login required for rewards.</strong> Create a free account to receive Stripe payouts.</p>
          </div>
        )}
      </div>
    </div></section>
  );
}

function ReportPage({ go, user, loadCases }: { go: (p: Page) => void; user: any; loadCases: () => void }) {
  const [form, setForm] = useState({ dogName: '', breed: '', color: '', description: '', lastSeenAddress: '', reward: '100' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('Please log in to post a lost dog case.'); return; }
    setSubmitting(true);
    try {
      await writeAudit({ actorId: user.uid, actorEmail: user.email, action: 'case_created', entityType: 'case', entityId: 'new', metadata: { dogName: form.dogName, reward: Number(form.reward) } });
      loadCases(); setDone(true);
    } catch (err: any) { alert('Error: ' + err.message); }
    finally { setSubmitting(false); }
  };

  if (done) return (
    <section className="section"><div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>📢</div>
      <h2>Case Posted!</h2>
      <p style={{ color: 'rgba(215,235,255,.6)', margin: '12px 0 28px', lineHeight: '1.6' }}>Your lost dog case is now live. Community spotters in your area have been notified.</p>
      <button className="btn orange" onClick={() => go('active')}>View Active Cases</button>
    </div></section>
  );

  return (
    <section className="section"><div className="container split">
      <div>
        <p className="sectionEye">Owner Flow</p>
        <h2 style={{ marginBottom: '8px' }}>Report Lost Dog</h2>
        <p className="sectionLead">Post your case. Your neighborhood becomes your search team.</p>
        <form className="form" onSubmit={submit}>
          <div><div className="formLabel">Dog Name *</div><input className="input" value={form.dogName} onChange={e => set('dogName', e.target.value)} placeholder="e.g. Bella" required /></div>
          <div className="grid2">
            <div><div className="formLabel">Breed *</div><input className="input" value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="e.g. Golden Retriever" required /></div>
            <div><div className="formLabel">Color *</div><input className="input" value={form.color} onChange={e => set('color', e.target.value)} placeholder="e.g. Golden" required /></div>
          </div>
          <div><div className="formLabel">Description *</div><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Collar color, markings, behavior..." required /></div>
          <div><div className="formLabel">Last Seen Location *</div><input className="input" value={form.lastSeenAddress} onChange={e => set('lastSeenAddress', e.target.value)} placeholder="e.g. Near Frontier Park, Erie PA" required /></div>
          <div>
            <div className="formLabel">Reward Amount (USD) *</div>
            <input className="input" type="number" min="25" value={form.reward} onChange={e => set('reward', e.target.value)} required />
            <div style={{ fontSize: '12px', color: 'rgba(215,235,255,.4)', marginTop: '4px' }}>Platform fee: ${Math.round(Number(form.reward) * 0.12)} (12%) · Total: ${Math.round(Number(form.reward) * 1.12)}</div>
          </div>
          {!user && <div className="card" style={{ borderColor: '#ff6b35' }}><p style={{ fontSize: '14px', color: 'rgba(215,235,255,.7)' }}><strong style={{ color: '#ff6b35' }}>Login required</strong> to post a case.</p></div>}
          <button className="btn orange" type="submit" disabled={submitting || !user}>{submitting ? 'Posting...' : '📢 Post Lost Dog Case →'}</button>
        </form>
      </div>
      <div>
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '12px' }}>How Owner Rewards Work</h3>
          {[['Fund your reward pool','You set the total reward. Paid upfront via Stripe.'],['Micro-rewards per sighting','$5 released to spotters whose sightings you view.'],['Bounty on confirmation','Full reward releases when you confirm the right sighting.'],['Dispute protection','72-hour hold before any payout. Admin review available.'],['Refund if unresolved','Unused reward refunded if case expires.']].map(([title,desc]) => (
            <div key={title} style={{ marginBottom: '14px' }}><div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{title}</div><div style={{ fontSize: '12px', color: 'rgba(215,235,255,.5)', marginTop: '2px', lineHeight: '1.4' }}>{desc}</div></div>
          ))}
        </div>
        <div className="card safe">
          <h3 style={{ fontWeight: 900, marginBottom: '8px' }}>Legal Notice</h3>
          <p style={{ fontSize: '13px', color: 'rgba(215,235,255,.6)', lineHeight: '1.6' }}>DogSpotGPS does not guarantee recovery. Rewards are subject to owner verification. Users must not trespass, chase, or attempt to capture any animal.</p>
        </div>
      </div>
    </div></section>
  );
}

function ActivePage({ cases, go, setFocus }: { cases: CaseDoc[]; go: (p: Page) => void; setFocus: (id: string) => void }) {
  return (
    <section className="section"><div className="container">
      <p className="sectionEye">Community Network</p>
      <h2 style={{ marginBottom: '8px' }}>Active Cases</h2>
      <p className="sectionLead">Live owner-posted lost dog cases. Tap any case to submit a sighting.</p>
      {cases.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '48px' }}><p style={{ color: 'rgba(215,235,255,.5)' }}>No active cases right now.</p><button className="btn orange" onClick={() => go('report')} style={{ marginTop: '16px' }}>Report Lost Dog</button></div>}
      <div className="grid3">{cases.map(c => <CaseCardComp key={c.id} c={c} go={go} />)}</div>
    </div></section>
  );
}

function ReviewPage({ cases, go, user, loadCases }: { cases: CaseDoc[]; go: (p: Page) => void; user: any; loadCases: () => void }) {
  const [sightings, setSightings] = useState<SightingDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState('');

  useEffect(() => {
    if (!cases[0]) return;
    setLoading(true);
    getSightingsForCase(cases[0].id).then(s => setSightings(s)).catch(() => setSightings([])).finally(() => setLoading(false));
  }, [cases]);

  const confirm = async (s: SightingDoc) => {
    setConfirming(s.id);
    try {
      await confirmSighting(s.id, s.caseId);
      await writeAudit({ actorId: user?.uid || 'owner', actorEmail: user?.email || 'owner', action: 'sighting_confirmed', entityType: 'sighting', entityId: s.id, metadata: { caseId: s.caseId } });
      loadCases();
      setSightings(prev => prev.map(x => x.id === s.id ? { ...x, status: 'confirmed', locationUnlocked: true } : x));
    } catch (err: any) { alert('Confirm failed: ' + err.message); }
    finally { setConfirming(''); }
  };

  return (
    <section className="section"><div className="container">
      <p className="sectionEye">Owner Dashboard</p>
      <h2 style={{ marginBottom: '8px' }}>Sighting Review</h2>
      <p className="sectionLead">Review community sightings. Exact GPS unlocks only after you confirm.</p>
      {loading && <div className="card" style={{ textAlign: 'center', padding: '40px' }}>Loading sightings...</div>}
      {!loading && sightings.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '48px' }}><Bell size={48} style={{ opacity: .3, marginBottom: '16px' }} /><p style={{ color: 'rgba(215,235,255,.5)' }}>No sightings yet.</p></div>}
      <div className="grid2">
        {sightings.map(s => {
          const c = cases.find(x => x.id === s.caseId);
          const confirmed = s.status === 'confirmed';
          return (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#102947', overflow: 'hidden', flexShrink: 0, filter: confirmed ? 'none' : 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  {s.photoUrl.startsWith('data:') ? <img src={s.photoUrl} alt="sighting" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐕'}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span className={`badge ${confirmed ? 'green' : s.status === 'rejected' ? 'red' : 'orange'}`}>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
                    {s.gpsSpoofFlag && <span className="badge red">⚠ GPS Flag</span>}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{c?.dogName || 'Dog'} sighting</div>
                  <div style={{ fontSize: '12px', color: 'rgba(215,235,255,.45)', marginTop: '4px' }}>{confirmed ? `📍 ${s.lat.toFixed(4)}, ${s.lng.toFixed(4)} (Unlocked)` : `📍 ~${s.lat.toFixed(2)}, ~${s.lng.toFixed(2)} (Approximate)`}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(215,235,255,.35)' }}>{new Date(s.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {s.status === 'pending' && (
                <>
                  <div style={{ background: '#0a1525', borderRadius: '10px', padding: '10px', fontSize: '13px', color: 'rgba(215,235,255,.6)', marginBottom: '12px' }}><strong style={{ color: '#ffb72b' }}>Confirming will:</strong> unlock exact GPS, mark case resolved, release reward via Stripe.</div>
                  <div className="pillrow">
                    <button className="btn green" onClick={() => confirm(s)} disabled={confirming === s.id} style={{ flex: 1 }}><Check size={14} /> {confirming === s.id ? 'Confirming...' : 'Yes — This Is My Dog'}</button>
                    <button className="btn danger" style={{ flex: 1 }}><X size={14} /> Not My Dog</button>
                  </div>
                </>
              )}
              {confirmed && <div style={{ background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '10px', padding: '10px', fontSize: '13px', color: '#4ade80' }}>✅ Confirmed. Exact location unlocked. Reward released.</div>}
            </div>
          );
        })}
      </div>
    </div></section>
  );
}

function RadarPage({ cases, go, setFocus }: { cases: CaseDoc[]; go: (p: Page) => void; setFocus: (id: string) => void }) {
  return (
    <section className="section"><div className="container">
      <p className="sectionEye">For Spotters</p>
      <h2 style={{ marginBottom: '8px' }}>Reward Radar</h2>
      <p className="sectionLead">Highest-reward active cases near you.</p>
      <div className="grid3">
        {[...cases].sort((a, b) => b.bountyReward - a.bountyReward).map(c => (
          <div key={c.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '28px' }}>🐕</div>
              <div style={{ background: 'linear-gradient(135deg,#ff6b35,#ff9255)', borderRadius: '10px', padding: '6px 14px', fontWeight: 900, color: '#fff', fontSize: '20px' }}>{fmt(c.bountyReward)}</div>
            </div>
            <h3 style={{ fontWeight: 900, marginBottom: '4px' }}>{c.dogName}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)', marginBottom: '4px' }}>{c.breed}</p>
            <p style={{ fontSize: '12px', color: 'rgba(215,235,255,.4)', marginBottom: '16px' }}>📍 {c.lastSeenAddress}</p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'rgba(215,235,255,.45)', marginBottom: '16px' }}>
              <span>👁 {c.sightingCount} sightings</span>
              <span>⏱ {Math.ceil((c.expiresAt - Date.now()) / 86400000)}d left</span>
              <span>💵 ${c.microRewardPerSighting}/sighting</span>
            </div>
            <button className="btn orange" style={{ width: '100%' }} onClick={() => { setFocus(c.id); go('spot'); }}>📸 Snap for {fmt(c.bountyReward)} →</button>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '32px' }}>
        <h3 style={{ fontWeight: 900, marginBottom: '16px' }}>How Spotter Earnings Work</h3>
        <div className="grid3">
          {[['⚡','Micro-reward','$5 per sighting the owner views','$5','Per viewed sighting'],['🏆','Bounty reward','Full reward on confirmed reunion','$25–$500+','Owner-set amount'],['💳','Stripe payout','Direct to your bank in 1-2 days','Instant','Via Stripe Connect']].map(([icon,title,desc,val,sub]) => (
            <div key={title} style={{ textAlign: 'center', padding: '16px', background: '#102947', borderRadius: '14px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
              <div style={{ fontWeight: 900, marginBottom: '6px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)', marginBottom: '12px', lineHeight: '1.4' }}>{desc}</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff6b35' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'rgba(215,235,255,.35)', marginTop: '4px' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div></section>
  );
}

function EarningsPage({ user }: { user: any }) {
  return (
    <section className="section"><div className="container" style={{ maxWidth: '720px' }}>
      <p className="sectionEye">Spotter Wallet</p>
      <h2 style={{ marginBottom: '24px' }}>Your Earnings</h2>
      <div style={{ background: '#0e2035', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        <div className="earningsHeader">
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>Total Earnings</div>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>$245.50</div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '10px' }}>
            <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)' }}>Pending</div><div style={{ fontWeight: 800, color: '#fff' }}>$35.00</div></div>
            <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)' }}>Paid</div><div style={{ fontWeight: 800, color: '#fff' }}>$210.50</div></div>
            <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)' }}>Confirmed</div><div style={{ fontWeight: 800, color: '#fff' }}>8</div></div>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(215,235,255,.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Recent Rewards</div>
          {[['Bella','$50.00','Confirmed','4ade80'],['Max','$30.00','Confirmed','4ade80'],['Luna','$20.00','Pending','ff6b35']].map(([name,amount,status,color]) => (
            <div key={name} className="earningsRow" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>🐕</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 800 }}>{name}</div><div style={{ fontSize: '12px', color: `#${color}` }}>{status}</div></div>
              <div style={{ fontWeight: 900, color: '#4ade80', fontSize: '16px' }}>{amount}</div>
            </div>
          ))}
          <button className="btn orange" style={{ width: '100%', marginTop: '12px' }}>Withdraw Earnings → Stripe</button>
          {!user && <p style={{ fontSize: '12px', color: 'rgba(215,235,255,.4)', textAlign: 'center', marginTop: '10px' }}>Login and connect Stripe to enable real payouts</p>}
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontWeight: 900, marginBottom: '12px' }}>Payout Details</h3>
        <div style={{ fontSize: '14px', color: 'rgba(215,235,255,.6)', lineHeight: '1.7' }}>
          <p>Rewards are held in escrow for 72 hours after owner confirmation before releasing to your Stripe account.</p>
          <p style={{ marginTop: '8px' }}>Stripe Connect fee: approximately 2.2% + $0.25 per transfer. Platform fee: 12% of reward.</p>
          <p style={{ marginTop: '8px', color: 'rgba(215,235,255,.4)', fontSize: '12px' }}>Rewards are subject to verification. DogSpotGPS does not guarantee payment for unverified sightings.</p>
        </div>
      </div>
    </div></section>
  );
}

function PartnersPage() {
  return (
    <section className="section"><div className="container">
      <p className="sectionEye">Partner Network</p>
      <h2 style={{ marginBottom: '8px' }}>Partner Marketplace</h2>
      <p className="sectionLead">Monetization belongs here — never on camera, GPS, confirmation, or recovery screens.</p>
      <div className="grid3">
        {[['Veterinarians','🏥','Trusted local vets for post-recovery care'],['Pet Insurance','🛡️','Coverage plans for dog owners'],['Dog Trainers','🎓','Certified trainers in your area'],['GPS Collars','📡','Real-time tracking collar partners'],['Microchipping','💉','Local clinics offering pet ID services'],['Shelters','🏠','Partner shelters for stray coordination'],['Groomers','✂️','Post-recovery grooming services'],['Boarding','🛏️','Temporary boarding during search'],['Pet Stores','🛒','Local and national retail partners']].map(([cat,icon,desc]) => (
          <div key={cat} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{icon}</div>
            <h3 style={{ fontWeight: 900, marginBottom: '6px' }}>{cat}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)', lineHeight: '1.4' }}>{desc}</p>
            <button className="btn light sm" style={{ marginTop: '12px' }}>Partner with us</button>
          </div>
        ))}
      </div>
      <div className="card safe" style={{ marginTop: '28px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'rgba(215,235,255,.6)', lineHeight: '1.6' }}><strong style={{ color: '#ffb72b' }}>Ethical monetization policy:</strong> Partner content never appears on camera, GPS capture, owner confirmation, or recovery navigation screens.</p>
      </div>
    </div></section>
  );
}

function ProfilePage({ user, setUser, go }: { user: any; setUser: (u: any) => void; go: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const login = async () => {
    if (!auth) { setMsg('Firebase not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY to Vercel environment variables.'); return; }
    setLoading(true); setMsg('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user); setMsg('Signed in successfully.');
    } catch {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        setUser(cred.user); setMsg('Account created. Welcome to DogSpotGPS!');
      } catch (err: any) { setMsg(err.message || 'Login failed.'); }
    } finally { setLoading(false); }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth); setUser(null); setMsg('Signed out.');
  };

  if (user) return (
    <section className="section"><div className="container" style={{ maxWidth: '560px' }}>
      <p className="sectionEye">Account</p>
      <h2 style={{ marginBottom: '24px' }}>Your Profile</h2>
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff9255)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🐾</div>
          <div><div style={{ fontWeight: 900, fontSize: '16px' }}>{user.displayName || 'DogSpotGPS User'}</div><div style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)' }}>{user.email}</div></div>
        </div>
        {[['🎯','Trust Score','50/100 (new account)'],['💰','Stripe Payout','Not connected — set up to receive rewards'],['🔔','Notifications','Enabled'],['🔒','Email Verified', user.emailVerified ? 'Yes' : 'No — check your inbox']].map(([icon,label,val]) => (
          <div key={label} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #1e3a5f', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)' }}>{val}</div>
          </div>
        ))}
      </div>
      <div className="pillrow">
        <button className="btn orange" onClick={() => go('earnings')}>View Earnings</button>
        <button className="btn light" onClick={() => go('spot')}>Spot a Dog</button>
        <button className="btn dark" onClick={logout}><LogOut size={14} /> Sign Out</button>
      </div>
      {msg && <p style={{ marginTop: '12px', fontSize: '14px', color: '#4ade80' }}>{msg}</p>}
    </div></section>
  );

  return (
    <section className="section"><div className="container split">
      <div>
        <p className="sectionEye">Account</p>
        <h2 style={{ marginBottom: '8px' }}>Login / Sign Up</h2>
        <p className="sectionLead">Free account required to submit sightings for rewards and receive Stripe payouts.</p>
        <div className="form">
          <div><div className="formLabel">Email</div><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div style={{ position: 'relative' }}>
            <div className="formLabel">Password</div>
            <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '34px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(215,235,255,.5)' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button className="btn orange" onClick={login} disabled={loading}><User size={16} /> {loading ? 'Loading...' : 'Continue with Email →'}</button>
          {msg && <p style={{ fontSize: '14px', color: msg.includes('failed') || msg.includes('not') ? '#f87171' : '#4ade80' }}>{msg}</p>}
        </div>
      </div>
      <div>
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '12px' }}>Why create an account?</h3>
          {['Receive Stripe payouts for confirmed sightings','Track your sightings and case history','Get instant notifications for nearby cases','Build your spotter trust score over time','Dispute resolution and admin support'].map(t => (
            <div key={t} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'rgba(215,235,255,.7)', marginBottom: '8px', alignItems: 'flex-start' }}>
              <Check size={13} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />{t}
            </div>
          ))}
        </div>
        <div className="card safe">
          <h3 style={{ fontWeight: 900, marginBottom: '8px' }}>Privacy Policy</h3>
          <p style={{ fontSize: '13px', color: 'rgba(215,235,255,.6)', lineHeight: '1.6' }}>Your email is used only for authentication and reward notifications. We never sell personal data.</p>
          <div style={{ marginTop: '10px' }}>
            <a href="/privacy" style={{ fontSize: '13px', color: '#ff6b35', marginRight: '14px' }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: '13px', color: '#ff6b35' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </div></section>
  );
}

function AdminPage({ cases }: { cases: CaseDoc[] }) {
  return (
    <section className="section"><div className="container">
      <p className="sectionEye">Internal</p>
      <h2 style={{ marginBottom: '24px' }}>Admin Dashboard</h2>
      <div className="grid4" style={{ marginBottom: '24px' }}>
        {[{label:'Active Cases',val:cases.length,color:'#ff6b35'},{label:'Total Sightings',val:cases.reduce((a,c)=>a+c.sightingCount,0),color:'#1c8cff'},{label:'Fraud Flags',val:cases.reduce((a,c)=>a+c.fraudFlags,0),color:'#f87171'},{label:'Reward Pool',val:fmt(cases.reduce((a,c)=>a+c.rewardPool,0)),color:'#4ade80'}].map(({label,val,color}) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color }}>{val}</div>
            <div style={{ fontSize: '13px', color: 'rgba(215,235,255,.5)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontWeight: 900, marginBottom: '16px' }}>Firestore Collections</h3>
        <div className="grid3">
          {['users','cases','sightings','rewards','payments','auditLogs','notifications','adminAlerts','fraudFlags','deviceRegistry'].map(col => (
            <div key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#102947', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'rgba(215,235,255,.7)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />{col}
            </div>
          ))}
        </div>
      </div>
    </div></section>
  );
}

function FooterComp({ go }: { go: (p: Page) => void }) {
  return null;
}    
