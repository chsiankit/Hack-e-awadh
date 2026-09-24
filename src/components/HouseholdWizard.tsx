import { useState } from 'react';
import {
  Home,
  Users,
  Baby,
  HardHat,
  Building2,
  Snowflake,
  Wind,
  Droplet,
  ChevronRight,
  ChevronLeft,
  Check,
  ClipboardList,
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';
import { CITIES } from '@/lib/weather';
import { assessRisk } from '@/lib/riskEngine';
import type { CoolingAsset, HousingType, HouseholdInput, WaterSource, RiskAssessment } from '@/lib/types';

interface Props {
  onComplete: (input: HouseholdInput, assessment: RiskAssessment) => void;
  initialCity: string;
}

const TOTAL_STEPS = 4;

export default function HouseholdWizard({ onComplete, initialCity }: Props) {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<HouseholdInput>({
    name: '',
    location: initialCity,
    seniors: 0,
    children: 0,
    outdoor_workers: 0,
    housing_type: 'concrete',
    cooling_assets: [],
    water_source: 'piped',
  });

  const update = (patch: Partial<HouseholdInput>) => setForm((p) => ({ ...p, ...patch }));

  const toggleCooling = (asset: CoolingAsset) => {
    setForm((p) => {
      if (asset === 'none') return { ...p, cooling_assets: ['none'] };
      const filtered = p.cooling_assets.filter((a) => a !== 'none');
      const exists = filtered.includes(asset);
      return {
        ...p,
        cooling_assets: exists ? filtered.filter((a) => a !== asset) : [...filtered, asset],
      };
    });
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 2) return form.cooling_assets.length > 0;
    return true;
  };

  const handleAssess = () => {
    const assessment = assessRisk(form);
    onComplete(form, assessment);
  };

  const housingOptions: { value: HousingType; icon: typeof Building2; label: string }[] = [
    { value: 'concrete', icon: Building2, label: t('concrete') },
    { value: 'tin_roof', icon: Home, label: t('tinRoof') },
    { value: 'mud_house', icon: Home, label: t('mudHouse') },
  ];

  const coolingOptions: { value: CoolingAsset; icon: typeof Snowflake; label: string }[] = [
    { value: 'ac', icon: Snowflake, label: t('ac') },
    { value: 'cooler', icon: Wind, label: t('cooler') },
    { value: 'fan', icon: Wind, label: t('fan') },
    { value: 'none', icon: Wind, label: t('none') },
  ];

  const waterOptions: { value: WaterSource; label: string }[] = [
    { value: 'piped', label: t('piped') },
    { value: 'borewell', label: t('borewell') },
    { value: 'tanker', label: t('tanker') },
    { value: 'none', label: t('noWater') },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <ClipboardList className="w-5 h-5 text-orange-400" />
          <h2 className="font-bold text-lg">{t('wizardTitle')}</h2>
        </div>
        <p className="text-slate-300 text-sm mt-1">{t('wizardSubtitle')}</p>
      </div>

      <div className="px-6 pt-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-orange-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-slate-400 mt-1.5 font-medium">
          {t('step')} {step + 1} {t('of')} {TOTAL_STEPS}
        </div>
      </div>

      <div className="px-6 py-5">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('hhName')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder={t('hhNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('hhLocation')}</label>
              <select
                value={form.location}
                onChange={(e) => update({ location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-700 appearance-none bg-white"
              >
                {CITIES.map((c) => (
                  <option key={c.city} value={c.city}>
                    {lang === 'hi' ? c.cityHi : c.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <OccupantCounter
              icon={Users}
              label={t('seniors')}
              value={form.seniors}
              onChange={(v) => update({ seniors: v })}
              color="text-orange-500"
            />
            <OccupantCounter
              icon={Baby}
              label={t('children')}
              value={form.children}
              onChange={(v) => update({ children: v })}
              color="text-blue-500"
            />
            <OccupantCounter
              icon={HardHat}
              label={t('outdoorWorkers')}
              value={form.outdoor_workers}
              onChange={(v) => update({ outdoor_workers: v })}
              color="text-amber-600"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('housingType')}</label>
              <div className="grid grid-cols-3 gap-3">
                {housingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ housing_type: opt.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      form.housing_type === opt.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <opt.icon className="w-7 h-7" />
                    <span className="text-xs font-semibold text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('coolingAssets')}</label>
              <div className="grid grid-cols-4 gap-3">
                {coolingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleCooling(opt.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      form.cooling_assets.includes(opt.value)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <opt.icon className="w-6 h-6" />
                    <span className="text-xs font-semibold text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-blue-500" />
                {t('waterSource')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {waterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ water_source: opt.value })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      form.water_source === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Droplet className="w-5 h-5" />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Summary</div>
              <SummaryRow label={t('hhName')} value={form.name || '—'} />
              <SummaryRow label={t('hhLocation')} value={form.location} />
              <SummaryRow label={t('seniors')} value={String(form.seniors)} />
              <SummaryRow label={t('children')} value={String(form.children)} />
              <SummaryRow label={t('outdoorWorkers')} value={String(form.outdoor_workers)} />
              <SummaryRow label={t('housingType')} value={form.housing_type === 'tin_roof' ? t('tinRoof') : form.housing_type === 'mud_house' ? t('mudHouse') : t('concrete')} />
              <SummaryRow label={t('coolingAssets')} value={form.cooling_assets.length > 0 ? form.cooling_assets.map((a) => a === 'ac' ? t('ac') : a === 'cooler' ? t('cooler') : a === 'fan' ? t('fan') : t('none')).join(', ') : '—'} />
              <SummaryRow label={t('waterSource')} value={form.water_source === 'piped' ? t('piped') : form.water_source === 'borewell' ? t('borewell') : form.water_source === 'tanker' ? t('tanker') : t('noWater')} />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
        <button
          onClick={() => setStep((p) => Math.max(0, p - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('back')}
        </button>

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={() => setStep((p) => p + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleAssess}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm"
          >
            <Check className="w-4 h-4" />
            {t('assess')}
          </button>
        )}
      </div>
    </div>
  );
}

function OccupantCounter({
  icon: Icon,
  label,
  value,
  onChange,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${color}`} />
        <span className="font-semibold text-slate-700 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-300 transition-all"
        >
          −
        </button>
        <span className="w-8 text-center text-lg font-bold text-slate-800">{value}</span>
        <button
          onClick={() => onChange(Math.min(20, value + 1))}
          className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-300 transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}
