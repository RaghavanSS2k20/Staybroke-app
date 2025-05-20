import { Children, createContext, useContext, useState , useCallback} from "react";
const NavBarContext  = createContext()
    export const NavBarProvider=({children})=>{
        const [heading, setHeading] = useState("");
        const [isExpandable, setIsExpandable] = useState(false);
         const [filters, setFilters] = useState({});

        const emit = useCallback((newData) => {
                setFilters(prev => ({ ...prev, ...newData }));
        }, []);

        return(
            <NavBarContext.Provider value = {{heading,setHeading, isExpandable, setIsExpandable,emit, filters}}>
                {children}
            </NavBarContext.Provider>
        )
    }

export const useNavBar = () => useContext(NavBarContext);