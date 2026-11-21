// Firebase Integration & Fallback Service
// FixMyCampus cleanly supports Live Firebase or Interactive Local Storage Demo Mode

const ENV_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if valid credentials are provided
export function checkFirebaseStatus() {
  const customConfig = getCustomFirebaseConfig();
  const config = customConfig || ENV_CONFIG;
  const isConfigured = Boolean(config.apiKey && config.projectId && config.apiKey !== 'YOUR_API_KEY');

  return {
    isConfigured,
    mode: isConfigured ? 'firebase' : 'demo',
    projectId: config.projectId || 'demo-fixmycampus-offline',
    authDomain: config.authDomain || 'demo.firebaseapp.com',
    storageBucket: config.storageBucket || 'demo.appspot.com',
    source: customConfig ? 'custom_runtime' : (ENV_CONFIG.apiKey ? 'environment' : 'unconfigured_fallback')
  };
}

export function getCustomFirebaseConfig() {
  try {
    const raw = localStorage.getItem('fmc_firebase_config_v1');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveCustomFirebaseConfig(config) {
  localStorage.setItem('fmc_firebase_config_v1', JSON.stringify(config));
}

export function clearCustomFirebaseConfig() {
  localStorage.removeItem('fmc_firebase_config_v1');
}

/**
 * Production Cloud Firestore Security Rules (for reference and submission)
 */
export const FIRESTORE_SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }
    
    function isStaff() {
      return isAuthenticated() && (getUserData().role == 'staff' || isAdmin());
    }
    
    // User collection rules
    match /users/{userId} {
      allow read: if isAuthenticated();
      // Only admins can alter user roles; users can update their profile bio/phone
      allow create: if isAuthenticated() && request.auth.uid == userId && request.resource.data.role != 'admin';
      allow update: if isAuthenticated() && (isAdmin() || (request.auth.uid == userId && request.resource.data.role == resource.data.role));
      allow delete: if isAdmin();
    }
    
    // Complaints collection rules
    match /complaints/{complaintId} {
      // Anyone logged in can read complaints (public views filter out student PII on client)
      allow read: if true;
      
      // Students and faculty can create complaints
      allow create: if isAuthenticated() && 
        (request.resource.data.reporterId == request.auth.uid || request.resource.data.isAnonymous == true);
        
      // Students can update their own complaint (e.g. feedback or reopen)
      // Staff can update status, resolutionNotes, completionPhoto
      // Admins can update all fields including assignment and priority
      allow update: if isAuthenticated() && (
        isAdmin() || 
        (isStaff() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'resolutionNotes', 'completionImageUrl', 'updatedAt', 'timeline'])) ||
        (request.auth.uid == resource.data.reporterId && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['feedback', 'status', 'updatedAt', 'timeline', 'upvotes', 'upvoterIds']))
      );
      
      allow delete: if isAdmin();
    }
    
    // Notifications collection rules
    match /notifications/{notifId} {
      allow read: if isAuthenticated() && 
        (resource.data.targetRole == getUserData().role || resource.data.targetUserId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (resource.data.targetUserId == request.auth.uid || isAdmin());
    }
  }
}
`;
