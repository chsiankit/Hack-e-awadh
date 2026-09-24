import { useEffect, useState } from 'react';
import { Thermometer, Droplets, Gauge, MapPin, RefreshCw } from 'lucide-react';
import { CITIES, getWeather, HEAT_LEVEL_COLORS } from '@/lib/weather';
import type { WeatherData } from '@/lib/types';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';

interface Props {
  city: string;
  onCityChange: (city: string) => void;
}

export default function WeatherBanner({ city, onCityChange }: Props) {
  const { lang, t } = useLang();
  const [weather, setWeather] = useState<WeatherData>(() => getWeather(city, Date.now()));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setWeather(getWeather(city, Date.now() + tick));
  }, [city, tick]);

  useEffect(() => {
    const interval = setInterval(() => setTick((p) => p + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const colors = HEAT_LEVEL_COLORS[weather.heatLevel];
  const levelKey = `level${weather.heatLevel.charAt(0).toUpperCase()}${weather.heatLevel.slice(1)}` as Parameters<typeof t>[0];
  const adviceKey = `${weather.heatLevel}Advice` as Parameters<typeof t>[0];

  return (
    <div className={`rounded-2xl border-2 ${colors.border} overflow-hidden shadow-lg`}>
      <div className={`${colors.bg} ${colors.text} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wide">{t('weatherBanner')}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-semibold outline-none cursor-pointer border border-white/30 appearance-none"
          >
            {CITIES.map((c) => (
              <option key={c.city} value={c.city} className="text-slate-800">
                {lang === 'hi' ? c.cityHi : c.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-slate-800">{weather.temperature}</span>
            <span className="text-xl text-slate-400">°C</span>
          </div>
          <div className={`px-4 py-2 rounded-full ${colors.bg} ${colors.text} font-bold text-sm uppercase tracking-wide shadow-sm`}>
            {t(levelKey)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Thermometer className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase">{t('temperature')}</div>
              <div className="text-sm font-bold text-slate-700">{weather.temperature}°C</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase">{t('humidity')}</div>
              <div className="text-sm font-bold text-slate-700">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Gauge className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase">{t('heatIndex')}</div>
              <div className="text-sm font-bold text-slate-700">{weather.heatIndex}°C</div>
            </div>
          </div>
        </div>

        <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${colors.bg} ${colors.text} font-medium flex items-start gap-2`}>
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{t(adviceKey)}</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{t('feelsLike')}: {weather.heatIndex}°C</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            {t('lastUpdated')}: {new Date(weather.updatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
