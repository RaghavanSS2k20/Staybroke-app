import { updateGuilt, updateExpense, deleteSpend } from "@/backend/entities/expense/expenseController";
export default async function handler(req,res){
   
    const { id } = req.query;

    if(req.method === 'PATCH'){
        const { toUpdate, value } = req.body;
        if (!toUpdate) {
            try{
            const { description, amount } = req.body;
            const result = await updateExpense({ id, description, amount });
            if (!result.success) {
                return res.status(400).json(result);
              }
          
            return res.status(200).json({ success: true, data: result.data });
            }catch(e){
                console.error('API error:', error);
                return res.status(500).json({ success: false, error: error.message });
            }


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
    else if(req.method === 'DELETE'){
        try{
            const result = await deleteSpend(id);
            if (!result.success) {
                return res.status(400).json(result);
              }
          
            return res.status(200).json({ data: result.data });
        }catch(e){
            console.error('API error:', error);
            return res.status(500).json({ error: error.message });

        }
    }
}