import ExpenseComponent from "@/components/index/expense/ExpenseComponent";
import styles from "../styles/Home.module.css"
import { useState, useEffect, useRef } from "react";
import { Sheet } from "@/components/drawer/drawerComponent";
import { AddSVGComponent } from "@/assets/SVGComponents";
// import { Sheet } from "@/components/drawer/drawerComponent";
export default function ExpenseList(){

  const [open, setOpen] = useState(false)
  const bottomRef = useRef(null);

  const onOpen = () => {
    setOpen(true);

  
  };


  
  const expenses = [
    {
      "date": "2025-04-26T10:23:00.000Z",
      "title": "Coffee at Starbucks",
      "amount": 250,
      "isGuilty": false,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-26T15:45:00.000Z",
      "title": "Petrol Refill",
      "amount": 1500,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-25T09:10:00.000Z",
      "title": "Late Night Zomato Order",
      "amount": 350,
      "isGuilty": true,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-24T20:30:00.000Z",
      "title": "Netflix Subscription",
      "amount": 499,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-24T13:15:00.000Z",
      "title": "Lunch at Meghna Foods",
      "amount": 300,
      "isGuilty": true,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-23T18:00:00.000Z",
      "title": "Bus Ticket",
      "amount": 50,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-23T11:30:00.000Z",
      "title": "Gym Membership",
      "amount": 2000,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-22T21:00:00.000Z",
      "title": "Impulse Online Shopping",
      "amount": 1200,
      "isGuilty": true,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-22T08:45:00.000Z",
      "title": "Morning Tea",
      "amount": 30,
      "isGuilty": false,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-21T14:20:00.000Z",
      "title": "Coworking Space Rent",
      "amount": 4500,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-21T17:00:00.000Z",
      "title": "Grocery Shopping",
      "amount": 1800,
      "isGuilty": false,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-20T19:40:00.000Z",
      "title": "Delivery Tip",
      "amount": 70,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-20T12:30:00.000Z",
      "title": "Uber Ride",
      "amount": 500,
      "isGuilty": false,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-19T22:10:00.000Z",
      "title": "Unplanned Party",
      "amount": 2500,
      "isGuilty": true,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-19T16:15:00.000Z",
      "title": "Electricity Bill",
      "amount": 900,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-18T11:00:00.000Z",
      "title": "Medicine Purchase",
      "amount": 600,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-18T14:45:00.000Z",
      "title": "Chai with Friends",
      "amount": 120,
      "isGuilty": false,
      "isFromSplitwise": true
    },
    {
      "date": "2025-04-17T09:30:00.000Z",
      "title": "Breakfast at Waffle House",
      "amount": 400,
      "isGuilty": true,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-17T19:00:00.000Z",
      "title": "Bike Repair",
      "amount": 2200,
      "isGuilty": false,
      "isFromSplitwise": false
    },
    {
      "date": "2025-04-16T07:20:00.000Z",
      "title": "Water Bottles",
      "amount": 60,
      "isGuilty": false,
      "isFromSplitwise": false
    }
  ]
  
  
  return(
    <>
    <div className={styles.expensesPage}>
      <div className={styles.expensesList}>
        {expenses.map((expense) => (
          <ExpenseComponent key={expense.id}/>
        ))}
      </div>
    </div>

   
    
    <Sheet open={open} setOpen={setOpen}/>

    <div className={styles.fab}  onClick={onOpen}>
       <AddSVGComponent size={15}/>
    </div>
   
    </>

    
  )
}
