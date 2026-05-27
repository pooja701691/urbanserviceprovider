import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { updateUserProfile as updateProfileService } from '../services/userService';

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  logout: () => {},
});

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors?.[0]?.msg) return error.response.data.errors[0].msg;
  return error?.message || 'Unexpected error';
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = window.localStorage.getItem('usp_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });

  useEffect(() => {
    if (auth?.user && auth?.token) {
      window.localStorage.setItem('usp_auth', JSON.stringify(auth));
    } else {
      window.localStorage.removeItem('usp_auth');
    }
  }, [auth]);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const result = await loginUser({ email, password });
      setAuth({ user: result.user, token: result.token });
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async ({ name, email, password, phone }) => {
    if (!name || !email || !password || !phone) {
      throw new Error('Please fill in all fields.');
    }

    try {
      const result = await registerUser({ name, email, password, phone });
      setAuth({ user: result.user, token: result.token });
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateProfile = async (formData) => {
    try {
      const result = await updateProfileService(formData);
      setAuth((prev) => ({ ...prev, user: result.user }));
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => setAuth({ user: null, token: null });

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
