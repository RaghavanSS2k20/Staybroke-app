import { getExpensesGroupedByMonth, addExpense, searchExpense } from "@/backend/entities/expense/expenseController";
import { NextResponse } from "next/server";
export default async function handler(req,res){
    if(req.method == 'POST'){
        try{
            const data = req.body.expense
            console.log("Data recived : ",data)
            const response = await addExpense({description:data.description, amount:data.amount})
            // return NextResponse.json(response, { status: 200 });
            return res.status(200).json({data:response})
            
        }catch(e){
            console.error('Add expense error:', e.message);
            return res.status(500).json({ error: e.message });
        }
    }

    else if (req.method === 'GET') {
        try {
            const { q } = req.query;
            let groupedExpenses;
    
            if (q && q.trim() !== "") {
                groupedExpenses = await searchExpense(q);
            } else {
                groupedExpenses = await getExpensesGroupedByMonth();
            }
    
            res.status(200).json({ data: groupedExpenses });
        } catch (error) {
            console.error('Error getting grouped expenses:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
    else{
        res.status(405).json({
            message:"Method not allowed"
        })
    }
}