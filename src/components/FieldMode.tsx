import { useEffect, useState } from 'react';
import {
  Users,
  Trash2,
  Eye,
  GitCompareArrows,
  Trophy,
  X,
  Home,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';
import type { Household } from '@/lib/types';

interface Props {
  onViewHousehold: (h: Household) => void;
  refreshKey: number;
}

export default function FieldMode({ onViewHousehold, refreshKey }: Props) {
  const { lang, t } = useLang();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    loadHouseholds();
  }, [refreshKey]);

  const loadHouseholds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setHouseholds(data as Household[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('households').delete().eq('id', id);
    setHouseholds((prev) => prev.filter((h) => h.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedHouseholds = households.filter((h) => selected.includes(h.id));
  const sortedComparison = [...selectedHouseholds].sort((a, b) => b.vulnerability_score - a.vulnerability_score);

  const levelColor = (level: string) =>
    level === 'high' ? 'bg-red-100 text-red-700 border-red-300' : level === 'medium' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300';

  const levelText = (level: string) =>
    level === 'high' ? t('high') : level === 'medium' ? t('medium') : t('low');

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-orange-400" />
          <h2 className="font-bold text-lg">{t('fieldMode')}</h2>
        </div>
        <p className="text-slate-300 text-sm mt-1">{t('fieldSubtitle')}</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="inline-block w-8 h-8 border-3 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : households.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">{t('noHouseholds')}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              {t('savedHouseholds')} ({households.length})
            </p>
            {selected.length >= 2 && (
              <button
                onClick={() => setComparing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
              >
                <GitCompareArrows className="w-4 h-4" />
                {t('compareSelected')} ({selected.length})
              </button>
            )}
          </div>
          {selected.length > 0 && selected.length < 2 && (
            <p className="text-xs text-slate-400 font-medium">{t('selectToCompare')}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {households.map((h) => (
              <div
                key={h.id}
                className={`bg-white rounded-xl shadow-md border-2 transition-all ${
                  selected.includes(h.id) ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{h.name}</h3>
                      <p className="text-xs text-slate-400">{h.location}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${levelColor(h.risk_level)}`}>
                      {levelText(h.risk_level)}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold text-slate-800">{h.vulnerability_score}</span>
                    <span className="text-sm text-slate-400">/100</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {h.seniors > 0 && <Tag>{t('seniors')}: {h.seniors}</Tag>}
                    {h.children > 0 && <Tag>{t('children')}: {h.children}</Tag>}
                    {h.outdoor_workers > 0 && <Tag>{t('outdoorWorkers')}: {h.outdoor_workers}</Tag>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSelect(h.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        selected.includes(h.id)
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <GitCompareArrows className="w-3.5 h-3.5" />
                      {t('compare')}
                    </button>
                    <button
                      onClick={() => onViewHousehold(h)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('view')}
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {comparing && sortedComparison.length >= 2 && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setComparing(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-800">{t('coolingKitFirst')}</h3>
              </div>
              <button onClick={() => setComparing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${sortedComparison.length}, 1fr)` }}>
                {sortedComparison.map((h, idx) => (
                  <div
                    key={h.id}
                    className={`rounded-xl border-2 p-4 ${
                      idx === 0
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {idx === 0 && (
                      <div className="flex items-center gap-1.5 mb-3 text-orange-600">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">#1 {t('priorityRank')}</span>
                      </div>
                    )}
                    {idx > 0 && (
                      <div className="mb-3 text-slate-400 text-xs font-bold uppercase tracking-wide">
                        #{idx + 1} {t('priorityRank')}
                      </div>
                    )}
                    <h4 className="font-bold text-slate-800 mb-1">{h.name}</h4>
                    <p className="text-xs text-slate-400 mb-3">{h.location}</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-bold text-slate-800">{h.vulnerability_score}</span>
                      <span className="text-sm text-slate-400">/100</span>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${levelColor(h.risk_level)}`}>
                      {levelText(h.risk_level)}
                    </span>
                    <div className="space-y-1.5 text-sm">
                      <CompRow label={t('seniors')} value={h.seniors} />
                      <CompRow label={t('children')} value={h.children} />
                      <CompRow label={t('outdoorWorkers')} value={h.outdoor_workers} />
                      <CompRow label={t('housingType')} value={h.housing_type === 'tin_roof' ? t('tinRoof') : h.housing_type === 'mud_house' ? t('mudHouse') : t('concrete')} />
                      <CompRow label={t('coolingAssets')} value={h.cooling_assets.length > 0 ? h.cooling_assets.map((a) => a === 'ac' ? t('ac') : a === 'cooler' ? t('cooler') : a === 'fan' ? t('fan') : t('none')).join(', ') : '—'} />
                      <CompRow label={t('waterSource')} value={h.water_source === 'piped' ? t('piped') : h.water_source === 'borewell' ? t('borewell') : h.water_source === 'tanker' ? t('tanker') : t('noWater')} />
                    </div>
                    {h.risk_factors && h.risk_factors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">{t('riskFactors')}</div>
                        <div className="space-y-1">
                          {h.risk_factors.slice(0, 3).map((f, i) => (
                            <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                              {lang === 'hi' ? f.labelHi : f.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
      {children}
    </span>
  );
}

function CompRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="font-semibold text-slate-700 text-xs">{value}</span>
    </div>
  );
}
