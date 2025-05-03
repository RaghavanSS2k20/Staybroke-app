import { getExpensesGroupedByMonthOpt } from "@/backend/entities/expense/expenseController";
export default async function handler(req,res){
    if(req.method == 'GET'){
        try{
            const groupedExpenses = await getExpensesGroupedByMonthOpt();
            res.status(200).json({
                data:groupedExpenses
            })

        }catch(e){
            console.error('Error getting grouped expenses:', error.message);
            res.status(500).json({
                message:error.message
            })
        }
    }
}