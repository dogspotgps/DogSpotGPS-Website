// @ts-nocheck
'use client';

export default function Page() {
  return (
    <main>

      {/* ── HERO ── */}
      <section style={{
        background:'linear-gradient(135deg,#0A0D16 0%,#1B2236 100%)',
        minHeight:'100vh', display:'flex', alignItems:'center',
        justifyContent:'center', padding:'120px 24px 80px',
        textAlign:'center', position:'relative'
      }}>
        <div style={{ maxWidth:'800px', width:'100%' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(255,107,53,0.12)', border:'1px solid rgba(255,107,53,0.3)',
            borderRadius:'100px', padding:'6px 16px',
            fontSize:'13px', fontWeight:'800', color:'#FF6B35',
            letterSpacing:'1px', textTransform:'uppercase', marginBottom:'28px'
          }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%',
              background:'#FF6B35', display:'inline-block',
              animation:'pulse 1.8s ease-in-out infinite' }} />
            🐾 Launching Soon — Join the Waitlist
          </div>

          <h1 style={{
            fontSize:'clamp(36px,7vw,68px)', fontWeight:'900',
            color:'#F2F2FF', letterSpacing:'-2px', lineHeight:'1.05',
            marginBottom:'24px'
          }}>
            Every loose dog could be<br />
            <span style={{ color:'#FF6B35' }}>someone's family.</span>
          </h1>

          <p style={{
            fontSize:'18px', color:'rgba(242,242,255,0.6)',
            maxWidth:'520px', margin:'0 auto 40px', lineHeight:'1.7'
          }}>
            DogSpotGPS turns your whole neighborhood into a rescue team.
            See a loose dog, snap a live photo, get paid when the owner confirms.
            No chasing. No drama. Just a photo.
          </p>

          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginBottom:'48px' }}>
            <a href="#notify" style={{
              background:'linear-gradient(135deg,#FF6B35,#FF9255)',
              color:'white', fontSize:'16px', fontWeight:'800',
              padding:'16px 28px', borderRadius:'14px',
              textDecoration:'none', display:'inline-block',
              boxShadow:'0 4px 24px rgba(255,107,53,0.45)'
            }}>📸 Get Early Access</a>
            <a href="#how" style={{
              background:'transparent', color:'#F2F2FF',
              fontSize:'16px', fontWeight:'700',
              padding:'16px 28px', borderRadius:'14px',
              textDecoration:'none', display:'inline-block',
              border:'1px solid #252F45'
            }}>See How It Works →</a>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'28px', flexWrap:'wrap' }}>
            {['Live GPS + timestamp','No gallery uploads',
              'Owner-confirmed rewards','Instant Stripe payment'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'8px',
                fontSize:'13px', fontWeight:'700', color:'rgba(242,242,255,0.5)' }}>
                <span style={{
                  width:'20px', height:'20px', borderRadius:'50%',
                  background:'rgba(0,229,160,0.15)', border:'1px solid rgba(0,229,160,0.4)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'10px', color:'#00E5A0'
                }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'#161C2E', padding:'48px 24px',
        borderTop:'1px solid #252F45', borderBottom:'1px solid #252F45' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'24px', textAlign:'center' }}>
          {[['10M+','Dogs go missing yearly in the US'],
            ['10s','To submit a sighting'],
            ['100%','Owner-verified before reward releases'],
            ['$0','Cost to spot and earn']].map(([num,label]) => (
            <div key={label}>
              <div style={{ fontSize:'40px', fontWeight:'900', color:'#FF6B35',
                letterSpacing:'-1.5px', lineHeight:'1', marginBottom:'6px' }}>{num}</div>
              <div style={{ fontSize:'13px', fontWeight:'700',
                color:'rgba(242,242,255,0.5)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background:'#F8F9FF', padding:'96px 24px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <p style={{ fontSize:'12px', fontWeight:'800', color:'#FF6B35',
            letterSpacing:'2px', textTransform:'uppercase', marginBottom:'14px' }}>
            How It Works
          </p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:'900',
            color:'#1A1F35', letterSpacing:'-1.5px', marginBottom:'16px' }}>
            Simple by design.<br />Powerful by default.
          </h2>
          <p style={{ fontSize:'17px', color:'#6B7280', maxWidth:'520px',
            lineHeight:'1.6', marginBottom:'64px' }}>
            Two paths. One for the person who sees a loose dog.
            One for the owner who lost one.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'16px' }}>
            {[['👀','See a dog','Spot a loose dog running around your neighborhood'],
              ['📸','Snap a photo','Live camera only — GPS and timestamp auto-captured'],
              ['🔒','Location hidden','Exact GPS stays private until owner confirms'],
              ['✅','Owner confirms','Owner reviews the photo and verifies their dog'],
              ['💰','Reward pays','Location unlocks, Stripe transfers reward instantly']].map(([icon,title,desc]) => (
              <div key={title} style={{ textAlign:'center', padding:'0 8px' }}>
                <div style={{
                  width:'80px', height:'80px', borderRadius:'50%',
                  background:'white', border:'3px solid #FF6B35',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 20px', fontSize:'28px',
                  boxShadow:'0 0 0 6px rgba(255,107,53,0.1)'
                }}>{icon}</div>
                <div style={{ fontSize:'15px', fontWeight:'800',
                  color:'#1A1F35', marginBottom:'8px' }}>{title}</div>
                <div style={{ fontSize:'13px', color:'#6B7280', lineHeight:'1.5' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PATHS ── */}
      <section style={{ background:'white', padding:'96px 24px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <p style={{ fontSize:'12px', fontWeight:'800', color:'#FF6B35',
            letterSpacing:'2px', textTransform:'uppercase', marginBottom:'14px' }}>
            Who It's For
          </p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:'900',
            color:'#1A1F35', letterSpacing:'-1.5px', marginBottom:'56px' }}>
            Two sides.<br />One rescue network.
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

            {/* OWNER */}
            <div style={{ background:'linear-gradient(135deg,#0A0D16,#1B2236)',
              borderRadius:'24px', padding:'40px', border:'1px solid #252F45' }}>
              <span style={{ fontSize:'52px', display:'block', marginBottom:'20px' }}>🏠</span>
              <h3 style={{ fontSize:'26px', fontWeight:'900', color:'#F2F2FF',
                letterSpacing:'-0.5px', marginBottom:'12px' }}>
                Lost your dog?<br />Your whole neighborhood is looking.
              </h3>
              <p style={{ fontSize:'15px', color:'rgba(242,242,255,0.6)',
                lineHeight:'1.6', marginBottom:'24px' }}>
                Post a case with a reward. Every DogSpotGPS user in your area
                becomes a spotter. Get notified the instant someone sees your dog.
              </p>
              {['Post dog photo + description',
                'Set your own reward amount',
                'Get instant sighting notifications',
                'Review blurred photos safely',
                'Confirm match — location unlocks',
                'Reward only releases after YOU confirm'].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'center', gap:'10px',
                  fontSize:'14px', fontWeight:'600', color:'rgba(242,242,255,0.7)',
                  marginBottom:'10px' }}>
                  <span style={{ width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
                    background:'rgba(0,229,160,0.15)', border:'1px solid rgba(0,229,160,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'10px', color:'#00E5A0' }}>✓</span>
                  {item}
                </div>
              ))}
              <a href="#notify" style={{
                display:'inline-block', marginTop:'24px',
                background:'linear-gradient(135deg,#FF6B35,#FF9255)',
                color:'white', padding:'14px 24px', borderRadius:'12px',
                fontSize:'15px', fontWeight:'800', textDecoration:'none',
                boxShadow:'0 4px 20px rgba(255,107,53,0.4)'
              }}>Report Lost Dog →</a>
            </div>

            {/* SPOTTER */}
            <div style={{ background:'linear-gradient(135deg,#FF6B35,#FF9255)',
              borderRadius:'24px', padding:'40px' }}>
              <span style={{ fontSize:'52px', display:'block', marginBottom:'20px' }}>📸</span>
              <h3 style={{ fontSize:'26px', fontWeight:'900', color:'white',
                letterSpacing:'-0.5px', marginBottom:'12px' }}>
                Snap a loose dog.<br />Get paid.
              </h3>
              <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.85)',
                lineHeight:'1.6', marginBottom:'24px' }}>
                You don't need to know the owner. You don't need to catch the dog.
                Just open the app, snap a live photo, and let the system do the rest.
              </p>
              {['Open app — camera is live immediately',
                'Snap any loose dog you see',
                'GPS auto-captured, no setup needed',
                'App matches photo to nearby cases',
                'No match? Saved as stray report 48hrs',
                'Owner confirms — money hits your wallet'].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'center', gap:'10px',
                  fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.9)',
                  marginBottom:'10px' }}>
                  <span style={{ width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
                    background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:'10px', color:'white' }}>✓</span>
                  {item}
                </div>
              ))}
              <a href="#notify" style={{
                display:'inline-block', marginTop:'24px',
                background:'rgba(0,0,0,0.2)', color:'white',
                padding:'14px 24px', borderRadius:'12px',
                fontSize:'15px', fontWeight:'800', textDecoration:'none'
              }}>Start Spotting →</a>
            </div>

          </div>
        </div>
      </section>

      {/* ── EARN ── */}
      <section style={{ background:'#0A0D16', padding:'96px 24px' }} id="earn">
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <p style={{ fontSize:'12px', fontWeight:'800', color:'#00E5A0',
            letterSpacing:'2px', textTransform:'uppercase', marginBottom:'14px' }}>
            For Spotters
          </p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:'900',
            color:'#F2F2FF', letterSpacing:'-1.5px', marginBottom:'16px' }}>
            Real money.<br />Real simple.
          </h2>
          <p style={{ fontSize:'17px', color:'rgba(242,242,255,0.5)',
            maxWidth:'480px', lineHeight:'1.6', marginBottom:'48px' }}>
            You're already walking around your neighborhood.
            Now those walks can pay.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
            {[['⚡','Quick Snap','Open app, camera is live immediately. See a dog, snap it in under 3 seconds. No navigation needed.','3 sec','From open to snap'],
              ['🔍','Auto Matching','AI scans nearby active cases and matches your photo. No browsing through cases manually.','AI-powered','GPS + photo matching'],
              ['💰','Instant Payout','Owner confirms your sighting, Stripe transfers the reward directly to your bank account.','Instant','Via Stripe Connect']].map(([icon,title,desc,val,sub]) => (
              <div key={title} style={{ background:'#161C2E', border:'1px solid #252F45',
                borderRadius:'20px', padding:'28px 24px' }}>
                <span style={{ fontSize:'36px', display:'block', marginBottom:'16px' }}>{icon}</span>
                <h3 style={{ fontSize:'18px', fontWeight:'800', color:'#F2F2FF', marginBottom:'8px' }}>{title}</h3>
                <p style={{ fontSize:'14px', color:'rgba(242,242,255,0.5)',
                  lineHeight:'1.6', marginBottom:'16px' }}>{desc}</p>
                <div style={{ fontSize:'28px', fontWeight:'900', color:'#FF6B35',
                  letterSpacing:'-0.5px' }}>{val}</div>
                <div style={{ fontSize:'12px', fontWeight:'700',
                  color:'rgba(242,242,255,0.4)', marginTop:'4px' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section style={{ background:'#F8F9FF', padding:'96px 24px' }}>
        <div style={{ maxWidth:'700px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ background:'white', border:'1px solid #E5E7EB',
            borderRadius:'24px', padding:'48px 40px',
            boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize:'52px', display:'block', marginBottom:'20px' }}>🛡️</span>
            <h2 style={{ fontSize:'28px', fontWeight:'900', color:'#1A1F35', marginBottom:'16px' }}>
              <span style={{ color:'#FF6B35' }}>Observe.</span> Photograph. Report.
            </h2>
            <p style={{ fontSize:'16px', color:'#6B7280', lineHeight:'1.6',
              marginBottom:'36px' }}>
              DogSpotGPS is built for safe community recovery.
              No chasing. No catching. No confrontation.
              Just a photo — and the community does the rest.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', textAlign:'left' }}>
              {[['📸','Photograph from a safe, legal public place only'],
                ['🚫','Never chase, corner, or attempt to capture a dog'],
                ['🏠','Never enter private property for any reason'],
                ['🔒','Exact GPS only revealed after owner confirmation'],
                ['📍','Photo blurred until owner verifies the match'],
                ['💰','Reward releases only after owner confirms']].map(([icon,text]) => (
                <div key={text} style={{ display:'flex', alignItems:'flex-start', gap:'12px',
                  background:'#F8F9FF', borderRadius:'12px', padding:'14px 16px' }}>
                  <span style={{ fontSize:'18px', flexShrink:0 }}>{icon}</span>
                  <span style={{ fontSize:'14px', fontWeight:'600', color:'#1A1F35',
                    lineHeight:'1.4' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background:'white', padding:'96px 24px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <p style={{ fontSize:'12px', fontWeight:'800', color:'#FF6B35',
            letterSpacing:'2px', textTransform:'uppercase', marginBottom:'14px' }}>FAQ</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:'900',
            color:'#1A1F35', letterSpacing:'-1.5px', marginBottom:'48px' }}>
            Common questions.
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'20px' }}>
            {[['Do I need to catch the dog to get paid?',
               'No. Observe, photograph, and report only. You just take a photo. The GPS and timestamp do the rest. Never chase or approach a dog.'],
              ['What if there\'s no active case for the dog I snapped?',
               'Your photo is saved as a Stray Report for 48 hours. If an owner posts a matching case, your sighting auto-links and you earn the reward automatically.'],
              ['How does the owner know it\'s really their dog?',
               'The owner reviews a blurred preview photo and approximate location. Only after they confirm does exact GPS unlock and reward release.'],
              ['How much can I earn as a spotter?',
               'Rewards are set by the dog owner — typically $25 to $500+. You receive the reward minus a 2.2% Stripe processing fee, paid instantly to your bank.'],
              ['Is my location shared with other users?',
               'No. Your exact GPS coordinates are never shown publicly. The owner only sees an approximate area until they confirm the match.'],
              ['What does it cost to post a lost dog case?',
               'You fund the reward amount you choose plus a 12% platform fee. No subscription. No monthly fees. You only pay when you post a case.']].map(([q,a]) => (
              <div key={q} style={{ background:'#F8F9FF', border:'1px solid #E5E7EB',
                borderRadius:'16px', padding:'24px' }}>
                <div style={{ fontSize:'16px', fontWeight:'800', color:'#1A1F35',
                  marginBottom:'10px' }}>{q}</div>
                <div style={{ fontSize:'14px', color:'#6B7280', lineHeight:'1.6' }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section id="notify" style={{ background:'#0A0D16', padding:'96px 24px' }}>
        <div style={{ maxWidth:'580px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:'900',
            color:'#F2F2FF', letterSpacing:'-1.5px', lineHeight:'1.1',
            marginBottom:'14px' }}>
            Be first when<br />DogSpotGPS launches.
          </h2>
          <p style={{ fontSize:'16px', color:'rgba(242,242,255,0.5)',
            marginBottom:'36px', lineHeight:'1.6' }}>
            Join the waitlist. Get notified the day the app goes live in your area.
            First users get founding member status.
          </p>
          <form id="emailForm" style={{ display:'flex', gap:'10px',
            background:'#161C2E', border:'1px solid #252F45',
            borderRadius:'16px', padding:'6px 6px 6px 20px', marginBottom:'16px' }}
            onSubmit={(e) => {
              e.preventDefault();
              const input = document.getElementById('emailIn') as HTMLInputElement;
              if (input?.value) {
                const form = document.getElementById('emailForm');
                const success = document.getElementById('emailSuccess');
                if (form) form.style.display = 'none';
                if (success) success.style.display = 'block';
              }
            }}>
            <input
              id="emailIn"
              type="email"
              placeholder="Enter your email address"
              required
              style={{ flex:1, background:'none', border:'none', fontSize:'16px',
                color:'#F2F2FF', outline:'none', fontFamily:'inherit' }}
            />
            <button type="submit" style={{
              background:'linear-gradient(135deg,#FF6B35,#FF9255)',
              color:'white', border:'none', borderRadius:'12px',
              padding:'12px 24px', fontSize:'15px', fontWeight:'800',
              cursor:'pointer', whiteSpace:'nowrap'
            }}>Notify Me →</button>
          </form>
          <div id="emailSuccess" style={{ display:'none',
            background:'rgba(0,229,160,0.1)', border:'1px solid rgba(0,229,160,0.3)',
            borderRadius:'14px', padding:'20px', fontSize:'16px',
            fontWeight:'700', color:'#00E5A0', marginBottom:'16px' }}>
            🎉 You're on the list! We'll notify you when DogSpotGPS launches.
          </div>
          <p style={{ fontSize:'13px', color:'rgba(242,242,255,0.35)' }}>
            No spam. Just a launch notification. Unsubscribe anytime.
          </p>

          {/* App Store Badges */}
          <div style={{ display:'flex', gap:'14px', justifyContent:'center',
            marginTop:'40px', flexWrap:'wrap' }}>
            {[['🍎','App Store'],['🤖','Google Play']].map(([icon,name]) => (
              <div key={name} style={{ display:'flex', alignItems:'center', gap:'10px',
                background:'#161C2E', border:'1px solid #252F45', borderRadius:'12px',
                padding:'12px 20px', color:'#F2F2FF' }}>
                <span style={{ fontSize:'28px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize:'10px', color:'#FF6B35', fontWeight:'800',
                    letterSpacing:'1px', textTransform:'uppercase' }}>Coming Soon</div>
                  <div style={{ fontSize:'15px', fontWeight:'800', color:'#F2F2FF' }}>{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#0A0D16', borderTop:'1px solid #252F45', padding:'48px 24px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:'40px' }}>
          <div>
            <div style={{ fontSize:'18px', fontWeight:'900', color:'#F2F2FF',
              marginBottom:'12px' }}>
              DogSpot<span style={{ color:'#FF6B35' }}>GPS</span>
            </div>
            <p style={{ fontSize:'13px', color:'rgba(242,242,255,0.5)',
              lineHeight:'1.6', marginBottom:'14px' }}>
              Picture-first, GPS-timestamped, owner-confirmed lost dog recovery.
              Community-powered. Reward-driven.
            </p>
            <p style={{ fontSize:'13px', color:'rgba(242,242,255,0.4)' }}>
              Support: <a href="mailto:admin@dogspotgps.com"
                style={{ color:'#FF6B35', textDecoration:'none' }}>
                admin@dogspotgps.com
              </a>
            </p>
          </div>
          {[['Product',['How It Works','#how'],['Earn Rewards','#earn'],['Get Early Access','#notify']],
            ['Community',['Spot a Dog','#notify'],['Report Lost Dog','#notify'],['Partners','#notify']],
            ['Legal',['Privacy','https://www.dogspotgps.com/privacy'],
              ['Terms','https://www.dogspotgps.com/terms'],
              ['Contact','mailto:admin@dogspotgps.com']]].map(([title,...links]) => (
            <div key={title}>
              <h4 style={{ fontSize:'12px', fontWeight:'800',
                color:'rgba(242,242,255,0.4)', letterSpacing:'1.5px',
                textTransform:'uppercase', marginBottom:'16px' }}>{title}</h4>
              {links.map(([label,href]) => (
                <a key={label} href={href} style={{ display:'block', fontSize:'14px',
                  fontWeight:'600', color:'rgba(242,242,255,0.5)',
                  textDecoration:'none', marginBottom:'10px' }}>{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:'1080px', margin:'32px auto 0',
          paddingTop:'24px', borderTop:'1px solid #252F45',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          fontSize:'13px', color:'rgba(242,242,255,0.3)', flexWrap:'wrap', gap:'12px' }}>
          <span>© 2025 DogSpotGPS · SpaceGhostWizard LLC · All rights reserved.</span>
          <span>Patent Pending</span>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          -webkit-font-smoothing: antialiased; }
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.7;transform:scale(1.05)}
        }
        @media(max-width:768px){
          div[style*="grid-template-columns:'repeat(5"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  );
}

  
