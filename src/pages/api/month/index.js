import { getCurrentMonthSlug,createMonth,addExpenseToMonth,removeExpenseFromMonth,getExpensesForMonthSlug,getMonthSavings } from "@/backend/entities/month/monthController";
export default async function Handler(req,res) {
    if(req.method === 'POST'){
        try{
            const data = req.body
            onsole.log("Data recived : ",data)
            const slug =  getCurrentMonthSlug()
            const response = await createMonth(data.credit,slug)
            res.status(200).json({response})
        }catch(e){
            console.log("Error while creating Month ",e.message)
            res.status(500).json({
                 error: error.message 
            })
        }
    }
    else if(req.method === 'GET'){
        try{
            
        }catch(e){

        }
    }
}