import { useSheet } from "@/contexts/SheetContext";
import { ExpenseSheet } from "./drawer/drawerComponent";
import AlertSheet from "./alertDrawer/alertDrawerComponent";

export default function GlobalSheetRenderer(){
    const { sheet, closeSheet } = useSheet();
    if (!sheet.open) return null;

    const commonProps = {
        alertOpen: sheet.open,
        setAlertOpen: closeSheet,
        data: sheet.data,
        callback: sheet.callback,
    };
    switch (sheet.mode) {
        case "add":
        case "edit":
          return (
            <ExpenseSheet
              open={sheet.open}
              setOpen={closeSheet}
              mode={sheet.mode}
              expenseData={sheet.data}
              reload={sheet.callback}
            />
          );
    
        case "alert":
          return (
            <AlertSheet
              alertOpen={sheet.open}
              setAlertOpen={closeSheet}
              header={sheet.data?.header}
              alert={sheet.data?.message}
              actions={{
                continue: () => {
                  sheet.callback?.(); // execute callback
                  closeSheet();       // close drawer
                },
              }}
              data={sheet.data}
            />
          );
    
        default:
          return <></>;
      }
}