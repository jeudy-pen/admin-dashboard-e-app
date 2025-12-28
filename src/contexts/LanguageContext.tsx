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

  // Generic
  update: { en: 'Update', km: 'ធ្វើបច្ចុប្បន្នភាព' },
  create: { en: 'Create', km: 'បង្កើត' },
  deleted: { en: 'Deleted', km: 'បានលុប' },

  // Statuses
  status: { en: 'Status', km: 'ស្ថានភាព' },
  active: { en: 'Active', km: 'សកម្ម' },
  inactive: { en: 'Inactive', km: 'មិនសកម្ម' },
  draft: { en: 'Draft', km: 'ព្រាង' },
  published: { en: 'Published', km: 'បានផ្សព្វផ្សាយ' },
  processing: { en: 'Processing', km: 'កំពុងដំណើរការ' },
  shipped: { en: 'Shipped', km: 'បានផ្ញើ' },
  outForDelivery: { en: 'Out for delivery', km: 'កំពុងដឹកជញ្ជូន' },
  delivered: { en: 'Delivered', km: 'បានដល់' },
  cancelled: { en: 'Cancelled', km: 'បានបោះបង់' },

  // Dashboard
  dashboardWelcome: { en: 'Welcome to your admin dashboard', km: 'សូមស្វាគមន៍មកកាន់ផ្ទាំងគ្រប់គ្រង' },
  recentOrders: { en: 'Recent Orders', km: 'ការបញ្ជាទិញថ្មីៗ' },
  noOrdersYet: { en: 'No orders yet', km: 'មិនទាន់មានការបញ្ជាទិញ' },
  fromLastMonth: { en: 'from last month', km: 'ពីខែមុន' },

  // Products
  productsSubtitle: { en: 'Manage your product catalog', km: 'គ្រប់គ្រងបញ្ជីផលិតផល' },
  addProduct: { en: 'Add Product', km: 'បន្ថែមផលិតផល' },
  editProduct: { en: 'Edit Product', km: 'កែសម្រួលផលិតផល' },
  addNewProduct: { en: 'Add New Product', km: 'បន្ថែមផលិតផលថ្មី' },
  name: { en: 'Name', km: 'ឈ្មោះ' },
  description: { en: 'Description', km: 'ការពិពណ៌នា' },
  price: { en: 'Price', km: 'តម្លៃ' },
  stock: { en: 'Stock', km: 'ស្តុក' },
  category: { en: 'Category', km: 'ប្រភេទ' },
  selectCategory: { en: 'Select category', km: 'ជ្រើសរើសប្រភេទ' },
  imageUrl: { en: 'Image URL', km: 'តំណភ្ជាប់រូបភាព' },
  updateProduct: { en: 'Update Product', km: 'ធ្វើបច្ចុប្បន្នភាពផលិតផល' },
  createProduct: { en: 'Create Product', km: 'បង្កើតផលិតផល' },
  productUpdated: { en: 'Product updated', km: 'បានធ្វើបច្ចុប្បន្នភាពផលិតផល' },
  productCreated: { en: 'Product created', km: 'បានបង្កើតផលិតផល' },
  productDeleted: { en: 'Product has been deleted', km: 'បានលុបផលិតផល' },
  confirmDeleteProduct: { en: 'Are you sure you want to delete this product?', km: 'តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះមែនទេ?' },
  searchProducts: { en: 'Search products...', km: 'ស្វែងរកផលិតផល...' },
  noProductsFound: { en: 'No products found', km: 'រកមិនឃើញផលិតផល' },

  // Categories
  categoriesSubtitle: { en: 'Manage product categories', km: 'គ្រប់គ្រងប្រភេទផលិតផល' },
  addCategory: { en: 'Add Category', km: 'បន្ថែមប្រភេទ' },
  editCategory: { en: 'Edit Category', km: 'កែសម្រួលប្រភេទ' },
  addNewCategory: { en: 'Add New Category', km: 'បន្ថែមប្រភេទថ្មី' },
  nameEnglish: { en: 'Name (English)', km: 'ឈ្មោះ (អង់គ្លេស)' },
  nameKhmer: { en: 'Name (Khmer)', km: 'ឈ្មោះ (ខ្មែរ)' },
  categoryUpdated: { en: 'Category updated', km: 'បានធ្វើបច្ចុប្បន្នភាពប្រភេទ' },
  categoryCreated: { en: 'Category created', km: 'បានបង្កើតប្រភេទ' },
  categoryDeleted: { en: 'Category has been deleted', km: 'បានលុបប្រភេទ' },
  confirmDeleteCategory: { en: 'Are you sure you want to delete this category?', km: 'តើអ្នកប្រាកដជាចង់លុបប្រភេទនេះមែនទេ?' },
  searchCategories: { en: 'Search categories...', km: 'ស្វែងរកប្រភេទ...' },
  noCategoriesFound: { en: 'No categories found', km: 'រកមិនឃើញប្រភេទ' },

  // Brands
  brandsSubtitle: { en: 'Manage product brands', km: 'គ្រប់គ្រងម៉ាកផលិតផល' },
  addBrand: { en: 'Add Brand', km: 'បន្ថែមម៉ាក' },
  editBrand: { en: 'Edit Brand', km: 'កែសម្រួលម៉ាក' },
  brandName: { en: 'Brand Name', km: 'ឈ្មោះម៉ាក' },
  logoUrl: { en: 'Logo URL', km: 'តំណភ្ជាប់ឡូហ្គោ' },
  created: { en: 'Created', km: 'បង្កើត' },
  noBrandsFound: { en: 'No brands found', km: 'រកមិនឃើញម៉ាក' },
  brandCreatedSuccess: { en: 'Brand created successfully', km: 'បង្កើតម៉ាកជោគជ័យ' },
  brandUpdatedSuccess: { en: 'Brand updated successfully', km: 'ធ្វើបច្ចុប្បន្នភាពម៉ាកជោគជ័យ' },
  brandDeletedSuccess: { en: 'Brand deleted successfully', km: 'លុបម៉ាកជោគជ័យ' },
  failedToCreateBrand: { en: 'Failed to create brand', km: 'បរាជ័យក្នុងការបង្កើតម៉ាក' },
  failedToUpdateBrand: { en: 'Failed to update brand', km: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពម៉ាក' },
  failedToDeleteBrand: { en: 'Failed to delete brand', km: 'បរាជ័យក្នុងការលុបម៉ាក' },

  // Orders
  ordersSubtitle: { en: 'Manage customer orders', km: 'គ្រប់គ្រងការបញ្ជាទិញអតិថិជន' },
  searchOrders: { en: 'Search orders...', km: 'ស្វែងរកការបញ្ជាទិញ...' },
  noOrdersFound: { en: 'No orders found', km: 'រកមិនឃើញការបញ្ជាទិញ' },
  orderStatusUpdated: { en: 'Order status updated', km: 'បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពការបញ្ជាទិញ' },
  orderDetails: { en: 'Order Details', km: 'ព័ត៌មានលម្អិតការបញ្ជាទិញ' },
  orderNumber: { en: 'Order Number', km: 'លេខការបញ្ជាទិញ' },
  customerInformation: { en: 'Customer Information', km: 'ព័ត៌មានអតិថិជន' },
  shippingAddress: { en: 'Shipping Address', km: 'អាសយដ្ឋានដឹកជញ្ជូន' },
  total: { en: 'Total', km: 'សរុប' },
  items: { en: 'items', km: 'មុខទំនិញ' },

  // Customers
  customersSubtitle: { en: 'View customer information from orders', km: 'មើលព័ត៌មានអតិថិជនពីការបញ្ជាទិញ' },
  searchCustomers: { en: 'Search customers...', km: 'ស្វែងរកអតិថិជន...' },
  noCustomersFound: { en: 'No customers found', km: 'រកមិនឃើញអតិថិជន' },
  totalSpent: { en: 'Total Spent', km: 'ចំណាយសរុប' },

  // Promotions
  promotionsSubtitle: { en: 'Manage discounts and offers', km: 'គ្រប់គ្រងការបញ្ចុះតម្លៃ និងការផ្តល់ជូន' },
  addPromotion: { en: 'Add Promotion', km: 'បន្ថែមការផ្សព្វផ្សាយ' },
  editPromotion: { en: 'Edit Promotion', km: 'កែសម្រួលការផ្សព្វផ្សាយ' },
  promotionCreatedSuccess: { en: 'Promotion created successfully', km: 'បង្កើតការផ្សព្វផ្សាយជោគជ័យ' },
  promotionUpdatedSuccess: { en: 'Promotion updated successfully', km: 'ធ្វើបច្ចុប្បន្នភាពការផ្សព្វផ្សាយជោគជ័យ' },
  promotionDeletedSuccess: { en: 'Promotion deleted successfully', km: 'លុបការផ្សព្វផ្សាយជោគជ័យ' },
  failedToCreatePromotion: { en: 'Failed to create promotion', km: 'បរាជ័យក្នុងការបង្កើតការផ្សព្វផ្សាយ' },
  failedToUpdatePromotion: { en: 'Failed to update promotion', km: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពការផ្សព្វផ្សាយ' },
  failedToDeletePromotion: { en: 'Failed to delete promotion', km: 'បរាជ័យក្នុងការលុបការផ្សព្វផ្សាយ' },
  discountType: { en: 'Discount Type', km: 'ប្រភេទបញ្ចុះតម្លៃ' },
  percentage: { en: 'Percentage', km: 'ភាគរយ' },
  fixedAmount: { en: 'Fixed Amount', km: 'ចំនួនថេរ' },
  value: { en: 'Value', km: 'តម្លៃ' },
  startDate: { en: 'Start Date', km: 'កាលបរិច្ឆេទចាប់ផ្តើម' },
  endDate: { en: 'End Date', km: 'កាលបរិច្ឆេទបញ្ចប់' },
  duration: { en: 'Duration', km: 'រយៈពេល' },
  discount: { en: 'Discount', km: 'បញ្ចុះតម្លៃ' },
  noPromotionsFound: { en: 'No promotions found', km: 'រកមិនឃើញការផ្សព្វផ្សាយ' },

  // Events
  eventsSubtitle: { en: 'Manage upcoming events', km: 'គ្រប់គ្រងព្រឹត្តិការណ៍ខាងមុខ' },
  addEvent: { en: 'Add Event', km: 'បន្ថែមព្រឹត្តិការណ៍' },
  editEvent: { en: 'Edit Event', km: 'កែសម្រួលព្រឹត្តិការណ៍' },
  eventCreatedSuccess: { en: 'Event created successfully', km: 'បង្កើតព្រឹត្តិការណ៍ជោគជ័យ' },
  eventUpdatedSuccess: { en: 'Event updated successfully', km: 'ធ្វើបច្ចុប្បន្នភាពព្រឹត្តិការណ៍ជោគជ័យ' },
  eventDeletedSuccess: { en: 'Event deleted successfully', km: 'លុបព្រឹត្តិការណ៍ជោគជ័យ' },
  failedToCreateEvent: { en: 'Failed to create event', km: 'បរាជ័យក្នុងការបង្កើតព្រឹត្តិការណ៍' },
  failedToUpdateEvent: { en: 'Failed to update event', km: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពព្រឹត្តិការណ៍' },
  failedToDeleteEvent: { en: 'Failed to delete event', km: 'បរាជ័យក្នុងការលុបព្រឹត្តិការណ៍' },
  title: { en: 'Title', km: 'ចំណងជើង' },
  eventDateTime: { en: 'Event Date & Time', km: 'ថ្ងៃ និងម៉ោងព្រឹត្តិការណ៍' },
  location: { en: 'Location', km: 'ទីតាំង' },
  noEventsFound: { en: 'No events found', km: 'រកមិនឃើញព្រឹត្តិការណ៍' },

  // Notifications
  pushNotifications: { en: 'Push Notifications', km: 'ការជូនដំណឹងបញ្ចូន' },
  notificationsSubtitle: { en: 'Send notifications to users', km: 'ផ្ញើការជូនដំណឹងទៅអ្នកប្រើប្រាស់' },
  newNotification: { en: 'New Notification', km: 'ការជូនដំណឹងថ្មី' },
  editNotification: { en: 'Edit Notification', km: 'កែសម្រួលការជូនដំណឹង' },
  notification: { en: 'Notification', km: 'ការជូនដំណឹង' },
  audience: { en: 'Audience', km: 'ក្រុមគោលដៅ' },
  targetAudience: { en: 'Target Audience', km: 'ក្រុមគោលដៅ' },
  allUsers: { en: 'All Users', km: 'អ្នកប្រើទាំងអស់' },
  customersOnly: { en: 'Customers Only', km: 'តែអតិថិជន' },
  adminsOnly: { en: 'Admins Only', km: 'តែអ្នកគ្រប់គ្រង' },
  scheduleOptional: { en: 'Schedule (Optional)', km: 'កំណត់ពេល (មិនបាច់)' },
  notificationSent: { en: 'Notification sent!', km: 'បានផ្ញើការជូនដំណឹង!' },
  failedToSendNotification: { en: 'Failed to send notification', km: 'បរាជ័យក្នុងការផ្ញើការជូនដំណឹង' },
  notificationCreatedSuccess: { en: 'Notification created successfully', km: 'បង្កើតការជូនដំណឹងជោគជ័យ' },
  notificationUpdatedSuccess: { en: 'Notification updated successfully', km: 'ធ្វើបច្ចុប្បន្នភាពការជូនដំណឹងជោគជ័យ' },
  notificationDeletedSuccess: { en: 'Notification deleted successfully', km: 'លុបការជូនដំណឹងជោគជ័យ' },
  failedToCreateNotification: { en: 'Failed to create notification', km: 'បរាជ័យក្នុងការបង្កើតការជូនដំណឹង' },
  failedToUpdateNotification: { en: 'Failed to update notification', km: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពការជូនដំណឹង' },
  failedToDeleteNotification: { en: 'Failed to delete notification', km: 'បរាជ័យក្នុងការលុបការជូនដំណឹង' },
  noNotificationsFound: { en: 'No notifications found', km: 'រកមិនឃើញការជូនដំណឹង' },

  // Not Found
  pageNotFound: { en: 'Oops! Page not found', km: 'អូ៎! រកមិនឃើញទំព័រ' },
  returnHome: { en: 'Return to Home', km: 'ត្រឡប់ទៅទំព័រដើម' },

  // Tracking
  tracking: { en: 'Tracking', km: 'តាមដាន' },
  trackOrder: { en: 'Track Order', km: 'តាមដានការបញ្ជាទិញ' },
  trackOrderSubtitle: { en: 'Enter your order number or tracking number to check status', km: 'បញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដានដើម្បីពិនិត្យស្ថានភាព' },
  enterOrderOrTracking: { en: 'Enter order number or tracking number...', km: 'បញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដាន...' },
  searching: { en: 'Searching...', km: 'កំពុងស្វែងរក...' },
  orderNotFound: { en: 'Order not found', km: 'រកមិនឃើញការបញ្ជាទិញ' },
  orderNotFoundDesc: { en: 'Please check your order number and try again', km: 'សូមពិនិត្យលេខបញ្ជាទិញរបស់អ្នក ហើយព្យាយាមម្តងទៀត' },
  errorFetchingOrder: { en: 'Error fetching order', km: 'កំហុសក្នុងការទាញយកការបញ្ជាទិញ' },
  trackingNumber: { en: 'Tracking Number', km: 'លេខតាមដាន' },
  orderProgress: { en: 'Order Progress', km: 'វឌ្ឍនភាពការបញ្ជាទិញ' },
  orderCancelled: { en: 'Order Cancelled', km: 'បានបោះបង់ការបញ្ជាទិញ' },
  orderCancelledDesc: { en: 'This order has been cancelled', km: 'ការបញ្ជាទិញនេះត្រូវបានបោះបង់' },
  orderedOn: { en: 'Ordered On', km: 'បញ្ជាទិញនៅ' },
  orderItems: { en: 'Order Items', km: 'មុខទំនិញក្នុងការបញ្ជាទិញ' },
  quantity: { en: 'Quantity', km: 'បរិមាណ' },
  trackYourOrder: { en: 'Track Your Order', km: 'តាមដានការបញ្ជាទិញរបស់អ្នក' },
  enterOrderNumberToTrack: { en: 'Enter your order number or tracking number to see the delivery status', km: 'បញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដានដើម្បីមើលស្ថានភាពដឹកជញ្ជូន' },

  // Order Confirmation
  orderConfirmed: { en: 'Order Confirmed!', km: 'បានបញ្ជាក់ការបញ្ជាទិញ!' },
  thankYouForOrder: { en: 'Thank you for your order. We will process it shortly.', km: 'សូមអរគុណសម្រាប់ការបញ្ជាទិញរបស់អ្នក។ យើងនឹងដំណើរការវាក្នុងពេលឆាប់ៗ។' },
  copied: { en: 'Copied!', km: 'បានចម្លង!' },
  orderNumberCopied: { en: 'Order number copied to clipboard', km: 'បានចម្លងលេខបញ្ជាទិញទៅក្ដារតម្បៀតខ្ទាស់' },
  confirmationEmailSent: { en: 'A confirmation email has been sent to', km: 'អ៊ីមែលបញ្ជាក់ត្រូវបានផ្ញើទៅ' },
  orderStatus: { en: 'Order Status', km: 'ស្ថានភាពការបញ្ជាទិញ' },
  orderBeingPrepared: { en: 'Your order is being prepared', km: 'ការបញ្ជាទិញរបស់អ្នកកំពុងត្រូវបានរៀបចំ' },
  deliveryInformation: { en: 'Delivery Information', km: 'ព័ត៌មានដឹកជញ្ជូន' },
  orderSummary: { en: 'Order Summary', km: 'សេចក្តីសង្ខេបការបញ្ជាទិញ' },
  continueShopping: { en: 'Continue Shopping', km: 'បន្តទិញទំនិញ' },
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
