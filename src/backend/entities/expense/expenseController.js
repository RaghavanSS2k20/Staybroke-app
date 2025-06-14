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
export async function getExpensesGroupedByMonth(query = null, guilt = null) {
  const pipeline = [];

  // 0. Build dynamic $match stage
  const matchStage = {};

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      // Convert description value to case-insensitive regex if it's a string
      if (key === "description" && typeof value === "string") {
        matchStage[key] = { $regex: value, $options: "i" }; // case-insensitive search
      } else {
        matchStage[key] = value;
      }
    }
  }

  // Add guilty filter if requested
  if (guilt && guilt === true) {
    matchStage.guilty = true;
  }

  // Push match stage if it has filters
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // 1. Sort expenses by date descending
  pipeline.push({ $sort: { date: -1 } });

  // 2. Add year, month name, and convert amount to number
  pipeline.push({
    $addFields: {
      year: { $year: "$date" },
      monthName: { $dateToString: { format: "%B", date: "$date" } },
      numericAmount: { $toDouble: "$amount" }
    }
  });

  // 3. Group by year and month
  pipeline.push({
    $group: {
      _id: {
        year: "$year",
        month: "$monthName"
      },
      expenses: { $push: "$$ROOT" },
      totalSpend: { $sum: "$numericAmount" },
      latestDate: { $first: "$date" }
    }
  });

  // 4. Sort groups by latest expense date
  pipeline.push({ $sort: { latestDate: -1 } });

  // 5. Final formatting
  pipeline.push({
    $project: {
      _id: 0,
      month: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          "$_id.month"
        ]
      },
      totalSpend: 1,
      expenses: {
        $sortArray: {
          input: "$expenses",
          sortBy: { date: -1 }
        }
      }
    }
  });

  const result = await Expense.aggregate(pipeline);
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

  export async function updateExpense({ id, description, amount }) {
    try {
      if (!id || !description || !amount) {
        return { success: false, error: "All fields (id, description, amount) are required." };
      }
  
      const existing = await Expense.findById(id);
  
      if (!existing) {
        return { success: false, error: "Expense not found." };
      }
  
      if (existing.from_splitwise) {
        return { success: false, error: "Updates to Splitwise expenses are not allowed." };
      }
  
      const updated = await Expense.findByIdAndUpdate(
        id,
        { description, amount },
        { new: true }
      );
  
      return { success: true, data: updated };
    } catch (err) {
      console.error("Error updating expense:", err);
      return { success: false, error: err.message };
    }
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
          const expensesToDelete = [];
        
          for (const expense of expenses) {
            if (expense.deleted_by !== null) {
              expensesToDelete.push(expense.id.toString());
              continue;
            }
            if(expense.payment) continue;            
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
            } 
          
            else {
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
            if (expensesToDelete.length > 0) {
              console.log("Deleting expenses:", expensesToDelete);
              await Expense.deleteMany({ splitwise_id: { $in: expensesToDelete } });
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
      const latestExpense = await Expense.findOne({ splitwise_id: { $ne: null } }) // ✅ Filter for Splitwise-imported
        .sort({ created_ts: -1 })        // Sort by newest first
        .select('created_ts');           // Only return the created_ts field
  
      return latestExpense?.created_ts || null;
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

  export async function deleteSpend(expenseId) {
    try{
      const expense = await Expense.findById(expenseId);
      if(!expense){
        return { success: false, error: "Expense not found" }
      }
      if(expense.from_splitwise){
        return { success:false, error: "Cannot delete Splitwise expenses" }
      }
      await Expense.findByIdAndDelete(expenseId);
      return { success: true }

    }catch(e){
      return { success: false, error: e.message }
    }
  }

  export async function searchExpense(query){
    const result = await Expense.aggregate([
      // 1. Filter by description using regex (case-insensitive)
      {
        $match: {
          description: { $regex: query, $options: "i" }
        }
      },
  
      // 2. Sort by date descending
      { $sort: { date: -1 } },
  
      // 3. Add year and month name
      {
        $addFields: {
          year: { $year: "$date" },
          monthName: { $dateToString: { format: "%B", date: "$date" } }
        }
      },
  
      // 4. Group by year and month
      {
        $group: {
          _id: { year: "$year", month: "$monthName" },
          expenses: { $push: "$$ROOT" },
          latestDate: { $first: "$date" }
        }
      },
  
      // 5. Sort groups by latest expense
      { $sort: { latestDate: -1 } },
  
      // 6. Format month string and optionally sort expenses array inside group (MongoDB 5.2+)
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