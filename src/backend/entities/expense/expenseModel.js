import mongoose from "mongoose";
import { connectDB } from "@/backend/utils/connect";
const expenseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description:{
        required:true,
        type:String
    },
    amount:{
        required:true,
        type:String
    },
    date: {
        required: true,
        default: Date.now,
        type: Date
    },
    guilty:{
        type:Boolean,
        default:false
    },
    from_splitwise:{
        type : Boolean,
        default :false

    },
    splitwise_id:{
        type:String,
        default:null
    },
    created_ts: {
        type: Date,
        default: Date.now
    }

})

const Expense = mongoose.models?.Expense || mongoose.model("Expense", expenseSchema)
export default Expense