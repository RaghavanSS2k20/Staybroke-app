import { getWebPushClient } from "@/backend/utils/notification";
const webpush = getWebPushClient();
import { subscriptions } from "@/backend/utils/notification";
export default async function handler (req,res){
    if(req.method === 'POST'){
        const notificationPayload = {
            title: "New Notification",
            body: "This is a new notification",
            icon: "https://some-image-url.jpg",
            data: {
                url: "https://example.com",
            },
        };
        Promise.all(
            subscriptions.map((subscription) =>
            webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
            )
        )
            .then(() => res.status(200).json({ message: "Notification sent successfully." }))
            .catch((err) => {
            console.error("Error sending notification",err);
            res.sendStatus(500);
            });
    }
     else{
        res.status(405).json({
            message:"Method not allowed"
        })
    }
}