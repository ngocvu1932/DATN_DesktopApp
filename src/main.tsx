import {createRoot} from 'react-dom/client';
import './index.css';
import App from './pages/App';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enLocale from './locales/locale_en.json';
import viLocale from './locales/locale_vi.json';
import {StrictMode} from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import {appConfig} from './appConfig';

if (!localStorage.getItem('appConfig')) {
  localStorage.setItem('appConfig', JSON.stringify(appConfig));
}

const lang = JSON.parse(localStorage.getItem('appConfig') ?? '{}').defaultLanguage ?? 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enLocale,
      },
      vi: {
        translation: viLocale,
      },
    },
    lng: lang, // ngôn ngữ mặc định
    fallbackLng: 'vi', // không có ngôn ngữ nào thì mặc định là tiếng việt
    interpolation: {
      escapeValue: false,
    },
  })
  .then();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
