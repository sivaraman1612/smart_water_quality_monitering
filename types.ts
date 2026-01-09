
export type UserRole = 'SMART_USER' | 'STANDARD_USER';

export type Language = 'en' | 'ta' | 'hi';

export enum SafetyLevel {
  SAFE = 'SAFE',
  LOW_RISK = 'LOW_RISK',
  HIGH_RISK = 'HIGH_RISK',
  CRITICAL = 'CRITICAL'
}

export interface WaterParameters {
  ph: number;
  temp: number;
  turbidity: number;
  tds: number;
}

export interface WaterSource {
  id: string;
  name: string;
  district: string;
  params: WaterParameters;
  lastUpdated: string;
  sourceType: 'IOT' | 'MANUAL';
  location: {
    lat: number;
    lng: number;
  };
}

export interface TranslationSchema {
  title: string;
  subtitle: string;
  loginAs: string;
  admin: string;
  user: string;
  selectDistrict: string;
  selectSource: string;
  safetyStatus: string;
  safe: string;
  lowRisk: string;
  highRisk: string;
  critical: string;
  lastUpdated: string;
  params: {
    ph: string;
    temp: string;
    turbidity: string;
    tds: string;
  };
  aiPrediction: string;
  possibleDiseases: string;
  recommendations: string;
  nearestTanks: string;
  distance: string;
  updateData: string;
  manualEntry: string;
  iotConnection: string;
  connectIot: string;
  disclaimer: string;
  confidence: string;
}
