'use server'
import { Month } from "./monthModel";
import mongoose from "mongoose";
import {Expense} from "../expense/expenseModel";

export function getCurrentMonthSlug() {
    const now = new Date();
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
  
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
  
    return `${month}-${year}`;
  }
  

export const createMonth = async ({ credit, slug }) => {
    const month = new Month({
      _id: new mongoose.Types.ObjectId(),
      credit: mongoose.Types.Decimal128.fromString(credit.toFixed(2)),
      slug
    });
    return await month.save();
};

export const addExpenseToMonth = async (slug, expenseData) => {
    const month = await Month.findOne({ slug });
    if (!month) throw new Error(`Month with slug '${slug}' not found`);
  
    const expense = new Expense({
      _id: new mongoose.Types.ObjectId(),
      ...expenseData
    });
  
    const savedExpense = await expense.save();
  
    await Month.updateOne({ slug }, {
      $push: { expenses: savedExpense._id }
    });
  
    return savedExpense;
};

export const removeExpenseFromMonth = async (slug, expenseId) => {
    const month = await Month.findOne({ slug });
    if (!month) throw new Error(`Month with slug '${slug}' not found`);
  
    await Month.updateOne({ slug }, {
      $pull: { expenses: expenseId }
    });
  
    await Expense.findByIdAndDelete(expenseId);
};

export const getMonthSavings = async (slug) => {
    const month = await Month.findOne({ slug }).populate("expenses");
    if (!month) throw new Error(`Month with slug '${slug}' not found`);
  
    const totalExpenses = month.expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount);
    }, 0);
  
    const credit = parseFloat(month.credit.toString());
    const savings = credit - totalExpenses;
  
    return {
      credit: credit.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      savings: savings.toFixed(2)
    };
};

export const getExpensesForMonthSlug = async (slug) => {
    const month = await Month.findOne({ slug }).populate('expenses');
    if (!month) throw new Error(`Month with slug '${slug}' not found`);
  
    return month.expenses;
};



  


  