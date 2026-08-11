import { createContext, useState, useEffect, useMemo, useCallback } from "react";

export const UserContext = createContext({
    user: null as string | null,
    setUser: (_user: string | null) => {},
    logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(user);
        }
    }, []);
    const handleSetUser = useCallback((user: string | null) => {
        setUser(user);
        localStorage.setItem('user', user || '');
    }, []);
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }, []);
    const value = useMemo(
        () => ({ user, setUser: handleSetUser, logout }),
        [user, handleSetUser, logout],
    );
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
