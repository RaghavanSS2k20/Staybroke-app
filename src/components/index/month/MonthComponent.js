import ExpenseComponent from "../expense/ExpenseComponent"
import styles from "./month.module.css"
export const MonthComponent = (month)=>{
    return(
        <div className={styles.wrapper}>
            <div className={styles["month-heading"]}>
                <p className={styles["momth-name"]}>
                    {month.name}
                </p>
                <p className={styles["momth-name"]}>
                    {month.credit}
                </p>
            </div>
        </div>
    )
}