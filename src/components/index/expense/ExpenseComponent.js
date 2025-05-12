"use client"
import React from "react"
import styles from "./expense.module.css"
import { useNavBar } from "@/contexts/NavBarContext"
import { useEffect } from "react"
import { Collapsible } from "@chakra-ui/react"
import { AddSVGComponent } from "@/assets/SVGComponents";
import { Sheet } from "@/components/drawer/drawerComponent"
// import { BottomSheet } from "@/components/sheet/BottomSheetComponent";
import { useState } from "react";
import Expense from "@/assets/bottombar/expenses.svg"
import SadIcon from "@/assets/Navbar/sad.svg"
import Image from "next/image"
import { updateGuilt } from "@/services/ExpenseService"
import { useSheet } from "@/contexts/SheetContext"
import { deleteExpense } from "@/services/ExpenseService"
import EditIcon from "@/assets/ExpenseList/edit.svg"

function getDayAndMonth(dateString) {
  // console.log("Date here : ",dateString)
  if(dateString && dateString!==''){
  const date = new Date(dateString);

  const day = date.getDate(); // 1–31
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date); // Jan, Feb, etc.

  return { day, month };
  }
}

export default function ExpenseComponent({expenseData,reload}){
    const { setHeading } = useNavBar();
    const { openSheet } = useSheet();
    const [open, setOpen] = useState(false);
    // console.log(expenseData)
    const [isGuilty, setIsGuilty] = useState(expenseData.guilty)
    const onOpen = () =>{
      setOpen(!open)
    }

    function handleEdit(){
      console.log("YESSSSSS")
      openSheet('edit', expenseData, reload);
    }

    function handleDelete(){
      openSheet('alert',{
        header:`Do you Want To Delete Expense ${expenseData.description}?`,
        message:"This Action IS Irreversible!",
      },
      async ()=>{
        const res = await deleteExpense(expenseData._id)
        if(res.success){
          reload()
        }
      }
    )
    }

    

    // console.log("SHIT : ",expenseData.expense)
    const expense = expenseData



    useEffect(() => {
      setHeading("Expenses");
    }, [setHeading]); // Only run once when the page loads

    const date = getDayAndMonth(expense?.date)

    const handleDoubleClick = async () => {
      setIsGuilty(!isGuilty)
      if (navigator.vibrate) {
        // alert("YESSS")
        navigator.vibrate(50); // Vibrates for 200ms
      }
      // Call the updateGuilt function when double-clicked or double-tapped
      const res =  await updateGuilt(expense._id); // Assuming `expense.id` is passed for updating
      if(res.success){
        console.log(res.data)
      }else{

      }
    };

    // const handleDelete = () => {

    // }

    const handleDeleteClick = ()=>{
        openSheet('alert',data={
          header:`Do you Want To Delete ${expense.name}?`,
          message:"This Action IS Irreversible!",

        },
        ()=>{

        }
      )
    }


    return(
      <>
        <Collapsible.Root>
          <Collapsible.Trigger style={{width:'100%'}}>       
              <div className={styles.expenseCard}
                onDoubleClick={handleDoubleClick} // Handle double-click for desktop
                // onTouchEnd={handleDoubleClick} // Handle double-touch for mobile
              >
                <div className={styles.date}>
                  <div>{date?.day}</div>
                  <div>{date?.month}</div>
                </div>
              
                <div className={styles.details}>
                  <div className={styles.titleRow}>
                    <div className={styles.title}>{expense.description}</div>
                  
                  </div>
                  <div className={styles.subtitle}>{(expense.from_splitwise) &&(<>From Splitwise</>)}</div>
                </div>
                <div className={styles.icon}>
                      {/* optional icon */}
                      {(isGuilty) && (
                        <Image src={SadIcon} height={27} width={27} alt="Sad" />
                      )}
                      
                    </div>
              
                <div className={styles.amount}>
                  ₹{expense.amount}
                </div>

                




              </div>
          </Collapsible.Trigger>
          <Collapsible.Content
           style={expense.from_splitwise ? { display: 'none' } : {}}
          >
          <div className={styles.hidden}>
            <div className={styles.actions}>
                  <div className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>
                      Delete
                  </div>
                  <div className={styles.button} onClick={handleEdit}>
                      Edit
                  </div>
            </div>
          </div>
          </Collapsible.Content>
        </Collapsible.Root>
            
       
            
            
            

        
      </>
      
    )
}