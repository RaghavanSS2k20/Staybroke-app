import { importFromSplitwise } from "@/backend/entities/expense/expenseController";
export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const data = req.body;
  
        console.log('Incoming webhook data:', data);
        const response = await importFromSplitwise()

        // Respond with a success message
        if(response.success){
          console.log("YESSSSSSSSSSS")
        res.status(200).json({ message: 'Webhook received successfully' });
        }else{
          res.status(500).json({ message: 'Internal server error' });
        }   
      } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else if(req.method === 'GET'){
        res.status(200).json({ message: 'Webhook Hitted' });
    }
  }