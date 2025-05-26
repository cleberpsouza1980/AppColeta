import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";


const AuthContext = createContext<{
  signIn: (arg0: string, arg1: string) => void;
  signOut: () => void
  token: string | null;
  login: string | null;
  isLoading: boolean;
  logou: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  token: null,
  login: null,
  isLoading: true,
  logou: false,
});

// Access the context as a hook
export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const tokenRef = useRef<string | null>(null);
  const loginRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logou, setLogou] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      console.log("Obtem token");
      const token = await AsyncStorage.getItem('@token');
      const usu = await AsyncStorage.getItem('@usu');
      tokenRef.current = token || '';
      loginRef.current = usu || '';
      setIsLoading(false);
    })()
  }, []);

  const signIn = useCallback(async (token: string, user: string) => {
    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@usu', user);
    tokenRef.current = token;
    loginRef.current = user;
    console.log("Gravar token" + token);
    router.replace('/');
    setLogou(true);
  }, []);

  const signOut = useCallback(async () => {
    console.log("Destroi token");
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@usu');
    tokenRef.current = null;
    loginRef.current = null;
    router.replace('/login');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        token: tokenRef.current || null,
        login: loginRef.current || null,
        isLoading,
        logou,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};