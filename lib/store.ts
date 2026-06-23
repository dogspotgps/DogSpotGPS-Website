
export type DogCase = {
  id: string; dogName: string; breed: string; description: string;
  lastSeen: string; reward: number; status: 'Searching'|'Reviewing'|'Found';
  ownerPhone: string; createdAt: string; image: string;
};
export type Sighting = {
  id: string; caseId: string; photo: string; lat: number; lng: number;
  note: string; status: 'Pending owner review'|'Confirmed'|'Rejected'; createdAt: string;
};

const CASES = 'dogspotgps_cases_v1';
const SIGHTINGS = 'dogspotgps_sightings_v1';
const LEADS = 'dogspotgps_leads_v1';

const seedCases: DogCase[] = [{
  id: 'case-bella', dogName: 'Bella', breed: 'Golden Retriever',
  description: 'Friendly, red collar, nervous near traffic.',
  lastSeen: 'Near Frontier Park, Erie PA', reward: 250,
  status: 'Searching', ownerPhone: 'Private until confirmed',
  createdAt: new Date().toISOString(), image: '/images/dogspotgps-hero.svg'
}];

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

export function getCases() { return read<DogCase[]>(CASES, seedCases); }
export function saveCase(input: Omit<DogCase,'id'|'createdAt'|'status'|'image'>) {
  const next: DogCase = { ...input, id: 'case-' + Date.now(), createdAt: new Date().toISOString(), status: 'Searching', image: '/images/dogspotgps-hero.svg' };
  write(CASES, [next, ...getCases()]); return next;
}
export function updateCase(id: string, patch: Partial<DogCase>) {
  const all = getCases().map(c => c.id === id ? { ...c, ...patch } : c);
  write(CASES, all); return all;
}
export function getSightings() { return read<Sighting[]>(SIGHTINGS, []); }
export function saveSighting(input: Omit<Sighting,'id'|'createdAt'|'status'>) {
  const next: Sighting = { ...input, id: 'sighting-' + Date.now(), createdAt: new Date().toISOString(), status: 'Pending owner review' };
  write(SIGHTINGS, [next, ...getSightings()]); return next;
}
export function updateSighting(id: string, patch: Partial<Sighting>) {
  const all = getSightings().map(s => s.id === id ? { ...s, ...patch } : s);
  write(SIGHTINGS, all); return all;
}
export function addLead(email: string) {
  if (!email) return;
  write(LEADS, Array.from(new Set([email, ...read<string[]>(LEADS, [])])));
}
export function getLeads() { return read<string[]>(LEADS, []); }
