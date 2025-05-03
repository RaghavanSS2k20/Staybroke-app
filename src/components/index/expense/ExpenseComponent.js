"use client"
import React from "react"
import styles from "./expense.module.css"
import { useNavBar } from "@/contexts/NavBarContext"
import { useEffect } from "react"
import { AddSVGComponent } from "@/assets/SVGComponents";
import { Sheet } from "@/components/drawer/drawerComponent"
// import { BottomSheet } from "@/components/sheet/BottomSheetComponent";
import { useState } from "react";
import Expense from "@/assets/bottombar/expenses.svg"
import SadIcon from "@/assets/Navbar/sad.svg"
import Image from "next/image"
import { updateGuilt } from "@/services/ExpenseService"

function getDayAndMonth(dateString) {
  console.log("Date here : ",dateString)
  if(dateString && dateString!==''){
  const date = new Date(dateString);

  const day = date.getDate(); // 1–31
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date); // Jan, Feb, etc.

  return { day, month };
  }
}

export default function ExpenseComponent(expenseData){
    const { setHeading } = useNavBar();
    const [open, setOpen] = useState(false)
    const onOpen = () =>{
      setOpen(!open)
    }

    console.log("SHIT : ",expenseData.expense)
    const expense = expenseData.expense

    useEffect(() => {
      setHeading("Expenses");
    }, [setHeading]); // Only run once when the page loads

    const date = getDayAndMonth(expense?.date)

    const handleDoubleClick = async () => {
      // Call the updateGuilt function when double-clicked or double-tapped
      await updateGuilt(expense.id); // Assuming `expense.id` is passed for updating
    };


    return(
      <>
       
            <div className={styles.expenseCard}>
              <div className={styles.date}>
                <div>{date?.day}</div>
                <div>{date?.month}</div>
              </div>
            
              <div className={styles.details}>
                <div className={styles.titleRow}>
                  <div className={styles.title}>{expense.description}</div>
                  <div className={styles.icon}>
                    {/* optional icon */}
                    {(expense.type === 'bad' || expense.guilty === true) && (
                       <Image src={SadIcon} height={27} width={27} alt="Sad" />
                    )}
                    
                  </div>
                </div>
                <div className={styles.subtitle}>{(expense.from_splitwise) &&(<>From Splitwise</>)}</div>
              </div>
            
              <div className={styles.amount}>
                ₹{expense.amount}
              </div>

              




            </div>
            
       
            
            
            

        
      </>
      
    )
}