import Subscription from "@/backend/entities/notifcationSubscription/subscriptionModel";
import { getWebPushClient } from "@/backend/utils/notification";

const webpush = getWebPushClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const notificationPayload = {
    title: "Imported Lunch Expense",
    body: "The lunch expense has been imported from splitwise.",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  try {
    const subscriptions = await Subscription.find();
    console.log(subscriptions)
    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "No subscriptions found." });
    }

    await Promise.all(
     subscriptions.map((sub) => {
      console.log("notificationPayload", notificationPayload);
      webpush.sendNotification(sub, JSON.stringify(notificationPayload)).catch(async (err) => {
        console.error("Error sending to:", sub.endpoint, err);

        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.deleteOne({ endpoint: sub.endpoint });
          console.log(`Deleted stale subscription: ${sub.endpoint}`);
        }
      });
    })
    );

    return res.status(200).json({ message: "Notifications sent successfully." });
  } catch (err) {
    console.error("Unexpected error sending notifications", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
