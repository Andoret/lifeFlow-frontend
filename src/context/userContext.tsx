import { createContext, useState,useEffect } from "react";

export const UserContext = createContext({
    user: null as string | null,
    setUser: (user: string | null) => {},
});
    
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(user);
        }
    }, []);
    const handleSetUser = (user: string | null) => {
        setUser(user);
        console.log(user, 'user context');
        localStorage.setItem('user', user || '');
    }
    return <UserContext.Provider value={{ user, setUser: handleSetUser }}>{children}</UserContext.Provider>;
};