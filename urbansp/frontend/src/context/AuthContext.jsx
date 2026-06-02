import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { updateUserProfile as updateProfileService } from '../services/userService';

export const AuthContext = createContext({
  user: null, token: null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  logout: () => {},
});

const getErr = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors?.[0]?.msg) return error.response.data.errors[0].msg;
  return error?.message || 'Unexpected error';
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('usp_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });

  useEffect(() => {
    if (auth?.user && auth?.token) {
      localStorage.setItem('usp_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('usp_auth');
    }
  }, [auth]);

  // Register — auto login after registration, returns user for redirect
  const register = async (data) => {
    try {
      const result = await registerUser(data);
      setAuth({ user: result.user, token: result.token });
      return result.user;
    } catch (error) {
      throw new Error(getErr(error));
    }
  };

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Please enter both email and password.');
    try {
      const result = await loginUser({ email, password });
      setAuth({ user: result.user, token: result.token });
      return result.user;
    } catch (error) {
      throw new Error(getErr(error));
    }
  };

  const updateProfile = async (formData) => {
    try {
      const result = await updateProfileService(formData);
      setAuth((prev) => ({ ...prev, user: result.user }));
      return result.user;
    } catch (error) {
      throw new Error(getErr(error));
    }
  };

  const logout = () => setAuth({ user: null, token: null });

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
