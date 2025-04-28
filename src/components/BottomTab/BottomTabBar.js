import styles from "./bottomtab.module.css"
import Image from "next/image"
import { useState } from "react"

import ExpenseActive from "@/assets/bottombar/expenses_active.svg"
import Expense from "@/assets/bottombar/expenses.svg"

export const BottomTabBar = ()=>{
    const [activeIndex, setActiveIndex] = useState(0);

    return(
        <div className={styles.wrapper}>
            <div  className={`${styles.item} ${activeIndex === 0 ? styles.active : ""}`} onClick={() => setActiveIndex(0)}>
                <Image src={activeIndex === 0?ExpenseActive:Expense}/> 
            </div>
            <div className={styles.item} onClick={() => setActiveIndex(1)}>
                <Image src={Expense}/> 
            </div>
            <div className={styles.item} onClick={() => setActiveIndex(2)}>
                <Image src={Expense}/> 
            </div>
            <div className={styles.item} onClick={() => setActiveIndex(3)}>
                <Image src={Expense}/> 
            </div>
        </div>
    )
}