import { useRouter } from 'next/router';
import en from '../messages/en.json';
import id from '../messages/id.json';

const messages = { en, id };

export function useTranslation() {
  const { locale } = useRouter();
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages[locale as keyof typeof messages];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return { t, locale };
}