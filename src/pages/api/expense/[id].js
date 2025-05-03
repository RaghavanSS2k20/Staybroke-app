import { updateGuilt } from "@/backend/entities/expense/expenseController";
export default async function handler(req,res){
   
    const { id } = req.query;

    if(req.method === 'PATCH'){
        const { toUpdate, value } = req.body;
        if (!toUpdate) {
            return res.status(400).json({ error: 'Missing "toUpdate" in request body' });
        }
        else if(toUpdate === 'guilt'){
            try {
                const updatedExpense = await updateGuilt(id);
                return res.status(200).json({data:updatedExpense});
              } catch (error) {
                return res.status(500).json({ error: error.message });
              }
        }




      

    }
}