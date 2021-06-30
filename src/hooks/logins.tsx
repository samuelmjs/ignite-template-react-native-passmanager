import React, { useContext, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginDataProps {
    id: string;
    title: string;
    email: string;
    password: string;
};


interface LoginProviderProps {
    children: ReactNode;
}

interface LoginContextData {
    getLogins(): Promise<LoginDataProps[]>;
    setLogins(data: LoginDataProps): Promise<void>
}

const LoginContext = createContext({} as LoginContextData);

function LoginProvider({ children }: LoginProviderProps) {
    const key = '@passmanager:logins';

    async function getLogins() {
        const data = await AsyncStorage.getItem(key);
        const loginData = data ? JSON.parse(data) : [];

        return loginData;
    }

    async function setLogins(newLogin: LoginDataProps) {
        const data = await AsyncStorage.getItem(key);
        const loginData = data ? JSON.parse(data) : []

        await AsyncStorage.setItem(key, JSON.stringify([...loginData, newLogin]));
    }

    return (
        <LoginContext.Provider value={{ getLogins, setLogins }}>
            {children}
        </LoginContext.Provider>
    )
}


function useLogins() {
    const context = useContext(LoginContext);

    return context;
}

export { LoginProvider, useLogins };