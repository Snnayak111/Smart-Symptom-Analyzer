import { createContext, useState } from "react";

export const ProfileContext = createContext()

const ProfileContextProvider = ({children}) => {
    const [profile, setProfile] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    return (
        <ProfileContext.Provider value={{ profile, setProfile, isAuth, setIsAuth }}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContextProvider