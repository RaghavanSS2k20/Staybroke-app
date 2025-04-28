import styles from "./expense.module.css"
import { useNavBar } from "@/contexts/NavBarContext"
import { useEffect } from "react"
export default function ExpenseComponent(){
    const { setHeading } = useNavBar();
    useEffect(() => {
        setHeading("Expenses");
      }, [setHeading]); // Only run once when the page loads

    return(
        <div className={styles.expenseCard}>
        <div className={styles.date}>
          <div>25</div>
          <div>Mar</div>
        </div>
      
        <div className={styles.details}>
          <div className={styles.titleRow}>
            <div className={styles.title}>Meghna Dum Briyani</div>
            <div className={styles.icon}>
              {/* optional icon */}
              
            </div>
          </div>
          <div className={styles.subtitle}>From Splitwise</div>
        </div>
      
        <div className={styles.amount}>
          ₹25.00
        </div>
      </div>
      
    )
}