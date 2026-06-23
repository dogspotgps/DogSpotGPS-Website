import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  addDoc, query, where, orderBy, limit, increment, runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CaseDoc, SightingDoc, RewardDoc, AuditLogDoc, FraudFlagDoc, AdminAlertDoc } from '@/types';

const col = (name: string) => {
  if (!db) throw new Error('Firestore not initialised');
  return collection(db, name);
};

export async function getActiveCases(n = 20): Promise<CaseDoc[]> {
  if (!db) return DEMO_CASES;
  try {
    const q = query(col('cases'), where('status','==','active'), orderBy('createdAt','desc'), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as CaseDoc);
  } catch { return DEMO_CASES; }
}

export async function getSightingsForCase(caseId: string): Promise<SightingDoc[]> {
  if (!db) return [];
  const q = query(col('sightings'), where('caseId','==',caseId), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as SightingDoc);
}

export async function createSighting(data: Omit<SightingDoc, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not configured');
  const ref = doc(col('sightings'));
  await setDoc(ref, { ...data, id: ref.id });
  try { await updateDoc(doc(db, 'cases', data.caseId), { sightingCount: increment(1) }); } catch {}
  return ref.id;
}

export async function confirmSighting(sightingId: string, caseId: string) {
  if (!db) return;
  await runTransaction(db, async tx => {
    tx.update(doc(db, 'sightings', sightingId), { status: 'confirmed', locationUnlocked: true, rewardEligible: true });
    tx.update(doc(db, 'cases', caseId), { status: 'resolved', confirmedSightingId: sightingId, resolvedAt: Date.now() });
  });
}

export async function writeAudit(data: Omit<AuditLogDoc, 'id' | 'timestamp'>) {
  if (!db) return;
  try { await addDoc(col('auditLogs'), { ...data, timestamp: Date.now() }); } catch {}
}

export async function flagFraud(data: Omit<FraudFlagDoc, 'id' | 'createdAt' | 'resolved'>) {
  if (!db) return;
  try {
    await addDoc(col('fraudFlags'), { ...data, resolved: false, createdAt: Date.now() });
    await addDoc(col('adminAlerts'), { severity: data.severity === 'high' ? 'critical' : 'warning', type: 'fraud_flag', message: `${data.flagType} on ${data.targetType} ${data.targetId}`, entityId: data.targetId, resolved: false, createdAt: Date.now() });
  } catch {}
}

export const DEMO_CASES: CaseDoc[] = [
  { id: 'demo-bella', ownerId: 'demo', ownerEmail: 'owner@demo.com', dogName: 'Bella', breed: 'Golden Retriever', color: 'Gold', size: 'large', description: 'Friendly, red collar, nervous near traffic.', referencePhotoUrl: '/images/dogspotgps-hero.svg', thumbnailUrl: '/images/dogspotgps-hero.svg', lastSeenAddress: 'Near Frontier Park, Erie PA', lastSeenLat: 42.1292, lastSeenLng: -80.0851, rewardPool: 250, microRewardPerSighting: 5, bountyReward: 250, status: 'active', sightingCount: 3, expiresAt: Date.now() + 7*86400000, createdAt: Date.now() - 86400000, fraudFlags: 0 },
  { id: 'demo-max', ownerId: 'demo2', ownerEmail: 'owner2@demo.com', dogName: 'Max', breed: 'Labrador Mix', color: 'Black', size: 'large', description: 'Black lab, blue collar, responds to Max.', referencePhotoUrl: '/images/dogspotgps-icon.svg', thumbnailUrl: '/images/dogspotgps-icon.svg', lastSeenAddress: 'Pine Street, Erie PA', lastSeenLat: 42.1201, lastSeenLng: -80.0901, rewardPool: 150, microRewardPerSighting: 5, bountyReward: 150, status: 'active', sightingCount: 1, expiresAt: Date.now() + 5*86400000, createdAt: Date.now() - 43200000, fraudFlags: 0 },
];
