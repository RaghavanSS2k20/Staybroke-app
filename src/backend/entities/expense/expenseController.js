import Expense from "./expenseModel";
import mongoose from "mongoose";
import { getExpensesForCurrentUser } from "@/backend/utils/splitwise";
const splitwise_user_id = process.env.SPLITWISE_USER_ID
export async function getExpensesGroupedByMonthOpt() {
  const expenses = await Expense.find().lean(); // Fetch all expenses as plain objects
  const grouped = [];

  expenses.forEach((expense) => {
    const dateObj = new Date(expense.date);
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const key = `${year}-${monthName}`; // e.g., "2024-August"

    // Find existing group for the month and year
    let group = grouped.find((g) => g.month === key);

    if (!group) {
      group = { month: key, expenses: [] };
      grouped.push(group);
    }

    group.expenses.push(expense);
  });

  // 🔽 Sort expenses inside each group by descending date
  grouped.forEach(group => {
    group.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return grouped;
}
export async function getExpensesGroupedByMonth() {
  const result = await Expense.aggregate([
    // 1. Sort all expenses by date descending
    { $sort: { date: -1 } },

    // 2. Add year and month name
    {
      $addFields: {
        year: { $year: "$date" },
        monthName: { $dateToString: { format: "%B", date: "$date" } },
      }
    },

    // 3. Group by year and month
    {
      $group: {
        _id: { year: "$year", month: "$monthName" },
        expenses: { $push: "$$ROOT" },
        latestDate: { $first: "$date" } // to sort groups
      }
    },

    // 4. Sort the groups by latest expense date
    { $sort: { latestDate: -1 } },

    // 5. Sort expenses array inside each group (MongoDB 5.2+)
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            "$_id.month"
          ]
        },
        expenses: {
          $sortArray: {
            input: "$expenses",
            sortBy: { date: -1 }
          }
        }
      }
    }
  ]);

  return result;
}





  export async function addExpense({description, amount}) {
    // const { description, amount, date } = expense;
    console.log(description,amount)
    if (!description || !amount ) {
      throw new Error("All fields (description, amount, date) are required.");
    }
  
    const newExpense = new Expense({
      _id: new mongoose.Types.ObjectId(),
      description,
      amount,
      date: new Date(),
    });
  
    return await newExpense.save();
  }

  export async function importFromSplitwise(){
      if(!splitwise_user_id){
        return { success: false, error: "No current user"};
      }else{
        const response = await getExpensesForCurrentUser();

        if (response.success) {
          const expenses = response.data;
          console.log("got Expenses", expenses.length);
        
          const splitwiseIds = expenses.map(exp => exp.id.toString());
        
          // Fetch all existing expenses by splitwise_id
          const existingExpenses = await Expense.find(
            { splitwise_id: { $in: splitwiseIds } },
            'splitwise_id'
          );
        
          const existingIdsSet = new Set(existingExpenses.map(e => e.splitwise_id));
        
          const expensesToInsert = [];
          const expensesToUpdate = [];
        
          for (const expense of expenses) {
            const currentUser = expense.users.find(u => u.user_id.toString() === splitwise_user_id);
            if (!currentUser || currentUser.owed_share === "0.0") continue;
        
            const expenseObj = {
              description: expense.description || '',
              amount: currentUser.owed_share,
              type: 'normal',
              from_splitwise: true,
              splitwise_id: expense.id.toString(),
              date: expense.date,
              
            };
            console.log(expense)
        
            if (expense.updated_by === null) {
              // New expense, only add if not already in DB
              if (!existingIdsSet.has(expense.id.toString())) {
                expensesToInsert.push({ _id: new mongoose.Types.ObjectId(), ...expenseObj });
              }
            } else {
              // Updated expense, push to update list
              expensesToUpdate.push(expenseObj);
            }
          }
        
          try {
            // Insert new expenses
            if (expensesToInsert.length > 0) {
              console.log("Inserting")
              await Expense.insertMany(expensesToInsert);
            }
        
            // Update existing expenses
            console.log("UPDATE ARRAY HERE : ", expensesToUpdate)
            for (const expense of expensesToUpdate) {
              await Expense.updateOne(
                { splitwise_id: expense.splitwise_id },
                { $set: { amount: expense.amount, description: expense.description } }, // you can set more fields if needed
                { upsert: true } // <--- this will insert a new document if no match is found
              );
            }
        
            return { success: true };
          } catch (error) {
            console.error('Error syncing expenses:', error);
            return { success: false, error: error.message };
          }
        } else {
          console.error("Error while getting from splitwise", response.error);
          return {
            success: false,
            error: response.error
          };
        }
      }
  }

  export async function GetLastupdatedTimestamp() {
    try {
      const latestExpense = await Expense.findOne()
        .sort({ created_ts: -1 }) // Sort by newest first
        .select('created_ts')     // Only return the created_at field
                         // Return plain JS object (optional)
  
      return latestExpense["created_ts"] || null;
    } catch (err) {
      console.error('Error fetching latest timestamp:', err);
      return null;
    }
  }

  export async function updateGuilt(expenseId) {
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      throw new Error('Invalid expense ID');
    }
  
    const expense = await Expense.findById(expenseId);
  
    if (!expense) {
      throw new Error('Expense not found');
    }
    
    expense.guilty = !expense.guilty;
    console.log(expense)
    await expense.save();
  
    return expense;
  }