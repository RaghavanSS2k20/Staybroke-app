import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
const monthSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    credit : {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        
    },
    slug:{
        type: String,
        unique:true,
        required:true,
    },

    expenses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Expense',
            
        }
    ],
    



})
export const Month = mongoose.models.Month || mongoose.model('Month', monthSchema)