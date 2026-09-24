import { useEffect, useState } from 'react';
import { Sun, Languages, LayoutDashboard, ClipboardList, Users, FileText } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import type { Lang } from '@/lib/translations';
import { tr, type TranslationKey } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import { assessRisk } from '@/lib/riskEngine';
import type { ActionCategory, Household, HouseholdInput, RiskAssessment } from '@/lib/types';
import WeatherBanner from '@/components/WeatherBanner';
import HouseholdWizard from '@/components/HouseholdWizard';
import RiskAssessmentView from '@/components/RiskAssessmentView';
import FieldMode from '@/components/FieldMode';
import OutreachCard from '@/components/OutreachCard';

type Tab = 'dashboard' | 'assess' | 'field' | 'card';

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [city, setCity] = useState('Lucknow');
  const [wizardInput, setWizardInput] = useState<HouseholdInput | null>(null);
  const [wizardAssessment, setWizardAssessment] = useState<RiskAssessment | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Household | null>(null);
  const [fieldRefreshKey, setFieldRefreshKey] = useState(0);
  const [viewingHousehold, setViewingHousehold] = useState<Household | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const toggleLang = () => setLang((p: Lang) => (p === 'en' ? 'hi' : 'en'));
  const t = (key: TranslationKey) => tr(key, lang);

  const handleWizardComplete = (input: HouseholdInput, assessment: RiskAssessment) => {
    setWizardInput(input);
    setWizardAssessment(assessment);
    setSaved(false);
  };

  const handleSave = async (input: HouseholdInput, assessment: RiskAssessment, actionPlan: ActionCategory[]) => {
    setSaving(true);
    const row = {
      name: input.name,
      location: input.location,
      seniors: input.seniors,
      children: input.children,
      outdoor_workers: input.outdoor_workers,
      housing_type: input.housing_type,
      cooling_assets: input.cooling_assets,
      water_source: input.water_source,
      vulnerability_score: assessment.score,
      risk_level: assessment.level,
      risk_factors: assessment.factors,
      action_plan: actionPlan,
    };
    const { data, error } = await supabase.from('households').insert(row).select().single();
    setSaving(false);
    if (!error && data) {
      setSaved(true);
      const household = data as Household;
      setCurrentAssessment(household);
      setFieldRefreshKey((p) => p + 1);
    }
  };

  const handleReset = () => {
    setWizardInput(null);
    setWizardAssessment(null);
    setSaved(false);
  };

  const handleViewHousehold = (h: Household) => {
    setViewingHousehold(h);
    setCurrentAssessment(h);
  };

  const tabs: { id: Tab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('tabDashboard') },
    { id: 'assess', icon: ClipboardList, label: t('tabAssess') },
    { id: 'field', icon: Users, label: t('tabField') },
    { id: 'card', icon: FileText, label: t('tabCard') },
  ];

  const langValue = {
    lang,
    setLang,
    toggleLang,
    t: (key: TranslationKey) => tr(key, lang),
  };

  return (
    <LanguageContext.Provider value={langValue}>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-slate-900 sticky top-0 z-40 shadow-lg no-print">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-sm leading-tight">
                    {t('appName')}
                  </h1>
                  <p className="text-slate-400 text-[10px] leading-tight">{t('appSubtitle')}</p>
                </div>
              </div>

              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all text-sm font-semibold border border-slate-700"
              >
                <Languages className="w-4 h-4" />
                {t('hindiMode')}
              </button>
            </div>

            <nav className="flex items-center gap-1 -mb-px overflow-x-auto">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                    tab === tabItem.id
                      ? 'border-orange-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <tabItem.icon className="w-4 h-4" />
                  {tabItem.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
          {tab === 'dashboard' && (
            <div className="space-y-4">
              <WeatherBanner city={city} onCityChange={setCity} />
              {currentAssessment && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-3 text-sm">{t('household')}: {currentAssessment.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-slate-800">{currentAssessment.vulnerability_score}<span className="text-lg text-slate-400">/100</span></div>
                    <div className="flex-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        currentAssessment.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                        currentAssessment.risk_level === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {currentAssessment.risk_level === 'high' ? t('high') : currentAssessment.risk_level === 'medium' ? t('medium') : t('low')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <ClipboardList className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">{t('wizardTitle')}</h3>
                <p className="text-sm text-slate-400 mb-4">{t('wizardSubtitle')}</p>
                <button
                  onClick={() => setTab('assess')}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
                >
                  {t('tabAssess')}
                </button>
              </div>
            </div>
          )}

          {tab === 'assess' && (
            <div className="space-y-4">
              <WeatherBanner city={city} onCityChange={setCity} />
              {!wizardInput || !wizardAssessment ? (
                <HouseholdWizard onComplete={handleWizardComplete} initialCity={city} />
              ) : (
                <RiskAssessmentView
                  input={wizardInput}
                  assessment={wizardAssessment}
                  onSave={handleSave}
                  onReset={handleReset}
                  saving={saving}
                  saved={saved}
                />
              )}
            </div>
          )}

          {tab === 'field' && (
            <FieldMode onViewHousehold={handleViewHousehold} refreshKey={fieldRefreshKey} />
          )}

          {tab === 'card' && (
            <OutreachCard onGoAssess={() => setTab('assess')} assessment={currentAssessment} />
          )}
        </main>

        {viewingHousehold && tab === 'field' && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 no-print" onClick={() => setViewingHousehold(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{viewingHousehold.name}</h3>
                <button onClick={() => setViewingHousehold(null)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-semibold">
                  {t('close')}
                </button>
              </div>
              <div className="p-6">
                <RiskAssessmentView
                  input={{
                    name: viewingHousehold.name,
                    location: viewingHousehold.location,
                    seniors: viewingHousehold.seniors,
                    children: viewingHousehold.children,
                    outdoor_workers: viewingHousehold.outdoor_workers,
                    housing_type: viewingHousehold.housing_type,
                    cooling_assets: viewingHousehold.cooling_assets,
                    water_source: viewingHousehold.water_source,
                  }}
                  assessment={{
                    score: viewingHousehold.vulnerability_score,
                    level: viewingHousehold.risk_level,
                    factors: viewingHousehold.risk_factors,
                    actionPlan: viewingHousehold.action_plan,
                  }}
                  onSave={() => {}}
                  onReset={() => setViewingHousehold(null)}
                  saving={false}
                  saved={true}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="bg-slate-900 text-slate-400 text-center text-xs py-3 no-print">
          {t('appName')} · {t('appSubtitle')}
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}
