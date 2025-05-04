// UserContext.js
import { createContext, useState, useContext, ReactNode } from 'react';

interface UserInfo {
    loggedIn : boolean
}

interface UserContextType {
    user: UserInfo,
    login: (userData: UserInfo) => void,
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children } : { children: ReactNode }) {

  const [user, setUser] = useState<UserInfo>({ loggedIn: false }); // null = not logged in

  const login = (userData: UserInfo) => setUser(userData);
  const logout = () => setUser({loggedIn : false});

  return (
    <UserContext.Provider value={{ user, login, logout }}>
        {children}
    </UserContext.Provider>
  );
}

export function useUserContext(){
    const user = useContext(UserContext);

    if (user === undefined){
        throw new Error('User Context is undefined. Make sure it is wrapped around UserProvider');
    }

    return user;
}

