import { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ListChecks,
  Save,
  RotateCcw,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';
import type { ActionCategory, ActionItem, HouseholdInput, RiskAssessment } from '@/lib/types';
import VulnerabilityMeter from './VulnerabilityMeter';
import VoiceButton from './VoiceButton';

interface Props {
  input: HouseholdInput;
  assessment: RiskAssessment;
  onSave: (input: HouseholdInput, assessment: RiskAssessment, actionPlan: ActionCategory[]) => void;
  onReset: () => void;
  saving: boolean;
  saved: boolean;
}

export default function RiskAssessmentView({ input, assessment, onSave, onReset, saving, saved }: Props) {
  const { lang, t } = useLang();
  const [actionPlan, setActionPlan] = useState<ActionCategory[]>(() =>
    JSON.parse(JSON.stringify(assessment.actionPlan)),
  );

  const toggleItem = (catIdx: number, itemIdx: number) => {
    setActionPlan((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as ActionCategory[];
      next[catIdx].items[itemIdx].done = !next[catIdx].items[itemIdx].done;
      return next;
    });
  };

  const completedCount = actionPlan.flatMap((c) => c.items).filter((i) => i.done).length;
  const totalCount = actionPlan.flatMap((c) => c.items).length;

  const guidanceText = assessment.factors.map((f) => f.label).join('. ');
  const guidanceTextHi = assessment.factors.map((f) => f.labelHi).join('. ');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">{t('riskTitle')}</h2>
          </div>
          <div className="text-sm text-slate-300 font-medium">
            {input.name}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <VulnerabilityMeter score={assessment.score} level={assessment.level} />
            <div className="flex-1 w-full">
              <div className="mb-3">
                <VoiceButton text={guidanceText} textHi={guidanceTextHi} />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {t('actionPlan')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {completedCount}/{totalCount} {lang === 'hi' ? 'पूर्ण' : 'done'}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-slate-800">{t('riskFactors')}</h3>
        </div>
        <div className="px-6 py-4 space-y-2.5">
          {assessment.factors.length === 0 && (
            <p className="text-sm text-slate-400">
              {lang === 'hi' ? 'कोई विशेष जोखिम कारक नहीं मिला।' : 'No significant risk factors detected.'}
            </p>
          )}
          {assessment.factors.map((factor, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl p-3 ${
                factor.severity === 'high'
                  ? 'bg-red-50 border border-red-200'
                  : factor.severity === 'medium'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div
                className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                  factor.severity === 'high'
                    ? 'bg-red-500'
                    : factor.severity === 'medium'
                      ? 'bg-orange-500'
                      : 'bg-yellow-400'
                }`}
              />
              <p className="text-sm font-medium text-slate-700">
                {lang === 'hi' ? factor.labelHi : factor.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800">{t('actionPlan')}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {actionPlan.map((cat, catIdx) => (
            <div key={cat.category} className="px-6 py-4">
              <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <span
                  className={`w-1.5 h-5 rounded-full ${
                    cat.category === 'immediate'
                      ? 'bg-red-500'
                      : cat.category === 'daily'
                        ? 'bg-orange-500'
                        : 'bg-amber-500'
                  }`}
                />
                {lang === 'hi' ? cat.titleHi : cat.title}
              </h4>
              <div className="space-y-1.5">
                {cat.items.map((item, itemIdx) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    className="flex items-start gap-3 w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-all group"
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5 group-hover:text-slate-400" />
                    )}
                    <span
                      className={`text-sm ${
                        item.done
                          ? 'text-slate-400 line-through'
                          : 'text-slate-700 font-medium'
                      }`}
                    >
                      {lang === 'hi' ? item.textHi : item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(input, assessment, actionPlan)}
          disabled={saving || saved}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? t('saving') : saved ? t('saved') : t('saveAssessment')}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          {t('startNew')}
        </button>
      </div>
    </div>
  );
}
