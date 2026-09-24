import { Printer, FileText, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';
import type { Household } from '@/lib/types';

interface Props {
  onGoAssess: () => void;
  assessment: Household | null;
}

export default function OutreachCard({ onGoAssess, assessment }: Props) {
  const { lang, t } = useLang();
  const h = assessment;

  const levelColor = h
    ? h.risk_level === 'high'
      ? 'bg-red-600 text-white'
      : h.risk_level === 'medium'
        ? 'bg-orange-500 text-white'
        : 'bg-emerald-500 text-white'
    : '';

  const levelText = h
    ? h.risk_level === 'high'
      ? t('high')
      : h.risk_level === 'medium'
        ? t('medium')
        : t('low')
    : '';

  const handlePrint = () => {
    window.print();
  };

  const keyActions = h?.action_plan
    ? (h.action_plan as Array<{ items: Array<{ text: string; textHi: string; done: boolean }> }>)
        .flatMap((cat) => cat.items)
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg px-6 py-4 flex-1 mr-3">
          <div className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">{t('cardTitle')}</h2>
          </div>
          <p className="text-slate-300 text-sm mt-1">{t('cardSubtitle')}</p>
        </div>
      </div>

      {!h ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium mb-4">{t('noAssessment')}</p>
          <button
            onClick={onGoAssess}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
          >
            {t('goAssess')}
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handlePrint}
            className="no-print flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            {t('print')}
          </button>

          <div id="printable-card" className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden print-card">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">{t('appName')} — {t('cardTitle')}</h1>
                  <p className="text-orange-100 text-xs mt-0.5">{t('cardSubtitle')}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{h.vulnerability_score}</div>
                  <div className="text-xs text-orange-100">/100</div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('household')}</div>
                  <div className="font-bold text-slate-800">{h.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('location')}</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {h.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <InfoBox label={t('seniors')} value={h.seniors} />
                <InfoBox label={t('children')} value={h.children} />
                <InfoBox label={t('outdoorWorkers')} value={h.outdoor_workers} />
                <div className={`rounded-xl px-3 py-2 text-center ${levelColor}`}>
                  <div className="text-[10px] font-bold uppercase opacity-80">{t('riskLevel')}</div>
                  <div className="font-bold text-sm">{levelText}</div>
                </div>
              </div>

              {h.risk_factors && h.risk_factors.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">{t('riskFactors')}</div>
                  <ul className="space-y-1">
                    {h.risk_factors.slice(0, 4).map((f, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        {lang === 'hi' ? f.labelHi : f.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">{t('keyActions')}</div>
                <ul className="space-y-1">
                  {keyActions.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-4 h-4 border-2 border-slate-300 rounded shrink-0 mt-0.5" />
                      {lang === 'hi' ? item.textHi : item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800 px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">{t('helpline')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <HelplineBox number="108" label={t('ambulance')} />
                <HelplineBox number="1070" label={t('ndma')} />
                <HelplineBox number="112" label={t('disaster')} />
                <HelplineBox number="100" label={t('police')} />
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium">
                {t('appName')} · {new Date().toLocaleDateString()} · {t('appSubtitle')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100">
      <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
      <div className="font-bold text-lg text-slate-800">{value}</div>
    </div>
  );
}

function HelplineBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center gap-2">
      <Phone className="w-4 h-4 text-orange-400 shrink-0" />
      <div>
        <div className="text-white font-bold text-lg leading-none">{number}</div>
        <div className="text-slate-300 text-[10px]">{label}</div>
      </div>
    </div>
  );
}
