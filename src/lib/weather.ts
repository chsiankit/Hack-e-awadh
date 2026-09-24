import type { CityWeather, HeatLevel, WeatherData } from './types';

export const CITIES: CityWeather[] = [
  { city: 'Lucknow', cityHi: 'लखनऊ', baseTemp: 41, baseHumidity: 38 },
  { city: 'Kanpur', cityHi: 'कानपुर', baseTemp: 43, baseHumidity: 35 },
  { city: 'Delhi', cityHi: 'दिल्ली', baseTemp: 45, baseHumidity: 28 },
  { city: 'Varanasi', cityHi: 'वाराणसी', baseTemp: 42, baseHumidity: 40 },
  { city: 'Agra', cityHi: 'आगरा', baseTemp: 44, baseHumidity: 30 },
  { city: 'Jaipur', cityHi: 'जयपुर', baseTemp: 43, baseHumidity: 25 },
  { city: 'Patna', cityHi: 'पटना', baseTemp: 40, baseHumidity: 45 },
  { city: 'Bhopal', cityHi: 'भोपाल', baseTemp: 42, baseHumidity: 32 },
];

function computeHeatIndex(tempC: number, humidity: number): number {
  // Simplified heat index (apparent temperature) in Celsius
  const f = tempC * 9 / 5 + 32;
  const h = humidity;
  const hiF =
    -42.379 +
    2.04901523 * f +
    10.14333127 * h -
    0.22475541 * f * h -
    6.83783e-3 * f * f -
    5.481717e-2 * h * h +
    1.22874e-3 * f * f * h +
    8.5282e-4 * f * h * h -
    1.99e-6 * f * f * h * h;
  return Math.round((hiF - 32) * 5 / 9);
}

export function getHeatLevel(heatIndex: number): HeatLevel {
  if (heatIndex < 32) return 'green';
  if (heatIndex < 39) return 'yellow';
  if (heatIndex < 46) return 'orange';
  return 'red';
}

function jitter(base: number, range: number, seed: number): number {
  const variation = Math.sin(seed * 0.001) * range;
  return Math.round(base + variation);
}

export function getWeather(cityName: string, tick: number): WeatherData {
  const city = CITIES.find((c) => c.city === cityName) ?? CITIES[0];
  const temp = jitter(city.baseTemp, 3, tick);
  const humidity = jitter(city.baseHumidity, 8, tick + 1000);
  const heatIndex = computeHeatIndex(temp, humidity);
  return {
    city: city.city,
    temperature: temp,
    humidity,
    heatIndex,
    heatLevel: getHeatLevel(heatIndex),
    updatedAt: Date.now(),
  };
}

export const HEAT_LEVEL_COLORS: Record<HeatLevel, { bg: string; text: string; border: string; label: string }> = {
  green: { bg: 'bg-emerald-500', text: 'text-emerald-50', border: 'border-emerald-600', label: 'Safe' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-50', border: 'border-yellow-600', label: 'Caution' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-50', border: 'border-orange-600', label: 'High Risk' },
  red: { bg: 'bg-red-600', text: 'text-red-50', border: 'border-red-700', label: 'Extreme' },
};
