export type UserRole = 'spotter' | 'owner' | 'admin';
export type CaseStatus = 'active' | 'resolved' | 'expired' | 'suspended';
export type SightingStatus = 'pending' | 'confirmed' | 'rejected' | 'disputed' | 'expired';
export type RewardStatus = 'held' | 'released' | 'disputed' | 'refunded' | 'admin_review';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'reversed';

export interface CaseDoc {
  id: string; ownerId: string; ownerEmail: string; dogName: string; breed: string;
  color: string; size: 'small'|'medium'|'large'; description: string;
  referencePhotoUrl: string; thumbnailUrl: string; lastSeenAddress: string;
  lastSeenLat: number; lastSeenLng: number; rewardPool: number;
  microRewardPerSighting: number; bountyReward: number; status: CaseStatus;
  sightingCount: number; confirmedSightingId?: string; resolvedAt?: number;
  expiresAt: number; createdAt: number; fraudFlags: number;
}

export interface SightingDoc {
  id: string; caseId: string; spotterId: string; spotterEmail: string;
  photoUrl: string; thumbnailUrl: string; lat: number; lng: number;
  accuracyMeters: number; timestamp: number; captureMethod: 'live_camera';
  deviceId: string; status: SightingStatus; ownerViewed: boolean;
  locationUnlocked: boolean; rewardEligible: boolean; rewardAmount?: number;
  rewardStatus?: RewardStatus; gpsSpoofFlag: boolean; duplicateFlag: boolean;
  reviewedByAdmin: boolean; createdAt: number;
}

export interface RewardDoc {
  id: string; caseId: string; sightingId: string; ownerId: string; spotterId: string;
  amount: number; platformFee: number; stripeFee: number; netPayout: number;
  status: RewardStatus; stripeTransferId?: string; disputeReason?: string;
  disputeOpenedAt?: number; releasedAt?: number; createdAt: number;
}

export interface AuditLogDoc {
  id: string; actorId: string; actorEmail: string; action: string;
  entityType: 'case'|'sighting'|'reward'|'user'|'payment'; entityId: string;
  metadata: Record<string, unknown>; ipAddress?: string; userAgent?: string; timestamp: number;
}

export interface FraudFlagDoc {
  id: string; targetId: string; targetType: 'user'|'sighting';
  flagType: 'gps_spoof'|'duplicate_photo'|'device_mismatch'|'velocity'|'manual';
  severity: 'low'|'medium'|'high'; details: string; resolved: boolean;
  resolvedBy?: string; createdAt: number;
}

export interface AdminAlertDoc {
  id: string; severity: 'info'|'warning'|'critical'; type: string;
  message: string; entityId?: string; resolved: boolean; createdAt: number;
}
