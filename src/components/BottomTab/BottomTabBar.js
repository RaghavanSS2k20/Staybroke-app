import styles from "./bottomtab.module.css"
import Image from "next/image"
import { useState } from "react"

import ExpenseActive from "@/assets/bottombar/expenses_active.svg"
import Expense from "@/assets/bottombar/expenses.svg"

import Charts from "@/assets/bottombar/charts.svg"
import ChartsActive from "@/assets/bottombar/charts_active.svg"

import User from  "@/assets/bottombar/user.svg"
import UserActive from  "@/assets/bottombar/user_active.svg"


export const BottomTabBar = ()=>{
    const [activeIndex, setActiveIndex] = useState(0);

    return(
        <div className={styles.wrapper}>
            <div  className={`${styles.item} ${activeIndex === 0 ? styles.active : ""}`} onClick={() => setActiveIndex(0)}>
                <Image loading="eager" height={12} width={12} src={activeIndex === 0?ExpenseActive:Expense}/> 
            </div>
            <div className={`${styles.item} ${activeIndex === 1 ? styles.active : ""}`} onClick={() => setActiveIndex(1)}>
                <Image loading="eager" height={15} width={15} src={activeIndex === 1?ChartsActive:Charts}/> 
            </div>
            <div className={`${styles.item} ${activeIndex === 2 ? styles.active : ""}`} onClick={() => setActiveIndex(2)}>
                <Image loading="eager" height={12} width={12} src={activeIndex === 2?ExpenseActive:Expense}/> 
            </div>
            <div className={`${styles.item} ${activeIndex === 3 ? styles.active : ""}`} onClick={() => setActiveIndex(3)}>
                <Image loading="eager" height={15} width={15} src={activeIndex === 3?UserActive:User}/> 
            </div>
        </div>
    )
}