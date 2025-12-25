import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'km';

interface Translations {
  [key: string]: {
    en: string;
    km: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង' },
  products: { en: 'Products', km: 'ផលិតផល' },
  categories: { en: 'Categories', km: 'ប្រភេទ' },
  brands: { en: 'Brands', km: 'ម៉ាក' },
  orders: { en: 'Orders', km: 'ការបញ្ជាទិញ' },
  customers: { en: 'Customers', km: 'អតិថិជន' },
  promotions: { en: 'Promotions', km: 'ការផ្សព្វផ្សាយ' },
  events: { en: 'Events', km: 'ព្រឹត្តិការណ៍' },
  notifications: { en: 'Notifications', km: 'ការជូនដំណឹង' },
  settings: { en: 'Settings', km: 'ការកំណត់' },
  logout: { en: 'Logout', km: 'ចាកចេញ' },
  
  // Common actions
  add: { en: 'Add', km: 'បន្ថែម' },
  edit: { en: 'Edit', km: 'កែសម្រួល' },
  delete: { en: 'Delete', km: 'លុប' },
  save: { en: 'Save', km: 'រក្សាទុក' },
  cancel: { en: 'Cancel', km: 'បោះបង់' },
  search: { en: 'Search...', km: 'ស្វែងរក...' },
  loading: { en: 'Loading...', km: 'កំពុងផ្ទុក...' },
  confirm: { en: 'Confirm', km: 'បញ្ជាក់' },
  close: { en: 'Close', km: 'បិទ' },
  
  // Dashboard
  totalRevenue: { en: 'Total Revenue', km: 'ចំណូលសរុប' },
  totalOrders: { en: 'Total Orders', km: 'ការបញ្ជាទិញសរុប' },
  totalProducts: { en: 'Total Products', km: 'ផលិតផលសរុប' },
  totalCustomers: { en: 'Total Customers', km: 'អតិថិជនសរុប' },
  
  // Settings
  general: { en: 'General', km: 'ទូទៅ' },
  appearance: { en: 'Appearance', km: 'រូបរាង' },
  permissions: { en: 'Permissions', km: 'ការអនុញ្ញាត' },
  language: { en: 'Language', km: 'ភាសា' },
  theme: { en: 'Theme', km: 'ស្បែក' },
  darkMode: { en: 'Dark Mode', km: 'របៀបងងឹត' },
  
  // User roles
  admin: { en: 'Admin', km: 'អ្នកគ្រប់គ្រង' },
  manager: { en: 'Manager', km: 'អ្នកចាត់ការ' },
  user: { en: 'User', km: 'អ្នកប្រើប្រាស់' },
  assignRole: { en: 'Assign Role', km: 'ផ្តល់តួនាទី' },
  
  // Chat
  chatWithUs: { en: 'Chat with us', km: 'ជជែកជាមួយយើង' },
  typeMessage: { en: 'Type a message...', km: 'វាយសារ...' },
  send: { en: 'Send', km: 'ផ្ញើ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
    // Apply font based on language
    document.documentElement.style.setProperty(
      '--font-primary',
      language === 'km' ? "'Kantumruy Pro', sans-serif" : "'Nunito', sans-serif"
    );
    document.body.style.fontFamily = language === 'km' 
      ? "'Kantumruy Pro', sans-serif" 
      : "'Nunito', sans-serif";
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
