import { createContext, useContext,useState } from "react";
const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
    const [sheet, setSheet] = useState({
        open: false,
        mode: null,
        data: null,
        callback : null

    });

    const openSheet = (mode, data = null,callback) => {
        console.log("Opening sheet with mode:", mode, data, callback);
        setSheet({ open: true, mode, data, callback });
    };
    
    const closeSheet = () => {
        setSheet({ ...sheet, open: false });
    };

    return (
        <SheetContext.Provider value={{ sheet, openSheet, closeSheet }}>
          {children}
        </SheetContext.Provider>
    );
    
}

export const useSheet = () => useContext(SheetContext);