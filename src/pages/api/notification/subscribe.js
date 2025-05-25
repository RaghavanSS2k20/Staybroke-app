import { subscriptions } from "@/backend/utils/notification";

export default async function handler(req,res){
    if(req.method == 'POST'){
        const subscription = req.body;
        console.log(subscription)
        subscriptions.push(subscription);

        res.status(201).json({status: "success"});
    }
    else{
        res.status(405).json({
            message:"Method not allowed"
        })
    }
}