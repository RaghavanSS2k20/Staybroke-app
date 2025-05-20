import ExpenseComponent from "@/components/index/expense/ExpenseComponent";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import { ExpenseSheet } from "@/components/drawer/drawerComponent";
import { AddSVGComponent } from "@/assets/SVGComponents";
import {getAllExpenses} from "@/services/ExpenseService";
import { useSheet } from "@/contexts/SheetContext";
import { Loader } from "@/components/fallbacks/Loader/LoadingComponent";
import { useNavBar } from "@/contexts/NavBarContext";

function formatMonthYear(dateString) {
  const parts = dateString.split('-');  // Split "2025-April" into ["2025", "April"]
  if (parts.length !== 2) return dateString;  // Fallback if format is incorrect
  return `${parts[1]} ${parts[0]}`;  // "April 2025"
}




export default function ExpenseList() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const {filters} = useNavBar();
  const { openSheet } = useSheet();
  const [sheetMode, setSheetMode] = useState("add"); // 'add' or 'edit'
const [selectedExpense, setSelectedExpense] = useState(null);
  const bottomRef = useRef(null);

  // const openSheet = (mode = "add", data = null) => {
  //   setSheetMode(mode);
  //   setSelectedExpense(data);
  //   setOpen(true);
  // };

  const onOpen = () => setOpen(true);

  const fetchExpenses = async (query = "", guilt = null) => {
    setLoading(true);
    const res = await getAllExpenses(query, guilt);
    if (res.success) {
      setExpenses(res.data.data);
    } else {
      console.error("Error loading expenses:", res.error);
    }
    setLoading(false);
  };


 useEffect(() => {
    fetchExpenses(filters.query || "", filters.guilt ?? null);
  }, [filters]);

  return (
    <>
      <div className={styles.expensesPage}>
      {loading ? (
          <Loader message={'Loading Expenses...'}/>
        ) : (
          <div className={styles.month}>
            {expenses.map((expenseGroup) => (
              <div key={expenseGroup.month} className={styles.monthGroup}>
                {/* Month Heading */}
                <div className={styles.monthHeading}>
                  <p>{formatMonthYear(expenseGroup.month)}</p>
                  <p>₹{expenseGroup.totalSpend}</p>
                </div>

                {/* Expenses List */}
                <div className={styles.expensesList}>
                  {expenseGroup.expenses.map((expense) => (
                    <ExpenseComponent 
                      key={expense._id} 
                      expenseData={expense} 
                      openSheet={openSheet}
                      reload={fetchExpenses}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      <div className={styles.fab} onClick={() => openSheet("add",null, fetchExpenses)}>
        <AddSVGComponent size={15} />
      </div>
    </>
  );
}
