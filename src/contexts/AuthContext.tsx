
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  isBlocked: boolean;
  timeRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

const VALID_CREDENTIALS = {
  username: 'NortekAdmin',
  password: 'Guayabera1024'
};

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Verificar autenticação persistente
  useEffect(() => {
    const savedAuth = localStorage.getItem('nortek_auth');
    const savedAttempts = localStorage.getItem('nortek_attempts');
    const savedBlockTime = localStorage.getItem('nortek_block_time');

    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      const now = Date.now();
      
      if (now - authData.timestamp < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        setUser(authData.username);
        startSessionTimeout();
      } else {
        localStorage.removeItem('nortek_auth');
      }
    }

    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }

    if (savedBlockTime) {
      const blockTime = parseInt(savedBlockTime);
      const now = Date.now();
      
      if (now < blockTime) {
        setIsBlocked(true);
        setTimeRemaining(Math.ceil((blockTime - now) / 1000));
      } else {
        localStorage.removeItem('nortek_block_time');
        localStorage.removeItem('nortek_attempts');
        setLoginAttempts(0);
      }
    }
  }, []);

  // Countdown do bloqueio
  useEffect(() => {
    if (isBlocked && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('nortek_block_time');
            localStorage.removeItem('nortek_attempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isBlocked, timeRemaining]);

  const startSessionTimeout = useCallback(() => {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    
    const timeout = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
    
    setSessionTimeout(timeout);
  }, [sessionTimeout]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (isBlocked) return false;

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser(username);
      setLoginAttempts(0);
      localStorage.removeItem('nortek_attempts');
      localStorage.removeItem('nortek_block_time');
      
      // Salvar sessão
      localStorage.setItem('nortek_auth', JSON.stringify({
        username,
        timestamp: Date.now()
      }));
      
      startSessionTimeout();
      return true;
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('nortek_attempts', newAttempts.toString());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const blockUntil = Date.now() + BLOCK_DURATION;
        setIsBlocked(true);
        setTimeRemaining(Math.ceil(BLOCK_DURATION / 1000));
        localStorage.setItem('nortek_block_time', blockUntil.toString());
      }
      
      return false;
    }
  }, [isBlocked, loginAttempts, startSessionTimeout]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('nortek_auth');
    if (sessionTimeout) clearTimeout(sessionTimeout);
    setSessionTimeout(null);
  }, [sessionTimeout]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loginAttempts,
    isBlocked,
    timeRemaining
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
