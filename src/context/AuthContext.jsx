import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, ROLE_CONFIG } from '../data/demoUsers';
import { initStorage } from '../services/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    initStorage();
    try {
      const saved = localStorage.getItem('fmc_current_user_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS[0]; // default Alex Chen (Student)
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('fmc_custom_users_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fmc_current_user_v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('fmc_current_user_v1');
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    // 1. Check in demo users
    const demoFound = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (demoFound) {
      setUser(demoFound);
      return { success: true, user: demoFound };
    }

    // 2. Check in registered users
    const registeredFound = registeredUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (registeredFound) {
      setUser(registeredFound);
      return { success: true, user: registeredFound };
    }

    return {
      success: false,
      error: 'Invalid credentials. You can use any of the predefined demo accounts or register as a student/faculty.'
    };
  };

  // Secure Registration Handler (Admin role cannot be self-assigned)
  const register = async ({ name, email, password, role, institutionalId, department }) => {
    if (role === 'admin') {
      return {
        success: false,
        error: 'Security Notice: Administrator privileges require institutional dean authorization and cannot be self-assigned via registration.'
      };
    }

    const validRoles = ['student', 'faculty'];
    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: 'Only Student or Faculty registration is permitted.'
      };
    }

    // Check email uniqueness
    const exists = [...DEMO_USERS, ...registeredUsers].some(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        error: 'An account with this institutional email already exists.'
      };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role,
      studentId: role === 'student' ? institutionalId : undefined,
      staffId: role === 'faculty' ? institutionalId : undefined,
      department: department || 'General Campus Division',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3b5df5`,
      badge: role === 'student' ? 'Registered Student' : 'Faculty Member',
      phone: '+1 (555) 000-0000',
      bio: `FixMyCampus verified member in ${department || 'General'}.`
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('fmc_custom_users_v1', JSON.stringify(updatedUsers));

    setUser(newUser);
    return { success: true, user: newUser };
  };

  // Switch demo account on the fly for Hackathon presentation
  const switchDemoAccount = (roleOrId) => {
    const target = DEMO_USERS.find(u => u.role === roleOrId || u.id === roleOrId);
    if (target) {
      setUser(target);
      return target;
    }
    return user;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        roleConfig: user ? ROLE_CONFIG[user.role] : null,
        demoUsers: DEMO_USERS,
        login,
        register,
        logout,
        switchDemoAccount,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        isFaculty: user?.role === 'faculty',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
