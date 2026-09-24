import { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { tr } from '@/lib/translations';

interface Props {
  text: string;
  textHi: string;
}

export default function VoiceButton({ text, textHi }: Props) {
  const { lang, t } = useLang();
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(lang === 'hi' ? textHi : text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.startsWith('hi'));
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && v.lang.includes('IN'));
    if (lang === 'hi' && hindiVoice) utterance.voice = hindiVoice;
    else if (englishVoice) utterance.voice = englishVoice;
    else if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
        speaking
          ? 'bg-red-100 text-red-700 border-2 border-red-300'
          : 'bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100'
      }`}
    >
      {speaking ? (
        <>
          <Square className="w-4 h-4 fill-current" />
          {t('stop')}
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          {lang === 'hi' ? t('listenHindi') : t('listenHindi')}
        </>
      )}
    </button>
  );
}
