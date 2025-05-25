// import SubscriptionModel from "@/models/SubscriptionModel";
// import subscriptionModel from "@/backend/entities/notifcationSubscription/subscriptionModel";
import Subscription from "@/backend/entities/notifcationSubscription/subscriptionModel";
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("1) SUBSCRIBE STARTING")
  const subscription = req.body;

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ message: "Invalid subscription format" });
  }
  console.log("2) SUBSCRIBE Goingon")

  try {
    // Avoid duplicate subscriptions
    const existing = await Subscription.findOne({ endpoint: subscription.endpoint });
    console.log("3) SHIT")
    if (existing) {
      return res.status(200).json({ message: "Subscription already exists" });
    }

    await Subscription.create(subscription);

    console.log("New subscription saved:", subscription);
    res.status(201).json({ status: "success", message: "Subscription saved" });
  } catch (err) {
    console.error("Error saving subscription:", err);
    res.status(500).json({ message: "Failed to save subscription" });
  }
}
