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
  back: { en: 'Back', km: 'ថយក្រោយ' },
  okay: { en: 'Okay', km: 'យល់ព្រម' },
  
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
  userId: { en: 'User ID', km: 'លេខសម្គាល់អ្នកប្រើ' },
  username: { en: 'Username', km: 'ឈ្មោះអ្នកប្រើ' },
  phoneNumber: { en: 'Phone Number', km: 'លេខទូរស័ព្ទ' },
  createdAt: { en: 'Created At', km: 'បង្កើតនៅ' },
  
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
  confirmDeleteUser: { en: 'Are you sure you want to delete this user? This action cannot be undone.', km: 'តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។' },
  userDeletedSuccess: { en: 'User deleted successfully', km: 'លុបអ្នកប្រើប្រាស់ជោគជ័យ' },
  failedToDeleteUser: { en: 'Failed to delete user', km: 'បរាជ័យក្នុងការលុបអ្នកប្រើប្រាស់' },
  
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
  
  // Auth page
  adminDashboard: { en: 'Admin Dashboard', km: 'ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង' },
  signInToAccount: { en: 'Sign in to your account', km: 'ចូលគណនីរបស់អ្នក' },
  createYourAccount: { en: 'Create your account', km: 'បង្កើតគណនីរបស់អ្នក' },
  signIn: { en: 'Sign In', km: 'ចូល' },
  signUp: { en: 'Sign Up', km: 'ចុះឈ្មោះ' },
  signingIn: { en: 'Signing in...', km: 'កំពុងចូល...' },
  creatingAccount: { en: 'Creating account...', km: 'កំពុងបង្កើតគណនី...' },
  forgotPassword: { en: 'Forgot Password?', km: 'ភ្លេចពាក្យសម្ងាត់?' },
  rememberMe: { en: 'Remember me', km: 'ចងចាំខ្ញុំ' },
  agreeToTerms: { en: 'I agree to the Terms and Conditions', km: 'ខ្ញុំយល់ព្រមលក្ខខណ្ឌ' },
  termsAndConditions: { en: 'Terms and Conditions', km: 'លក្ខខណ្ឌ' },
  dontHaveAccount: { en: "Don't have an account? Sign up", km: 'មិនមានគណនី? ចុះឈ្មោះ' },
  alreadyHaveAccount: { en: 'Already have an account? Sign in', km: 'មានគណនីរួចហើយ? ចូល' },
  welcomeBack: { en: 'Welcome back!', km: 'សូមស្វាគមន៍មកវិញ!' },
  signInSuccess: { en: 'You have successfully signed in.', km: 'អ្នកបានចូលជោគជ័យ។' },
  accountCreated: { en: 'Account created!', km: 'បង្កើតគណនីជោគជ័យ!' },
  checkEmailVerify: { en: 'Please check your email to verify your account.', km: 'សូមពិនិត្យអ៊ីមែលរបស់អ្នកដើម្បីផ្ទៀងផ្ទាត់គណនី។' },
  resetPasswordSent: { en: 'Password reset email sent!', km: 'បានផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ឡើងវិញ!' },
  checkEmailReset: { en: 'Please check your email for password reset instructions.', km: 'សូមពិនិត្យអ៊ីមែលរបស់អ្នកសម្រាប់ការណែនាំកំណត់ពាក្យសម្ងាត់ឡើងវិញ។' },
  
  // Password strength
  passwordStrength: { en: 'Password Strength', km: 'កម្លាំងពាក្យសម្ងាត់' },
  weak: { en: 'Weak', km: 'ខ្សោយ' },
  fair: { en: 'Fair', km: 'ល្មម' },
  good: { en: 'Good', km: 'ល្អ' },
  strong: { en: 'Strong', km: 'រឹងមាំ' },
  
  // OTP
  verifyEmail: { en: 'Verify Your Email', km: 'ផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នក' },
  otpSentTo: { en: 'We sent a verification code to', km: 'យើងបានផ្ញើលេខកូដផ្ទៀងផ្ទាត់ទៅ' },
  verify: { en: 'Verify', km: 'ផ្ទៀងផ្ទាត់' },
  resendIn: { en: 'Resend code in', km: 'ផ្ញើលេខកូដម្តងទៀតក្នុង' },
  resendCode: { en: 'Resend Code', km: 'ផ្ញើលេខកូដម្តងទៀត' },
  sending: { en: 'Sending...', km: 'កំពុងផ្ញើ...' },
  verificationSuccess: { en: 'Email verified successfully!', km: 'ផ្ទៀងផ្ទាត់អ៊ីមែលជោគជ័យ!' },
  
  // Placeholders
  enterEmail: { en: 'Enter your email', km: 'បញ្ចូលអ៊ីមែលរបស់អ្នក' },
  enterPassword: { en: 'Enter your password', km: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក' },
  enterFullName: { en: 'Enter your full name', km: 'បញ្ចូលឈ្មោះពេញរបស់អ្នក' },
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
