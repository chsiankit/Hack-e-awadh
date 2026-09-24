export type HousingType = 'concrete' | 'tin_roof' | 'mud_house';
export type CoolingAsset = 'ac' | 'cooler' | 'fan' | 'none';
export type WaterSource = 'piped' | 'borewell' | 'tanker' | 'none';
export type RiskLevel = 'low' | 'medium' | 'high';
export type HeatLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface HouseholdInput {
  name: string;
  location: string;
  seniors: number;
  children: number;
  outdoor_workers: number;
  housing_type: HousingType;
  cooling_assets: CoolingAsset[];
  water_source: WaterSource;
}

export interface RiskFactor {
  label: string;
  labelHi: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ActionItem {
  id: string;
  text: string;
  textHi: string;
  done: boolean;
}

export interface ActionCategory {
  category: 'immediate' | 'daily' | 'emergency';
  title: string;
  titleHi: string;
  items: ActionItem[];
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  actionPlan: ActionCategory[];
}

export interface Household extends HouseholdInput {
  id: string;
  vulnerability_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
  action_plan: ActionCategory[];
  created_at: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  heatIndex: number;
  heatLevel: HeatLevel;
  updatedAt: number;
}

export interface CityWeather {
  city: string;
  cityHi: string;
  baseTemp: number;
  baseHumidity: number;
}
