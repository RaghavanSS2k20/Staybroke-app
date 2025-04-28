import axios from "axios"
import { GetLastupdatedTimestamp } from "../entities/expense/expenseController"
export const  getExpensesForCurrentUser= async ()=>{
    const SPLITWISE_API = process.env.SPLITWISE_URI
    // console.log(SPLITWISE_API)
    const SPLITWISE_API_KEY = process.env.API_KEY
    try{
    const last_timestamp = await GetLastupdatedTimestamp()
    console.log("LAST TIME STAMP",last_timestamp)
    const response = await axios.get(SPLITWISE_API,{
        headers:{
            Authorization:`Bearer ${SPLITWISE_API_KEY}`
        },
        params: {
            limit: 0,
            offset: 0,
            ...(last_timestamp && { updated_after: last_timestamp})

        },
    })
    if (response.status === 401){
        console.log(response)
        return{
            success:false,
            error: "un authourized"
        }
    }
    const expenses = response.data.expenses
    return{
        success:true,
        data:expenses
    }

    }catch(e){
        return{
            success:false,
            error:e
        }
    }
}
