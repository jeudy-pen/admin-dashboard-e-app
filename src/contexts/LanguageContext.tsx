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
  yes: { en: 'Yes', km: 'បាទ/ចាស' },
  no: { en: 'No', km: 'ទេ' },
  
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
  lightMode: { en: 'Light Mode', km: 'របៀបភ្លឺ' },
  
  // User roles
  admin: { en: 'Admin', km: 'អ្នកគ្រប់គ្រង' },
  manager: { en: 'Manager', km: 'អ្នកចាត់ការ' },
  user: { en: 'User', km: 'អ្នកប្រើប្រាស់' },
  users: { en: 'Users', km: 'អ្នកប្រើប្រាស់' },
  assignRole: { en: 'Assign Role', km: 'ផ្តល់តួនាទី' },
  noRole: { en: 'No role', km: 'គ្មានតួនាទី' },
  noName: { en: 'No name', km: 'គ្មានឈ្មោះ' },
  noUsersFound: { en: 'No users found', km: 'រកមិនឃើញអ្នកប្រើប្រាស់' },
  createUser: { en: 'Create User', km: 'បង្កើតអ្នកប្រើប្រាស់' },
  fullName: { en: 'Full Name', km: 'ឈ្មោះពេញ' },
  email: { en: 'Email', km: 'អ៊ីមែល' },
  password: { en: 'Password', km: 'ពាក្យសម្ងាត់' },
  role: { en: 'Role', km: 'តួនាទី' },
  joined: { en: 'Joined', km: 'ចូលរួម' },
  actions: { en: 'Actions', km: 'សកម្មភាព' },
  
  // Chat
  chatWithUs: { en: 'Chat with us', km: 'ជជែកជាមួយយើង' },
  typeMessage: { en: 'Type a message...', km: 'វាយសារ...' },
  send: { en: 'Send', km: 'ផ្ញើ' },
  
  // Logout
  logoutConfirm: { en: 'Are you sure you want to logout?', km: 'តើអ្នកប្រាកដជាចង់ចាកចេញមែនទេ?' },
  logoutTitle: { en: 'Confirm Logout', km: 'បញ្ជាក់ការចាកចេញ' },
  
  // Alerts
  success: { en: 'Success', km: 'ជោគជ័យ' },
  error: { en: 'Error', km: 'កំហុស' },
  userCreatedSuccess: { en: 'User created successfully', km: 'បង្កើតអ្នកប្រើប្រាស់ជោគជ័យ' },
  roleAssignedSuccess: { en: 'Role assigned successfully', km: 'ផ្តល់តួនាទីជោគជ័យ' },
  roleRemovedSuccess: { en: 'Role removed successfully', km: 'លុបតួនាទីជោគជ័យ' },
  failedToCreateUser: { en: 'Failed to create user', km: 'បរាជ័យក្នុងការបង្កើតអ្នកប្រើប្រាស់' },
  failedToAssignRole: { en: 'Failed to assign role', km: 'បរាជ័យក្នុងការផ្តល់តួនាទី' },
  failedToRemoveRole: { en: 'Failed to remove role', km: 'បរាជ័យក្នុងការលុបតួនាទី' },
  addNewUserDesc: { en: 'Add a new user to the system', km: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មីទៅប្រព័ន្ធ' },
  selectRoleDesc: { en: 'Select a role for this user', km: 'ជ្រើសរើសតួនាទីសម្រាប់អ្នកប្រើប្រាស់នេះ' },
  confirmDeleteRole: { en: 'Are you sure you want to remove this role? This action cannot be undone.', km: 'តើអ្នកប្រាកដជាចង់លុបតួនាទីនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។' },
  
  // Permissions
  rolePermissions: { en: 'Role Permissions', km: 'សិទ្ធិតួនាទី' },
  permission: { en: 'Permission', km: 'សិទ្ធិ' },
  viewDashboard: { en: 'View Dashboard', km: 'មើលផ្ទាំងគ្រប់គ្រង' },
  manageProducts: { en: 'Manage Products', km: 'គ្រប់គ្រងផលិតផល' },
  manageCategories: { en: 'Manage Categories', km: 'គ្រប់គ្រងប្រភេទ' },
  manageOrders: { en: 'Manage Orders', km: 'គ្រប់គ្រងការបញ្ជាទិញ' },
  manageCustomers: { en: 'Manage Customers', km: 'គ្រប់គ្រងអតិថិជន' },
  manageUsers: { en: 'Manage Users', km: 'គ្រប់គ្រងអ្នកប្រើប្រាស់' },
  manageSettings: { en: 'Manage Settings', km: 'គ្រប់គ្រងការកំណត់' },
  sendNotifications: { en: 'Send Notifications', km: 'ផ្ញើការជូនដំណឹង' },
  manageUsersPermsSettings: { en: 'Manage users, permissions, and preferences', km: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ សិទ្ធិ និងចំណូលចិត្ត' },
  selectLanguageDesc: { en: 'Select your preferred language. The app will update automatically.', km: 'ជ្រើសរើសភាសាដែលអ្នកពេញចិត្ត។ កម្មវិធីនឹងធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ។' },
  english: { en: 'English', km: 'អង់គ្លេស' },
  khmer: { en: 'Khmer', km: 'ខ្មែរ' },
  noNotifications: { en: 'No notifications', km: 'គ្មានការជូនដំណឹង' },
  searchResults: { en: 'Search Results', km: 'លទ្ធផលស្វែងរក' },
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
