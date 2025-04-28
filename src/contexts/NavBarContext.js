import { Children, createContext, useContext, useState } from "react";
const NavBarContext  = createContext()
    export const NavBarProvider=({children})=>{
        const [heading, setHeading] = useState("");
        const [isExpandable, setIsExpandable] = useState(false);
        

        return(
            <NavBarContext.Provider value = {{heading,setHeading, isExpandable, setIsExpandable}}>
                {children}
            </NavBarContext.Provider>
        )
    }

export const useNavBar = () => useContext(NavBarContext);